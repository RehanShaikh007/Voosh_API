import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';

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
app.use(cookieParser());


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    
})


app.use('/api/v1', userRoute);
app.use('/api/v1/users', adminRoute);
