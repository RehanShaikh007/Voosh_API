import mongoose from "mongoose";
import { v4 as uuidV4 } from "uuid";

const albumSchema = new mongoose.Schema({
  album_id: {
    type: String,
    default: uuidV4,
  },
  artist_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const Album = mongoose.model("Album", albumSchema);
export default Album;
