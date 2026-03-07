import config from "./sidepanel/config";


const API_URL = config.API_URL ?? "http://localhost:8000/api";

// Track recently sent URLs to avoid duplicates (30-min window)
const recentlySent = new Map();
const DEDUP_WINDOW = 30 * 60 * 1000; // 30 minutes

// Open Side Panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listen for tab updates — fires when a page finishes loading
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when page is fully loaded
  if (changeInfo.status !== "complete") return;

  // Skip non-http pages (chrome://, about:, etc.)
  if (!tab.url || !tab.url.startsWith("http")) return;

  // Skip common noise pages
  const skipDomains = ["google.com/search", "chrome.google.com", "localhost"];
  if (skipDomains.some((d) => tab.url.includes(d))) return;

  // Dedup — don't send the same URL within 30 minutes
  const lastSent = recentlySent.get(tab.url);
  if (lastSent && Date.now() - lastSent < DEDUP_WINDOW) return;

  // Get JWT token from storage
  const { token } = await chrome.storage.local.get("token");
  if (!token) return; // Not logged in

  // Send to backend
  try {
    const response = await fetch(`${API_URL}/nodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: tab.url,
        title: tab.title || "",
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      recentlySent.set(tab.url, Date.now());
      console.log(`[DeepTrail] Captured: ${tab.title}`);
    }
  } catch (error) {
    console.error("[DeepTrail] Failed to send:", error);
  }
});

// Clean up old entries from dedup map every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [url, timestamp] of recentlySent) {
    if (now - timestamp > DEDUP_WINDOW) {
      recentlySent.delete(url);
    }
  }
}, 10 * 60 * 1000);