import { scan } from "./index.mjs";
import axios from "axios";
const img = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACnSURBVAjXPcyxbcJAAADAi+UBvsBy8wUuPAFCKAXKAnRuGSAjZJAUGSCtq3gDKoQ8AZHexTcWRGIDKJByA9zL/e3n/qk3NqxiNB+yvZXiDzMi5pxlyQ0lk7qJ1t0GDH0vJIorxpSFqhKqSk5AqVmSRt/D4F+zVCw+WnEbqWsQt9HivVX+ns9kdru1gNvl4oryNE0OKctfz6rrNkKgND/blDI4HnltWw9VhjdFJre8DQAAAABJRU5ErkJggg==",
    "base64"
  ),
  sImg = (
    await axios.get(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Smiling_high_school_girl_with_square_glasses_s-4012097278.webp/220px-Smiling_high_school_girl_with_square_glasses_s-4012097278.webp.png",
      { responseType: "arraybuffer" }
    )
  ).data;

console.log("Internal: ", await scan(img, { v: true }), "\n");
console.log("External: ", await scan(sImg, { v: true }));
process.exit();
