// FocusGuard Fixed - Popup Controller

// Keep category sizes in sync with background.js
const SOCIAL_COUNT = 10;
const NEWS_COUNT = 29;
const ADULT_COUNT = 31;

// DOM Elements
const toggleSocial = document.getElementById("toggle-social");
const toggleNews = document.getElementById("toggle-news");
const toggleAdult = document.getElementById("toggle-adult");
const domainInput = document.getElementById("domain-input");
const addBtn = document.getElementById("add-domain-btn");
const listContainer = document.getElementById("custom-list-container");
const blockedCountVal = document.getElementById("blocked-count");

// Helper to clean domain inputs
function cleanDomain(url) {
  if (!url) return "";
  let clean = url.trim().toLowerCase();
  
  // Remove protocol
  if (clean.includes("://")) {
    clean = clean.split("://")[1];
  }
  
  // Remove path
  clean = clean.split("/")[0];
  
  // Remove port
  clean = clean.split(":")[0];
  
  // Remove www.
  if (clean.startsWith("www.")) {
    clean = clean.substring(4);
  }
  
  return clean;
}

// Load configurations on startup
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["socialEnabled", "newsEnabled", "adultEnabled", "customSites"], (result) => {
    // Force enable blocks if they were somehow disabled, as the UI toggles are now hidden
    const socialEnabled = true;
    const newsEnabled = true;
    const adultEnabled = true;
    const customSites = result.customSites || [];

    // Update storage if needed
    if (result.socialEnabled !== true || result.newsEnabled !== true || result.adultEnabled !== true) {
      chrome.storage.local.set({
        socialEnabled: true,
        newsEnabled: true,
        adultEnabled: true
      });
    }

    // Set UI checkboxes
    toggleSocial.checked = socialEnabled;
    toggleNews.checked = newsEnabled;
    toggleAdult.checked = adultEnabled;

    // Render list
    renderCustomList(customSites);
    updateBlockedCounter(socialEnabled, newsEnabled, adultEnabled, customSites.length);
  });
});

// Update Toggles
toggleSocial.addEventListener("change", () => {
  const enabled = toggleSocial.checked;
  chrome.storage.local.set({ socialEnabled: enabled }, () => {
    updateStatistics();
  });
});

toggleNews.addEventListener("change", () => {
  const enabled = toggleNews.checked;
  chrome.storage.local.set({ newsEnabled: enabled }, () => {
    updateStatistics();
  });
});

toggleAdult.addEventListener("change", () => {
  const enabled = toggleAdult.checked;
  chrome.storage.local.set({ adultEnabled: enabled }, () => {
    updateStatistics();
  });
});

// Add Custom Domain
addBtn.addEventListener("click", addCustomDomain);
domainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addCustomDomain();
  }
});

function addCustomDomain() {
  const rawInput = domainInput.value;
  const cleaned = cleanDomain(rawInput);

  if (!cleaned) return;

  chrome.storage.local.get(["customSites"], (result) => {
    const customSites = result.customSites || [];
    
    if (customSites.includes(cleaned)) {
      // Highlight existing
      domainInput.style.borderColor = "#ff4a5a";
      setTimeout(() => {
        domainInput.style.borderColor = "";
      }, 1000);
      return;
    }

    // Add and Save
    customSites.push(cleaned);
    chrome.storage.local.set({ customSites: customSites }, () => {
      domainInput.value = "";
      renderCustomList(customSites);
      updateStatistics();
    });
  });
}

// Render Custom Blocked Sites List
function renderCustomList(sites) {
  listContainer.innerHTML = "";

  if (sites.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">No custom websites blocked yet.</div>';
    return;
  }

  sites.forEach((site, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    
    const domainText = document.createElement("span");
    domainText.textContent = site;
    domainText.title = site;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "🚫";
    delBtn.title = "Unblock";
    delBtn.addEventListener("click", () => {
      removeCustomDomain(index);
    });

    item.appendChild(domainText);
    item.appendChild(delBtn);
    listContainer.appendChild(item);
  });
}

// Remove Custom Domain
function removeCustomDomain(index) {
  chrome.storage.local.get(["customSites"], (result) => {
    const customSites = result.customSites || [];
    customSites.splice(index, 1);
    
    chrome.storage.local.set({ customSites: customSites }, () => {
      renderCustomList(customSites);
      updateStatistics();
    });
  });
}

// Stats helper
function updateStatistics() {
  chrome.storage.local.get(["socialEnabled", "newsEnabled", "adultEnabled", "customSites"], (result) => {
    const socialEnabled = result.socialEnabled !== undefined ? result.socialEnabled : true;
    const newsEnabled = result.newsEnabled !== undefined ? result.newsEnabled : true;
    const adultEnabled = result.adultEnabled !== undefined ? result.adultEnabled : true;
    const customSites = result.customSites || [];
    updateBlockedCounter(socialEnabled, newsEnabled, adultEnabled, customSites.length);
  });
}

function updateBlockedCounter(social, news, adult, customCount) {
  let total = 0;
  if (social) total += SOCIAL_COUNT;
  if (news) total += NEWS_COUNT;
  if (adult) total += ADULT_COUNT;
  total += customCount;
  blockedCountVal.textContent = total;
}
