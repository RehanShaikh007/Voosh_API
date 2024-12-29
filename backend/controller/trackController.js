import Artist from "../model/adminModel.js";
import Album from "../model/albumModel.js";
import Track from "../model/trackModel.js";

export const addTrack = async (req, res, next) => {
  try {
    const { artist_id, album_id, name, duration, hidden } = req.body;

    console.log("Track creation payload received:", req.body);

    if (!artist_id || !album_id || !name || !duration) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Missing required fields.",
        error: null,
      });
    }

    const artistExists = await Artist.findOne({ artist_id });
    if (!artistExists) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist: Artist not found.",
        error: null,
      });
    }

    const albumExists = await Album.findOne({ album_id });
    if (!albumExists) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist: Album not found.",
        error: null,
      });
    }

    const track = new Track({
      name,
      duration,
      hidden: hidden,
      artist_id,
      album_id,
    });

    await track.save();

    return res.status(201).json({
      status: 201,
      data: null,
      message: "Track created successfully",
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

export const allTracks = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

    console.log("Raw Query Parameters:", req.query);

    const limitNumber = parseInt(limit, 10);
    const offsetNumber = parseInt(offset, 10);

    console.log(`Limit: ${limitNumber}, Offset: ${offsetNumber}`);

    const filter = {};

    if (artist_id) {
      filter.artist_id = artist_id;
    }
    if (album_id) {
      filter.album_id = album_id;
    }
    if (hidden !== undefined) {
      filter.hidden = hidden === "true";
    }

    console.log("Filters object:", filter);

    const tracks = await Track.find(filter)
      .skip(offsetNumber)
      .limit(limitNumber)
      .populate("artist_id", "name")
      .populate("album_id", "name");

    if (tracks.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist: No tracks found.",
        error: null,
      });
    }

    const trackDetails = await Promise.all(
      tracks.map(async (track) => {
        const artist = await Artist.findOne({ artist_id: track.artist_id });
        const album = await Album.findOne({ album_id: track.album_id });

        return {
          track_id: track.track_id,
          artist_name: artist ? artist.name : "Unknown Artist",
          album_name: album ? album.name : "Unknown Album",
          name: track.name,
          duration: track.duration,
          hidden: track.hidden,
        };
      })
    );

    return res.status(200).json({
      status: 200,
      data: trackDetails,
      message: "Tracks retrieved successfully.",
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

export const getTrackById = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log("Track ID received", id);

    const track = await Track.findOne({ track_id: id });

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    const artist = await Artist.findOne({ artist_id: track.artist_id });

    const album = await Album.findOne({ album_id: track.album_id });

    const response = {
      track_id: track.track_id,
      artist_name: artist ? artist.name : "Unknown Artist",
      album_name: album ? album.name : "Unknown Album",
      name: track.name,
      duration: track.duration,
      hidden: track.hidden,
    };

    return res.status(200).json({
      status: 200,
      data: response,
      message: "Track retrieved successfully.",
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

export const updateTrack = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, duration, hidden } = req.body;

    const track = await Track.findOne({ track_id: id });

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    if (name) {
      track.name = name;
    }
    if (duration) {
      track.duration = duration;
    }
    if (hidden !== undefined) {
      track.hidden = hidden;
    }

    await track.save();

    return res.status(204).json({
      status: 204,
      data: null,
      message: "Track updated successfully.",
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

export const deleteTrack = async (req, res, next) => {
  try {
    const { id } = req.params;

    const track = await Track.findOne({ track_id: id });

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Resource Doesn't Exist",
        error: null,
      });
    }

    await Track.deleteOne({ track_id: id });

    return res.status(200).json({
      status: 200,
      data: null,
      message: `Track: ${track.name} deleted successfully.`,
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
