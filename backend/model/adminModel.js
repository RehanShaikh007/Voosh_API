import mongoose from "mongoose";
import { v4 as uuidV4 } from "uuid";

const artistSchema = new mongoose.Schema({
  artist_id: {
    type: String,
    default: uuidV4,
  },
  name: {
    type: String,
    required: true,
  },
  grammy: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
