import Artist from "../model/adminModel.js";
import Album from "../model/albumModel.js";

export const addAlbum = async (req, res, next) => {
  const { artist_id, name, year, hidden } = req.body;

  if (!artist_id || !name || !year || hidden === undefined) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Missing fields",
      error: null,
    });
  }

  try {
    const newAlbum = new Album({
      artist_id,
      name,
      year,
      hidden,
    });

    await newAlbum.save();

    return res.status(201).json({
      status: 201,
      data: null,
      message: "Album created successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
    return res.status(404).json({
      status: 404,
      data: null,
      message: "Resource Doesn't Exist",
      error: null,
    });
  }
};

export const allAlbums = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    if (artist_id) {
      const artist = await Artist.findOne({ artist_id });
      if (!artist) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "Artist not found, not valid artist ID",
          error: null,
        });
      }
    }

    const limitNumber = parseInt(limit, 10);
    const offsetNumber = parseInt(offset, 10);

    const filter = {};

    if (artist_id) {
      filter.artist_id = artist_id;
    }

    if (hidden !== undefined) {
      filter.hidden = hidden === "true";
    }

    const albums = await Album.aggregate([
      { $match: filter },
      { $skip: offsetNumber },
      { $limit: limitNumber },
      {
        $lookup: {
          from: "artists",
          localField: "artist_id",
          foreignField: "artist_id",
          as: "artist_details",
        },
      },
      {
        $addFields: {
          artist_name: { $arrayElemAt: ["$artist_details.name", 0] },
        },
      },
      { $project: { artist_details: 0 } },
    ]);

    return res.status(200).json({
      status: 200,
      data: albums,
      message: "Albums retrieved successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { album_id } = req.params;

    const album = await Album.findOne({ album_id });

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource doesn't exist.",
        error: null,
      });
    }

    const artist = await Artist.findOne({ artist_id: album.artist_id });

    const response = {
      album_id: album.album_id,
      artist_name: artist ? artist.name : "Unknown Artist",
      name: album.name,
      year: album.year,
      hidden: album.hidden,
    };

    return res.status(200).json({
      status: 200,
      data: response,
      message: "Album retrieved successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { album_id } = req.params;
    const updateFields = req.body;

    console.log("Request Parameters:", req.params);
    console.log("Request Body:", req.body);

    const album = await Album.findOne({ album_id });
    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource doesn't exist.",
        error: null,
      });
    }

    const updatedAlbum = await Album.findOneAndUpdate(
      { album_id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (updatedAlbum) {
      return res.status(204).json({
        status: 204,
        data: null,
        message: "Album updated successfully.",
        error: null,
      });
    }
  } catch (error) {
    next(error);

    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error.message || null,
    });
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { album_id } = req.params;

    console.log("Album ID received for deletion:", album_id);

    const album = await Album.findOne({ album_id });

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource doesn't exist.",
        error: null,
      });
    }

    const albumName = album.name;

    await album.deleteOne();

    return res.status(200).json({
      status: 200,
      data: null,
      message: `Album: ${albumName} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    next(error);

    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error.message || null,
    });
  }
};
