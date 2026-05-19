// Productivity Quotes
const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Work expands to fill the time available for its completion.", author: "Parkinson's Law" },
  { text: "Your focus decides your reality.", author: "Star Wars" },
  { text: "You don't need more time, you just need more focus.", author: "Unknown" },
  { text: "Deep Work: Professional activities performed in a state of distraction-free concentration.", author: "Cal Newport" },
  { text: "Do first things first, and second things not at all.", author: "Peter Drucker" },
  { text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin" }
];

// Initialize Quote & Target Site Name
document.addEventListener("DOMContentLoaded", () => {
  // Pick random quote
  const randIdx = Math.floor(Math.random() * QUOTES.length);
  document.getElementById("quote-text").textContent = `"${QUOTES[randIdx].text}"`;
  document.getElementById("quote-author").textContent = QUOTES[randIdx].author;

  // Extract site parameter from URL query
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site");
  if (site) {
    document.getElementById("domain-badge").textContent = `${site.toUpperCase()} IS BLOCKED`;
  }

  // Setup click listeners dynamically to comply with Manifest V3 CSP
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", exitPage);
  }

  const dashboardBtn = document.getElementById("dashboard-btn");
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", goToDashboard);
  }
});

// Exit function
function exitPage() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Fallback: close the tab
    window.close();
  }
}

// Secondary action (e.g. redirect to useful site or just show message)
function goToDashboard() {
  window.location.href = "https://google.com";
}
