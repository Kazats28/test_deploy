import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const videoSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
}, modelOptions);
export default mongoose.model('Video', videoSchema);