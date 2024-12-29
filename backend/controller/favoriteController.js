import Artist from "../model/adminModel.js";
import Album from "../model/albumModel.js";
import Favorite from "../model/favoriteModel.js";
import Track from "../model/trackModel.js";
import { verifyToken } from "../utils/verifyViewer.js";

export const addFavorite = async (req, res, next) => {
  try {
    const { category, item_id } = req.body;
    console.log("Item Id:", item_id);

    if (!["artist", "album", "track"].includes(category)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request. Must be 'artist', 'album', or 'track'.",
        error: null,
      });
    }

    if (!item_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request. Item ID is required.",
        error: null,
      });
    }

    let item;
    if (category === "artist") {
      item = await Artist.findOne({ artist_id: item_id });
    } else if (category === "album") {
      item = await Album.findOne({ album_id: item_id });
    } else if (category === "track") {
      item = await Track.findOne({ track_id: item_id });
    }
    if (!item) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    const user_id = req.user.user_id;
    console.log("User Id:", user_id);

    const newFavorite = new Favorite({
      category,
      item_id,
      user_id,
    });

    await newFavorite.save();

    return res.status(201).json({
      status: 201,
      data: null,
      message: "Favorite added successfully",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorite = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;

    if (!["artist", "album", "track"].includes(category)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request. Category must be 'artist', 'album', or 'track'.",
        error: null,
      });
    }

    const user_id = req.user.user_id;

    const favorites = await Favorite.find({ category, user_id })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    const result = [];

    for (let favorite of favorites) {
      let item = null;
      if (category === "artist") {
        item = await Artist.findOne({ artist_id: favorite.item_id });
      } else if (category === "album") {
        item = await Album.findOne({ album_id: favorite.item_id });
      } else if (category === "track") {
        item = await Track.findOne({ track_id: favorite.item_id });
      }

      if (item) {
        result.push({
          favorite_id: favorite.favorite_id,
          category: favorite.category,
          item_id: favorite.item_id,
          name: item.name,
          created_at: favorite.createdAt,
        });
      }
    }

    return res.status(200).json({
      status: 200,
      data: result,
      message: "Favorites retrieved successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { favorite_id } = req.params;

    const favorite = await Favorite.findOne({ favorite_id });

    if (!favorite) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource doesn't exist.",
        error: null,
      });
    }

    const user_id = req.user.user_id;

    if (favorite.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden: You can only remove your own favorites",
        error: null,
      });
    }

    await Favorite.deleteOne({ favorite_id });

    return res.status(200).json({
      status: 200,
      data: null,
      message: "Favorite removed successfully",
      error: null,
    });
  } catch (error) {
    next(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
};
