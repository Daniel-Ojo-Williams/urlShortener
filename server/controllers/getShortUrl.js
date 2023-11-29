import { asyncErrorHandler, CustomError } from "../utils/index.js";
import UrlShortener from "../schema/urlShort.js";


const getShortUrl = asyncErrorHandler(async (req, res) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    throw new CustomError("Enter shortUrl", 381);
  }

  const urlDoc = await UrlShortener.findOne({ shortUrl });

  if (!urlDoc) {
    throw new CustomError("Page not found", 404);
  }
  res.redirect(301, urlDoc.longUrl);
});

export default getShortUrl