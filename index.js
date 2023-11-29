
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('./dbConnect')
const Location = require("./Schema");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());



app.post("/location", async (req, res) => {
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
            type: 'Point',
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
          type: 'Point',
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
app.get("/nearbyLocations", async (req, res) => {
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

    res.json({ location: userLocation.name, nearbyLocations });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/all-locations", async (req, res) => {
  try {
    const allLocations = await Location.find({});
    res.json({ allLocations });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/locations-by-category", async (req, res) => {
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
app.get("/location/:id", async (req, res) => {
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
