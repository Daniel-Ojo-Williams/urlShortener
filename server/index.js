import express from "express";
import mongoose from 'mongoose'
import { getShortUrl, shortenLink } from "./controllers/index.js";
import 'dotenv/config'
import { CustomError, globalErrorHandler } from "./utils/index.js";
import cors from 'cors'
import * as url from 'url'
import { rateLimitUsingThirdParty } from "./middlewares/reateLimiter.js";

const app = express();


app.use(cors());
app.use(express.json());
app.set('trust proxy', 2);

const __dirname = url.fileURLToPath(new URL('../client/dist', import.meta.url))
app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'index.html')
}) 

app.post("/api/minify", rateLimitUsingThirdParty, shortenLink);

app.get("/:shortUrl", getShortUrl);

app.all('*', (req, res, next) => {
  throw new CustomError(`Invalid path: ${req.path}`, 404);
})

app.use(globalErrorHandler);

const PORT = process.env.PORT || 2000

const start = async () => {
  try {
      await mongoose.connect(process.env.DB_URI)

      console.log('DB Connected')

      app.listen(PORT, () => console.log("App started"));
    } catch (error) {
      console.log(error.message);
    }
}

start()

