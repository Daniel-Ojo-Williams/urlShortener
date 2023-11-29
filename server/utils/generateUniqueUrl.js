import CustomError from "./customError.js";
import UrlShortener from "../schema/urlShort.js";
import { nanoid } from "nanoid";


const generateUniqueUrl = (userInput) => {
  return new Promise(async (resolve, reject) => {
    let isUnique = false;
    let shortUrl = userInput || nanoid(6).replace(/[o0OlI_-]/g, "");

    let attempts = 0;
    const checkForUniqueUrl = async () => {
      try {
        if (!userInput) {
          while (shortUrl.length < 6) {
            shortUrl = nanoid(6).replace(/[o0OlI_-]/g, "");
          }
        }
        let urlExists = await UrlShortener.findOne({ shortUrl });

        if (!urlExists) {
          isUnique = true;
        } else if (!isUnique && userInput.length > 0) {
          attempts = 10;
          reject(new CustomError("Key exists already, chose another or generate automatically"));
        } else if (!isUnique && attempts < 10) {
          attempts++;
          await checkForUniqueUrl();
        }
        
        if (isUnique) {
          resolve(shortUrl);
        } else {
          reject("An error occurred, please try again.");
        }

      } catch (error) {
        reject(error.message);
      }
    };
    await checkForUniqueUrl();
  });
};

export default generateUniqueUrl