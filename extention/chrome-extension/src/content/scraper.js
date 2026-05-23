const BASE_URL = "https://www.amazon.";
const EXPECTED_URL = "/hz/mycd/digital-console/contentlist";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const books = [];
let currentPage = 1;

const downloadJSON = async (data) => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books.json";
    const arrayBuffer = await blob.arrayBuffer();
    const fileHash = await crypto.subtle.digest("SHA-256", arrayBuffer);
    console.log("File hash: ", fileHash);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    // store the hash in db to check later
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

const moveToNextPage = async () => {
  const pagination = document.querySelector(".pagination");
  const page = pagination.querySelector(".page-item.active");
  const nextPage = page.nextElementSibling;
  if (nextPage) {
    nextPage.click();
    await wait(3000);
    return true;
  }
  return false;
};

const sendToPage = async (data) => {
  try {
    await downloadJSON(data);
  } catch (error) {
    console.error("Failed to download:", error);
  }
};

const scrapeDocTitles = async (list, pagesAmount) => {
  list.forEach((row) => {
    const img = row.querySelector("img");
    const title = row.querySelector(".digital_entity_title_no_link").innerText;
    const author = row.querySelector(".information_row").innerText;
    books.push({ title, author, img: img.src });
  });
  console.log("scraped books: ", books.length);
  const nextPage = await moveToNextPage();
  if (nextPage) {
    scrapeBookTitles(pagesAmount);
  } else {
    console.log("No more pages.");
    console.log("Total books scraped: ", books.length);
    console.log("All books scraped: ", books);
    sendToPage(books);
  }
};

const scrapeBookTitles = async (pagesAmount) => {
  console.log("Scraping page: ", currentPage);
  const bookClass = "ListItem-module_row";
  const booksList = Array.from(
    document.querySelector("table").querySelector("tbody").children,
  );
  const bookRows = booksList.filter((row) => {
    return Array.from(row.classList).some((cls) => cls.startsWith(bookClass));
  });
  if (globalThis.location.href.includes("pdocs"))
    return scrapeDocTitles(bookRows, pagesAmount);
  bookRows.forEach((row) => {
    const img = row.querySelector("img");
    const title = row.querySelector(".digital_entity_title").innerText;
    const author = row.querySelector(".information_row").innerText;
    books.push({ title, author, img: img.src });
  });
  console.log("scraped books: ", books.length);
  const nextPage = await moveToNextPage();

  if (nextPage && currentPage < pagesAmount) {
    currentPage += 1;
    scrapeBookTitles(pagesAmount);
  } else {
    console.log("No more pages.");
    console.log("Total books scraped: ", books.length);
    console.log("All books scraped: ", books);
    sendToPage(books);
  }
};

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScraping") {
    scrapeBookTitles(message.pagesAmount);
    sendResponse({ status: "Scraping started" });
  }
});
