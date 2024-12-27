import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
})
.catch((error) =>{
    console.log('Error Connecting MongoDB', error);
    
});

const app = express();

app.use(express.json());
app.use(cookieParser);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    
})