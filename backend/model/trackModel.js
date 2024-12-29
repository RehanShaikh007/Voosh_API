import mongoose, { mongo } from "mongoose";
import {v4 as uuidV4} from 'uuid';

const trackSchema = new mongoose.Schema({
    track_id:{
        type: String,
        default: uuidV4
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    artist_id: {
        type: String,
        required: true
    },
    album_id: {
        type: String,
        required: true
    }
});

const Track = mongoose.model('Track', trackSchema);

export default Track;