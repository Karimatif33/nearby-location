const mongoose = require ("mongoose");
// mongoose.set("strictQuery", false);
const dbConnect = async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URL || "",
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