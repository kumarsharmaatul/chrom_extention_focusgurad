# 🛡️ FocusGuard Fixed

> **A premium, high-performance, and beautifully designed Manifest V3 Chrome Extension that helps you reclaim your focus by dynamically blocking social media, news portals, and custom distracting websites.**

FocusGuard Fixed transitions your browsing experience from a distraction-filled environment into a serene productivity sanctuary. Built using modern glassmorphism design parameters and a dynamic filtering architecture, FocusGuard protects your time without complex setups or heavy performance footprints.

---

## ✨ Features

### 1. ⚡ Dynamic Rules Engine (Manifest V3)
Unlike old-school blockers that use heavy static configs or deprecated background interception routines, FocusGuard leverages the **Chrome Declarative Net Request (DNR) API** to dynamically block and redirect pages with sub-millisecond efficiency.
*   **ON/OFF Category Toggles**: Turn blocking categories ON or OFF in real-time from the dashboard (Social Media, News Channels, Adult Content).
*   **Smart URL Normalization**: Automatically strips protocols (`http://`, `https://`), paths (`/subpage`), port numbers, and `www.` prefixes to block full domains accurately.
*   **Robust Redirect Architecture**: Uses clean static extension resource paths to guarantee validation compatibility with Manifest V3 specifications.

### 2. 🔞 Adult Content Protection
Includes a high-precision, comprehensive list of **31 major pornography and adult website domains** preloaded for direct, instant block filtering (including `hd-easyporn.com`). Ideal for high-discipline productivity regimes.

### 3. 📱 Premium Glassmorphic Dashboard
A visually gorgeous interface styled using custom modern typography (**Outfit** font) and futuristic aesthetics:
*   Real-time **Blocked Site Statistics Counter**.
*   Customized toggles with sliding animations and glowing indicators.
*   A responsive **Custom Block List manager** where you can add websites on-the-fly, see items with fade-in entries, and delete them instantly.

### 3. 🧠 Inspiring Focus Page (`blocked.html`)
When you hit a blocked domain, you aren't greeted with a boring, frustrating system error. FocusGuard provides:
*   A luxury dark-theme landing page with ambient glow animation orbs.
*   A pulsing **Cyber Shield padlock SVG illustration**.
*   A **Live Motivational Quote Generator** featuring 10+ selected quotes from deep thinkers (Steve Jobs, Aristotle, Stephen King, Cal Newport, and more) to encourage you to stick to your goals.
*   Smart history exit buttons (`history.back()` with seamless fallback to tab closing).

---

## 🛠️ Built With

*   **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3 Grid & Flexbox
*   **APIs Used**: Chrome Storage API (`chrome.storage.local`), Chrome Declarative Net Request API (`chrome.declarativeNetRequest`)
*   **Design Paradigm**: Glassmorphism (Backdrop filters, neon glow variables, cyber-indigo styling)
*   **Typography**: *Outfit* Google Font

---

## 🚀 Quick Setup & Installation

To load and test the extension locally:

1.  **Clone or Download** this repository to your machine.
2.  Open Google Chrome and type `chrome://extensions/` in the URL search bar.
3.  Turn **ON** the **"Developer mode"** toggle in the top-right corner.
4.  Click the **"Load unpacked"** button in the top-left corner.
5.  Select this project directory (the folder containing `manifest.json`).
6.  Pin **FocusGuard Fixed** to your Chrome toolbar, open the popup, and enjoy instant distraction-free browsing!

---

## 🗂️ Project Structure

```bash
├── manifest.json       # Manifest V3 Extension Configuration & Web Accessible Resources
├── background.js      # Dynamic rule processor & storage sync worker
├── popup.html          # Beautiful glassmorphic UI dashboard
├── popup.js            # Validation, custom site management, and popup event handler
├── blocked.html        # Highly styled focus/redirect page with quote generator
├── icon.png            # Premium glowing cyber shield extension logo
└── .gitignore          # Repository version control ignores
```

---

## 🛡️ License

This project is open-source and free to customize. Start guard-railing your time and build greatness! 🚀
