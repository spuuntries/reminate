import { webkit } from "playwright";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

const browser = await webkit.launch(),
  logger = console.log;

async function newLaunch() {
  let page = await browser.newPage();
  await page.goto("https://illuminarty.ai/en/illuminate");
  return page;
}

/**
 * @param {Buffer} imageBuffer - Image buffer
 * @param {number} maxSize - Max size
 */
async function compressImage(imageBuffer, maxSize) {
  if (imageBuffer.length <= maxSize) {
    return [imageBuffer, 0];
  }

  let compressedImageBuffer = imageBuffer,
    compressedSize = imageBuffer.length,
    minQuality = 50,
    maxQuality = 100,
    resQuality;
  while (compressedSize > maxSize) {
    const quality = Math.floor((minQuality + maxQuality) / 2),
      image = sharp(compressedImageBuffer);
    compressedImageBuffer = await image
      .jpeg({ quality })
      .toBuffer()
      .catch((error) => {
        throw new Error(`Error compressing image: ${error}`);
      });
    compressedSize = compressedImageBuffer.length;
    if (compressedSize > maxSize) {
      minQuality = quality + 1;
    } else {
      maxQuality = quality;
    }

    if (minQuality == maxQuality) {
      minQuality = 1;
      maxQuality = 50;
    }

    resQuality = quality;
  }
  return [compressedImageBuffer, resQuality];
}

/**
 * Scan an image.
 * @param {Buffer} img - Image buffer to scan.
 * @param {Object} [options] - {Optional} Optional args.
 * @param {string} [options.mime] - {Optional} MIME type of the Image, will use magic numbers instead if not specified.
 * @param {boolean} [options.v] - {Optional} Debug logging.
 * @param {number} [options.timeout] - {Optional} Custom timeout, by default the function will throw after 60 seconds if page doesn't load.
 * @returns {Promise<number>} Probability of AI-generation.
 */
async function scan(img, options) {
  if (!options) options = {};
  const v = options.v,
    mime = options.mime,
    timeout = options.timeout || 60000,
    ftime = performance.now();
  if (v) logger(`Config: ${v}, ${mime}, ${timeout}`);

  if (v) logger("Launching page...");
  const page = await newLaunch();
  if (v) logger("Launched");

  if (v) logger("Determining MIME type");
  let type = mime ? mime : (await fileTypeFromBuffer(img)).mime;
  if (v) logger("MIME type: " + type);

  if (!["jpg", "jpeg", "png", "webp", "jfif"].includes(type.split("/")[1]))
    throw new Error("MIME type unsupported!");

  if (v) logger("Waiting for input selector...");
  await page.waitForSelector("#inputfile", {
    state: "attached",
    timeout: timeout,
  });
  if (v) logger("Input is open.");

  if (v) logger("Preprocessing image if needed...");
  img = compressImage(img, 3 * 1024 * 1024);
  if (v) logger("Processed.");

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
