import mongoose from 'mongoose'

const { Schema } = mongoose

const urlSchema = new Schema({
  shortUrl: {type: String, unique: true},
  longUrl: String,
  lastAccessed: {type: Date, deafult: Date.now()},
  createdAt: {type: Date, deafult: Date.now()}
})

export default mongoose.model('UrlShort', urlSchema)