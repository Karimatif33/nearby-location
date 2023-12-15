const express = require("express");

const {
    CreateLocationDb,
    NearbyLocations,
    AllLocations,
    LocationByCategory,
    SingleLocation
  } = require("../controller/AllController");

  const AllRoutes = express.Router();
  AllRoutes.post("/", CreateLocationDb)
  AllRoutes.get("/nearbyLocations", NearbyLocations)
  AllRoutes.get("/all-locations", AllLocations)
  AllRoutes.get("/locations-by-category", LocationByCategory)
  AllRoutes.get("/:id", SingleLocation)

  module.exports = AllRoutes;
