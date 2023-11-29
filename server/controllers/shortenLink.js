import { asyncErrorHandler, CustomError, generateUniqueUrl } from "../utils/index.js";
import { isWebUri } from "valid-url";
import UrlShortener from "../schema/urlShort.js";

const shortenLink = asyncErrorHandler(async (req, res) => {
  const { longUrl, userOption } = req.body;

  if (!longUrl) {
    throw new CustomError("Enter longUrl to shorten", 381);
  }

  if (!isWebUri(longUrl)) {
    throw new CustomError(
      "Invalid url, url must be a valid (http or https) url",
      381
    );
  }

  const shortUrl = await generateUniqueUrl(userOption);

  if (shortUrl) {
    await UrlShortener.create({
      shortUrl,
      longUrl,
    });
  }

  res.status(200).json({ shortUrl });
});

export default shortenLink;