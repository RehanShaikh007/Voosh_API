import mongoose from "mongoose";
import { v4 as uuidv4} from 'uuid';

const favoriteSchema = new mongoose.Schema({
    favorite_id: {
        type: String,
        default: uuidv4
    },
    category: {
        type: String,
        required: true,
        enaum: ['artist', 'album', 'track']
    },
    item_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
},{timestamps: true})

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;