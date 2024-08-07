import mongoose from "mongoose";

const url = process.env.MONGO_URI;
export const connectUsingMongoose = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("<----->Connected Using Mongoose On Mongodb<----->");
    } catch (error) {
      console.log("Something went wrong while connecting to DataBase");
      console.log(error);
    }
  };

