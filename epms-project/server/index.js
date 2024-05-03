import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import router from "./routes/routes.js";

// this loads environment variables from .env file
dotenv.config();

const app = express();

// through this, express can parse json requests
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'https://epms-proj.vercel.app'
// }));


// const port = process.env.PORT || Math.floor(Math.random() * 10000) + 1;

//mongoose setup
mongoose
  // .connect(process.env.MONG_URI)
  .connect(process.env.MONG_URI + "EmployeeManagement", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
      console.log("Connected to Database");
    });
  })
  .catch((error) => {
    console.log(error);
  });

// the following enables us to use the defined router for handling incoming HTTP requests at the root ('/') endpoint. this basically ensures that any requests to the root endpoint will be directed to the router.

app.use("/", router);

export default app;

// this router is defined in the 'routes.js' file, which contains the application's specific routes
