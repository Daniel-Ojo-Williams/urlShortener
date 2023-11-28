import express from "express";
import mongoose from 'mongoose'
import UrlShortener from './schema/urlShort.js'
import 'dotenv/config'
import { nanoid } from 'nanoid'
import { generateUniqueUrl } from "./utils/generateUniqueUrl.js";
import { isWebUri } from "valid-url";
import CustomError from "./utils/customError.js";
import asyncErrorHandler from "./utils/asyncErrorHandler.js";
import globalErrorHandler from "./utils/errorHandler.js";

const app = express();

app.use(express.json());

app.post('/',  asyncErrorHandler(async (req, res) => {
  const { longUrl, userOption } = req.body

  if(!longUrl) {
    throw new CustomError('Enter longUrl to shorten', 381)
  }

  if(!isWebUri(longUrl)){
    throw new CustomError('Invalid url, url must be a valid (http or https) url', 381)
  }

  const shortUrl = await generateUniqueUrl(userOption)

  if(shortUrl){
    await UrlShortener.create({
      shortUrl,
      longUrl,
    })
  }
  
  res.status(200).json({ shortUrl });
  
}))

app.get("/:shortUrl", asyncErrorHandler(async (req, res) => {
  const { shortUrl } = req.params;

  if(!shortUrl){
    throw new CustomError('Enter shortUrl', 381)
  }

  const urlDoc = await UrlShortener.findOne({shortUrl});
  
  if(!urlDoc) {
    throw new CustomError('Page not found', 404)
  }
  res.redirect(301, urlDoc.longUrl);
}));

app.all('*', (req, res, next) => {
  throw new CustomError(`Invalid path: ${req.path}`, 404);
})

app.use(globalErrorHandler);

const start = async () => {
  try {
      await mongoose.connect(process.env.DB_URI)

      console.log('DB Connected')

      app.listen(2000, () => console.log("App started"));
    } catch (error) {
      console.log(error.message);
    }
}

start()

