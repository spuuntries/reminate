# **Reminate** 🤔

## Is this image AI-generated?

> **NOTE: THIS IS AN ESM PACKAGE, USING IT IN A COMMONJS CONTEXT IS NOT RECOMMENDED.** ⚠️

This is a (***NON-OFFICIAL***) wrapper over [**Illuminarty**]("https://illuminarty.ai") via Playwright. 

# Usage 📄

```js
import { scan } from "reminate";
```

The API is pretty simple, it's literally just one method, if `0x907A70` adds anything new I'll try to include it as soon as possible.

## scan(img[, options])

- `img` - An image `Buffer`.[^1]
- `options` - Options `Object`.
  - `options.mime` - MIME type of the file, by default uses magic numbers, you can override the behaviour with this.[^2]
  - `options.v` - Verbosity option, for debugging purposes.

Example code:

```js
import { scan } from "reminate";
const img = Buffer.from(  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACNSURBVBjTVY0hEoMwEEXfQO8RwUT0Dl3Va6A4BgrFNSq6Gg6x2OrYNNeISAWUCc/99+fvUg7sPZZRpHzN/qo0nNwBSDGepioBER59fy23bSOGAICqklICoM05T69h4AM451jXlWVZ8N7TAhPO7f+OBcCz6/azwhUBYgjcAAyr9J7MoJnnGRDM6p2gqvwAd69B5aCGok4AAAAASUVORK5CYII=",
  "base64"
);

console.log(await scan(img));
```

## WIP 📝
- Proxying to circumvent rate-limit.
- Replacing Playwright with form emulation.

## Footnotes 🦶
[^1]: has to be a `Buffer`, support for b64 and URL may come, but no guarantees, it's not like it's that hard anw to just preprocess. 🤷  
[^2]: Illuminarty currently only supports `["jpg", "jpeg", "png", "webp", "jfif"]`.
