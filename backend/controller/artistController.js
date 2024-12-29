import Artist from "../model/adminModel.js";

export const addArtist = async (req, res, next) => {
  const { name, grammy, hidden } = req.body;

  if (!name || grammy === undefined || hidden === undefined) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Missing fields",
      error: null,
    });
  }

  try {
    const newArtist = new Artist({
      name,
      grammy,
      hidden,
    });

    await newArtist.save();

    return res.status(201).json({
      status: 201,
      data: null,
      message: "Artist created successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllArtists = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    const filter = {};

    if (grammy) {
      filter.grammy = grammy;
    }

    if (hidden !== undefined) {
      filter.hidden = hidden === "true";
    }

    const limitNumber = parseInt(limit, 10);
    const offsetNumber = parseInt(offset, 10);

    const artists = await Artist.find(filter)
      .skip(offsetNumber)
      .limit(limitNumber)
      .exec();

    return res.status(200).json({
      status: 200,
      data: artists,
      message: "Artists retrieved successfully!",
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

export const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findOne({ artist_id: id });

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found",
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: artist,
      message: "Artist retrieved successfully",
      error: null,
    });
  } catch (error) {}
};

export const updateArtist = async (req, res, next) => {
  const { id } = req.params;
  const { name, grammy, hidden } = req.body;

  if (!name && grammy === undefined && hidden === undefined) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: No fields provided to update",
      error: null,
    });
  }

  try {
    const artist = await Artist.findOne({ artist_id: id });

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    if (name) artist.name = name;
    if (grammy !== undefined) artist.grammy = grammy;
    if (hidden !== undefined) artist.hidden = hidden;

    await artist.save();

    return res.status(204).json({
      status: 204,
      data: null,
      message: "Artist updated successfully.",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (req, res, next) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findOne({ artist_id: id });

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found",
        error: null,
      });
    }

    await Artist.deleteOne({ artist_id: id });

    return res.status(200).json({
      status: 200,
      data: {
        artist_id: artist.artist_id,
      },
      message: `Artist: ${artist.name} deleted successfully.`,
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
