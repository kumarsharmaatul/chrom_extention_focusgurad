// FocusGuard Blocker - Service Worker (Dynamic Rules Engine)

const SOCIAL_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "reddit.com",
  "tiktok.com",
  "pinterest.com",
  "snapchat.com",
  "tumblr.com",
  "youtube.com"
];

const NEWS_DOMAINS = [
  "ndtv.com",
  "ndtv.in",
  "aajtak.in",
  "aajtak.intoday.in",
  "abplive.com",
  "republicworld.com",
  "indiatvnews.com",
  "zeenews.india.com",
  "news18.com",
  "tv9hindi.com",
  "tv9bharatvarsh.com",
  "jagran.com",
  "bhaskar.com",
  "amarujala.com",
  "thehindu.com",
  "indianexpress.com",
  "indiatoday.in",
  "hindustantimes.com",
  "livemint.com",
  "moneycontrol.com",
  "economictimes.indiatimes.com",
  "bbc.com",
  "bbc.co.uk",
  "cnn.com",
  "foxnews.com",
  "nytimes.com",
  "reuters.com",
  "aljazeera.com",
  "bloomberg.com"
];

const ADULT_DOMAINS = [
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "xhamster.com",
  "redtube.com",
  "youporn.com",
  "pornmd.com",
  "hqporner.com",
  "spankbang.com",
  "chaturbate.com",
  "tube8.com",
  "stripchat.com",
  "camsoda.com",
  "livejasmin.com",
  "onlyfans.com",
  "tnaflix.com",
  "beeg.com",
  "eporner.com",
  "heavy-r.com",
  "motherless.com",
  "crazyshit.com",
  "yuvutu.com",
  "xtube.com",
  "thumbzilla.com",
  "anybunny.com",
  "youjizz.com",
  "boundhub.com",
  "fapdu.com",
  "tubegalore.com",
  "pornkey.com",
  "hd-easyporn.com"
];

// Helper to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

// Main function to rebuild and apply DNR rules dynamically
async function updateBlockingRules() {
  try {
    const data = await chrome.storage.local.get(["socialEnabled", "newsEnabled", "adultEnabled", "customSites"]);
    
    // Default values if undefined
    const socialEnabled = data.socialEnabled !== undefined ? data.socialEnabled : true;
    const newsEnabled = data.newsEnabled !== undefined ? data.newsEnabled : true;
    const adultEnabled = data.adultEnabled !== undefined ? data.adultEnabled : true;
    const customSites = data.customSites || [];

    let domainsToBlock = [];

    // Add predefined social media
    if (socialEnabled) {
      SOCIAL_DOMAINS.forEach(d => domainsToBlock.push(d));
    }

    // Add predefined news domains
    if (newsEnabled) {
      NEWS_DOMAINS.forEach(d => domainsToBlock.push(d));
    }

    // Add predefined adult domains
    if (adultEnabled) {
      ADULT_DOMAINS.forEach(d => domainsToBlock.push(d));
    }

    // Add custom domains after cleaning
    customSites.forEach(site => {
      const clean = cleanDomain(site);
      if (clean && !domainsToBlock.includes(clean)) {
        domainsToBlock.push(clean);
      }
    });

    // Fetch existing dynamic rules to clear
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map(r => r.id);

    // Build the new rules array using static extensionPath to avoid any Chrome validation errors
    const newRules = domainsToBlock.map((domain, index) => {
      return {
        id: index + 1, // Rule IDs must be positive integers
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            extensionPath: "/blocked.html"
          }
        },
        condition: {
          urlFilter: `||${domain}`,
          resourceTypes: ["main_frame"]
        }
      };
    });

    // Apply the rules in atomic operation
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: newRules
    });
    
    console.log(`FocusGuard: Rules updated successfully. Blocking ${newRules.length} domains.`);
  } catch (err) {
    console.error("FocusGuard Error: Failed to update dynamic rules.", err);
  }
}

// Listener for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.socialEnabled || changes.newsEnabled || changes.adultEnabled || changes.customSites) {
    updateBlockingRules();
  }
});

// Listener for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["socialEnabled", "newsEnabled", "adultEnabled", "customSites"], (result) => {
    const socialEnabled = result.socialEnabled !== undefined ? result.socialEnabled : true;
    const newsEnabled = result.newsEnabled !== undefined ? result.newsEnabled : true;
    const adultEnabled = result.adultEnabled !== undefined ? result.adultEnabled : true;
    const customSites = result.customSites || [];

    chrome.storage.local.set({
      socialEnabled,
      newsEnabled,
      adultEnabled,
      customSites
    }, () => {
      updateBlockingRules();
    });
  });
});

// Trigger dynamic update on startup to ensure rules are aligned
updateBlockingRules();
