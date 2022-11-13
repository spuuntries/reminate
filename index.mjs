import { webkit, Page } from "playwright";
import { fileTypeFromBuffer } from "file-type";

const browser = await webkit.launch();
/** @type {Page} */
var page;

async function newLaunch() {
  page = await browser.newPage();
  await page.goto("https://illuminarty.ai/en/illuminate");
}

/**
 * Scan an image.
 * @param {Buffer} img - Image buffer to scan.
 * @param {string} [mime] - {Optional} MIME type of the Image, will use magic numbers instead if not specified.
 * @returns {number} Probability of AI-generation.
 */
async function scan(img, mime) {
  await newLaunch();
  let type = mime ? mime : (await fileTypeFromBuffer(img)).mime;
  if (!["jpg", "jpeg", "png", "webp", "jfif"].includes(type.split("/")[1]))
    throw new Error("MIME type unsupported!");

  page
    .locator("#inputfile")
    .setInputFiles({
      name: "img." + mime.split("/")[1],
      mimeType: type,
      buffer: img,
    });
}
