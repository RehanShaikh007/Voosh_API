import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import artistRoute from "./routes/artistRoutes.js";
import albumRoute from "./routes/albumRoutes.js";
import trackRoute from "./routes/trackRoutes.js";
import favoriteRoute from "./routes/favoriteRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("Error Connecting MongoDB", error);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Welcome to Voosh Music Library Management API!');
  });
  

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

app.use("/api/v1", userRoute);
app.use("/api/v1/users", adminRoute);
app.use("/api/v1/artists", artistRoute);
app.use("/api/v1/albums", albumRoute);
app.use("/api/v1/tracks", trackRoute);
app.use("/api/v1/favorites", favoriteRoute);
