const AsyncHandler = require("express-async-handler");
const Location = require("../model/Schema");

exports.CreateLocationDb = AsyncHandler(async (req, res) => {
  const { name, lat, lon, category } = req.body;

  if (!name || !lat || !lon || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let location = await Location.findOne({ name });

    if (location) {
      location = await Location.findOneAndUpdate(
        { name },
        {
          lat,
          lon,
          category,
          loc: {
            type: "Point",
            coordinates: [lon, lat],
          },
        },
        { new: true }
      );
    } else {
      location = await Location.create({
        name,
        lat,
        lon,
        category,
        loc: {
          type: "Point",
          coordinates: [lon, lat],
        },
      });
    }

    const earthRadius = 6371;

    const nearbyLocations = await Location.find({
      _id: { $ne: location._id },
      loc: {
        $geoWithin: {
          $centerSphere: [[lon, lat], 5 / earthRadius],
        },
      },
    }).sort({ priority: -1 });

    res.status(201).json({
      message: "Location created/updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.NearbyLocations = AsyncHandler(async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Lat and lon are required." });
  }

  try {
    const queryCoordinates = [parseFloat(lon), parseFloat(lat)];

    const userLocation = await Location.findOne({
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: queryCoordinates,
          },
          $maxDistance: 5000,
        },
      },
    });

    if (!userLocation) {
      return res.status(404).json({ error: "Location not found." });
    }
    const near = "Near ";
    const nearbyLocations = await Location.find({
      _id: { $ne: userLocation._id },
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: queryCoordinates,
          },
          $maxDistance: 5000,
        },
      },
    });
    console.log(nearbyLocations, near + userLocation.name);
    res.json({
      location: near + userLocation.name,
      userLocation,
      nearbyLocations,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.AllLocations = AsyncHandler(async (req, res) => {
  try {
    const allLocations = await Location.find({});
    res.json({ allLocations });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.LocationByCategory = AsyncHandler(async (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ error: "Category is required." });
  }

  try {
    const locationsByCategory = await Location.find({ category });
    res.json({ locationsByCategory });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.SingleLocation = AsyncHandler(async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ error: "Location not found." });
    }

    res.json({ location });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
