const BASE_URL = "https://www.amazon.";
const EXPECTED_URL = "/hz/mycd/digital-console/contentlist";

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setup,
    args: [tab],
  });
});

function setup(tab) {
  const url = globalThis.location.href;
  console.log({ url, tab });
  if (
    !globalThis.location.href.startsWith(BASE_URL) ||
    !globalThis.location.href.includes(EXPECTED_URL)
  ) {
    alert("This extension only works on Amazon Kindle Content page.");
    return;
  }
  // inject the helper functions into the page context
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("popup/popup.js");
  (document.head || document.documentElement).appendChild(script);
}
