const BASE_URL = "https://www.amazon.";
const EXPECTED_URL = "/hz/mycd/digital-console/contentlist";

const checkUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  const url = currentTab.url;
  if (!url.startsWith(BASE_URL) || !url.includes(EXPECTED_URL)) {
    alert("This extension only works on Amazon Kindle Content page.");
    return false;
  }
  return true;
};

window.onload = () => {
  const button = document.getElementById("start");
  button.addEventListener("click", async function () {
    if (!(await checkUrl())) return;
    const pages = document.getElementById("pages").value;
    const mapAmount = {
      all: Infinity,
      one: 1,
      three: 3,
      five: 5,
    };
    const pagesAmount = mapAmount[pages];

    // Get active tab and execute scraping in that tab's context
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;

    // Inject the scraper.js file
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content/scraper.js"],
    });

    // Call scrapeBookTitles with the page amount
    await chrome.tabs.sendMessage(tabId, {
      action: "startScraping",
      pagesAmount: pagesAmount,
    });
  });
};
