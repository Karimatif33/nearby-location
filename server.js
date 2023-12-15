require('dotenv').config()
const http = require('http')
const app = require("./index")
require('./dbConnect')
const PORT = process.env.Port || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
