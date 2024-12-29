import express from "express";
import { verifyToken } from "../utils/verifyViewer.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import { verifyEditor } from "../utils/verifyEditor.js";
import {
  addAlbum,
  allAlbums,
  deleteAlbum,
  getAlbumById,
  updateAlbum,
} from "../controller/albumController.js";

const router = express.Router();

router.post("/add-album", verifyToken, verifyAdmin, addAlbum);
router.get("/", verifyToken, allAlbums);
router.get("/:album_id", verifyToken, getAlbumById);
router.put("/:album_id", verifyToken, verifyEditor, updateAlbum);
router.delete("/:album_id", verifyToken, verifyEditor, deleteAlbum);

export default router;
