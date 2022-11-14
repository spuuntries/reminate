import { webkit } from "playwright";
import { fileTypeFromBuffer } from "file-type";

const browser = await webkit.launch(),
  logger = console.log;

async function newLaunch() {
  let page = await browser.newPage();
  await page.goto("https://illuminarty.ai/en/illuminate");
  return page;
}

/**
 * Scan an image.
 * @param {Buffer} img - Image buffer to scan.
 * @param {Object} [options] - {Optional} Optional args.
 * @param {string} [options.mime] - {Optional} MIME type of the Image, will use magic numbers instead if not specified.
 * @param {boolean} [options.v] - {Optional} Debug logging.
 * @returns {Promise<number>} Probability of AI-generation.
 */
async function scan(img, options) {
  if (!options) options = {};
  const v = options.v,
    mime = options.mime,
    ftime = performance.now();
  if (v) logger("Launching page...");
  const page = await newLaunch();
  if (v) logger("Launched");

  if (v) logger("Determining MIME type");
  let type = mime ? mime : (await fileTypeFromBuffer(img)).mime;
  if (v) logger("MIME type: " + type);

  if (!["jpg", "jpeg", "png", "webp", "jfif"].includes(type.split("/")[1]))
    throw new Error("MIME type unsupported!");

  if (v) logger("Loading image...");
  await page.locator("#inputfile").setInputFiles({
    name: "img." + type.split("/")[1],
    mimeType: type,
    buffer: img,
  });
  if (v) logger("Loaded!");

  if (v) logger("Waiting for server to process...");
  await page.waitForSelector(
    "body > div.container > div:nth-child(3) > p > strong",
    { state: "attached" }
  );
  if (v) logger("Done.");

  if (v) logger("Grabbing elem.");
  let result = (
    await page
      .locator("body > div.container > div:nth-child(3) > p > strong")
      .innerText()
  ).replace("%", "");
  if (v) logger("Grabbed.");

  if (v) logger("Closing page...");
  await page.close();
  if (v) logger("Closed.");

  const stime = Math.floor((performance.now() - ftime) / 1000);
  if (v) logger("Exec took: " + stime.toString() + "s");
  return Number(result);
}

export { scan };
