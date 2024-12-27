import mongoose from "mongoose";
import { v4 as uuidV4 } from 'uuid';

const userSchema = new mongoose.Schema({
   user_id: {
    type: String,
    default: uuidV4
   },
   email: {
    type: String,
    required: true,
    unique: true
   },
   password: {
    type: String,
    required: true
   },
   role: {
    type: String,
    enum: ['Admin', 'Editor', 'Viewer']
   }
})

const User = mongoose.model('User', userSchema);
export default User;