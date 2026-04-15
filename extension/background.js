const CONFIG = {
  API_BASE: "https://deep-trial.onrender.com/api",
  // API_BASE: "http://localhost:8000/api",
};

// ── Track recently saved URLs to avoid duplicates ────────────
const recentlySaved = new Map();
const DEDUP_WINDOW = 5 * 60 * 1000; // 5 minutes

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    config: CONFIG,
    autoSaveEnabled: false, // OFF by default — user must opt in
  });
});

// ── Open Side Panel on icon click ────────────────────────────
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// ── Auto-save: listen for completed page loads ───────────────
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  // Check if auto-save is enabled
  const { autoSaveEnabled } = await chrome.storage.local.get("autoSaveEnabled");
  if (!autoSaveEnabled) return;

  // Skip non-http pages (chrome://, about:, extensions, etc.)
  if (!tab.url || !tab.url.startsWith("http")) return;

  // Skip common non-content pages
  const skipPatterns = [
    "chrome.google.com/webstore",
    "accounts.google.com",
    "mail.google.com",
    "calendar.google.com",
    "chrome://",
    "about:",
  ];
  if (skipPatterns.some((pattern) => tab.url.includes(pattern))) return;

  // Dedup — skip if saved recently
  const now = Date.now();
  if (recentlySaved.has(tab.url) && now - recentlySaved.get(tab.url) < DEDUP_WINDOW) return;

  // Save the page
  const result = await savePage(tab.url, tab.title);

  if (result.success) {
    recentlySaved.set(tab.url, now);

    // Notify side panel
    chrome.runtime.sendMessage({
      type: "PAGE_SAVED",
      ...result,
      autoSaved: true,
    }).catch(() => {});
  }
});

// ── Keyboard shortcut: Ctrl+Shift+S ─────────────────────────
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "save-current-page") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.url || !tab.url.startsWith("http")) return;

    const result = await savePage(tab.url, tab.title);

    chrome.runtime.sendMessage({
      type: "PAGE_SAVED",
      ...result,
    }).catch(() => {});
  }
});

// ── Message listener (side panel communication) ──────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Manual save from side panel
  if (message.type === "SAVE_CURRENT_PAGE") {
    (async () => {
      let { url, title } = message;

      if (!url) {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab) {
          url = tab.url;
          title = tab.title;
        }
      }

      if (!url || !url.startsWith("http")) {
        sendResponse({ success: false, error: "No valid page to save" });
        return;
      }

      const result = await savePage(url, title);
      sendResponse(result);
    })();
    return true;
  }

  // Toggle auto-save from side panel
  if (message.type === "TOGGLE_AUTO_SAVE") {
    (async () => {
      const { autoSaveEnabled } = await chrome.storage.local.get("autoSaveEnabled");
      const newValue = !autoSaveEnabled;
      await chrome.storage.local.set({ autoSaveEnabled: newValue });
      sendResponse({ autoSaveEnabled: newValue });
    })();
    return true;
  }

  // Get auto-save status
  if (message.type === "GET_AUTO_SAVE_STATUS") {
    (async () => {
      const { autoSaveEnabled } = await chrome.storage.local.get("autoSaveEnabled");
      sendResponse({ autoSaveEnabled: !!autoSaveEnabled });
    })();
    return true;
  }
});

// ── Core save function ───────────────────────────────────────
async function savePage(url, title) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) {
    return { success: false, error: "Not logged in" };
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE}/nodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        title: title || "",
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log(`[DeepTrail] Saved: ${title}`);
      return { success: true, url, title };
    }

    const errorText = await response.text().catch(() => "Unknown error");
    return { success: false, error: `Server responded ${response.status}: ${errorText}` };
  } catch (error) {
    console.error("[DeepTrail] Failed to save:", error);
    return { success: false, error: error.message };
  }
}