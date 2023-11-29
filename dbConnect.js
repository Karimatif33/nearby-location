const mongoose = require ("mongoose");
// mongoose.set("strictQuery", false);
const dbConnect = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://karimatif33233:Karim010@cluster0.rgmh6dc.mongodb.net/LocationApp",
        {
          retryWrites: true,
          wtimeoutMS: 2500,
        }
      );
      console.log("DB Connected Successfully");
    } catch (err) {
      console.error("DB Connection failed", err.message);
    }
  };
dbConnect()