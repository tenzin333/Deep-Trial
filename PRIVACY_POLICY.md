# DeepTrail — Privacy Policy

**Last updated:** May 27, 2026  
**Extension version:** 1.0.2  
**Developer:** Tenzin Thinlay · [github.com/tenzin333](https://github.com/tenzin333) · tenthinlay007@gmail.com

---

## Overview

DeepTrail is a Chrome Extension that builds a personal AI knowledge graph from your browsing history. This Privacy Policy explains what data we collect, how we use it, who we share it with, how we store it, and what controls you have over your data.

By installing or using DeepTrail, you agree to the practices described in this policy.

---

## 1. Data We Collect

### 1.1 Account Data
| Data | Why We Collect It |
|------|-------------------|
| Email address | Required to create and identify your account |
| Password | Used for authentication; stored only as a bcrypt hash — never in plain text |

### 1.2 Browsing Activity Data
When you save a page (manually with **Ctrl+Shift+S** or automatically with auto-save enabled), we collect:

| Data | Why We Collect It |
|------|-------------------|
| Page URL | To identify and de-duplicate pages in your knowledge graph |
| Page title | To display a readable label for each node in your graph |
| Extracted page text (up to 30 KB) | To generate AI summaries, keywords, and semantic embeddings |
| Timestamp of the visit | To order and display your captured pages |

### 1.3 Locally Stored Data (On Your Device Only)
| Data | Storage Location | Purpose |
|------|-----------------|---------|
| JWT authentication token | `chrome.storage.local` | Keeps you signed in across sessions |
| Email address | `chrome.storage.local` | Displays your email in the extension header |
| Auto-save preference (on/off) | `chrome.storage.local` | Remembers your auto-save setting |
| API configuration | `chrome.storage.local` | Stores the backend URL |

---

## 2. Data We Do NOT Collect

- Content from **Google services** (Gmail, Google Calendar, Google Accounts, Google Search) — explicitly excluded
- Content from **Chrome internal pages** (chrome://, about:blank, etc.) — explicitly excluded
- Content from the **Chrome Web Store** — explicitly excluded
- Passwords in plain text
- Financial information, credit card numbers, or banking data
- Health or medical information
- Precise geolocation data
- Contacts, calendar entries, or photos
- Audio, video, or microphone input
- Any data from pages you do **not** save

---

## 3. How We Use Your Data

| Data | How It Is Used |
|------|----------------|
| Email + password hash | Account authentication and login |
| Saved page URLs, titles, timestamps | Building your personal knowledge graph; displaying Activity Feed |
| Extracted page text | Input for AI summarization and semantic embedding generation |
| AI summaries and keywords | Displayed in your graph and Activity Feed |
| 768-dimensional vector embeddings | Computing similarity scores to automatically link related pages |
| User search queries (when you use the Search/RAG feature) | Finding semantically relevant pages and generating AI answers |

We do **not** use your data to:
- Display advertising
- Build profiles for sale to third parties
- Train AI models on your personal content (data is only passed transiently to third-party APIs)

---

## 4. Third-Party Services

DeepTrail sends data to the following third-party services to provide AI features. **We do not sell your data to any third party.**

| Service | Data Sent | Purpose | Their Privacy Policy |
|---------|-----------|---------|----------------------|
| **Google Gemini API** | Extracted text from each saved page (up to 30 KB) | Generates 768-dimensional semantic embeddings for similarity matching | [Google Privacy Policy](https://policies.google.com/privacy) |
| **Groq API (LLaMA-3.3-70b)** | (1) First 4 KB of page text — for summarization. (2) Your natural-language question + relevant page summaries — for AI answers (RAG) | Generates page summaries, keywords, and answers your search queries | [Groq Privacy Policy](https://groq.com/privacy-policy/) |
| **Jina Reader API** | Page URL only (not page content) | Extracts readable text from JavaScript-heavy pages when standard parsing fails | [Jina AI Privacy Policy](https://jina.ai/legal/#privacy-policy) |

> **Important:** Page content sent to these services is transmitted transiently solely for processing. DeepTrail does not instruct these providers to use your data for training their models.

---

## 5. Data Storage & Security

| Aspect | Detail |
|--------|--------|
| **Storage location** | PostgreSQL database hosted on [Render](https://render.com) (United States) |
| **Password security** | All passwords are hashed using bcrypt with a unique salt before storage; plain-text passwords are never stored or logged |
| **Data in transit** | All communication between the extension and our backend uses HTTPS/TLS encryption |
| **Authentication** | JWT (JSON Web Token) tokens with short expiry windows; tokens stored only in your browser's local storage |
| **Embeddings** | 768-dimensional vectors derived from your page content are stored alongside page records for similarity search |
| **No analytics/tracking** | We do not use analytics services, advertising SDKs, or crash-reporting tools that could independently access your data |

---

## 6. User Controls & Data Deletion

You have full control over your data:

| Action | How To Do It |
|--------|-------------|
| **Disable auto-save** | Settings tab → toggle "Auto-Save Pages" off. The extension will only save pages you manually trigger with Ctrl+Shift+S |
| **Delete a single page** | Graph tab → click a node → select Delete |
| **Delete all saved data** | Graph tab → "Clear All" button — permanently removes all your nodes, summaries, embeddings, and connections |
| **Sign out** | Settings tab → "Sign Out" — removes your token from the browser |
| **Delete your account** | Contact us at **tenthinlay007@gmail.com** with the subject "Account Deletion Request" — we will permanently delete your account and all associated data within 30 days |

> **Note:** Deleting all nodes removes all associated summaries, keywords, embeddings, and graph connections. This action cannot be undone.

---

## 7. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Saved pages (URLs, titles, summaries, embeddings) | Until you delete them manually or delete your account |
| Account credentials | Until you request account deletion |
| Local browser data (token, preferences) | Until you sign out or uninstall the extension |
| Data sent to third-party APIs (Gemini, Groq, Jina) | Processed transiently; DeepTrail has no control over the retention policies of those providers |

We do not have an automatic purge schedule. You are responsible for managing and deleting your own data.

---

## 8. Children's Privacy

DeepTrail is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us at tenthinlay007@gmail.com and we will delete it promptly.

---

## 9. Changes to This Policy

We may update this Privacy Policy as the extension evolves. When we do, we will:
- Update the "Last updated" date at the top of this document
- If the changes are material, note them in the Chrome Web Store listing update notes

Continued use of the extension after changes constitutes acceptance of the updated policy.

---

## 10. Contact

For privacy questions, data deletion requests, or concerns:

**Tenzin Thinlay**  
📧 tenthinlay007@gmail.com  
🐙 [github.com/tenzin333](https://github.com/tenzin333)  

Please allow up to 7 business days for a response.

---

*DeepTrail is an open-source project. You can review exactly what data the extension accesses in the source code at [github.com/tenzin333/deeptrail](https://github.com/tenzin333/deeptrail).*
