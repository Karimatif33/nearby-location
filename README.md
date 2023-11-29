Location-based Services API
Overview

This project implements a RESTful API for managing and retrieving location-based data. It utilizes Express.js for handling HTTP requests, MongoDB for data storage using Mongoose ODM, and integrates geospatial querying for location-based functionalities.
Setup

    Install Dependencies:
    npm install

Set Up Environment:

Ensure you have MongoDB installed and running.

Run the Server:



    
    "start": "node index.js" --- npm start
    "dev": "nodemon server.js" --- npm run dev
      
  

    The server will start on http://localhost:3000 by default.

API Endpoints
Create or Update Location

    POST /location

    Create or update a location with details like name, latitude, longitude, and category.

 Example Request Body:

 json

    {
      "name": "Location Name",
      "lat": 40.7128,
      "lon": -74.006,
      "category": "Category Name"
    }

Get Nearby Locations

    GET /nearbyLocations?lat={latitude}&lon={longitude}

    Retrieve locations nearby a specified latitude and longitude within a 5km radius by default.

Get All Locations

    GET /all-locations

    Retrieve all locations stored in the database.

Get Locations by Category

    GET /locations-by-category?category={category}

    Retrieve locations filtered by a specific category.

Get Location by ID

    GET /location/:id

    Retrieve a specific location by its ID.

Error Handling

    400 Bad Request: Missing or invalid parameters in the request.
    404 Not Found: When a requested resource is not found.
    500 Internal Server Error: For any unexpected server errors.

Usage

    Ensure proper authentication and authorization mechanisms are implemented before deploying this API in a production environment.
    The API provides basic functionalities and can be extended to include user authentication, additional data validation, and error handling enhancements.


    Karim Atif


---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
To test online use " https://nearby-location.onrender.com " insted of  http://localhost:3000 
example 

       https://nearby-location.onrender.com/all-locations
