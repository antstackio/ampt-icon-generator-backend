import { http } from "@ampt/sdk";
import express from "express";
import imageGeneraterRoute from "./src/routes/imageGenerater.route.js";
import bookmarkImageRoute from "./src/routes/bookmarkImage.route.js";
import cors from "cors";

const app = express();

// parse json request body
app.use(express.json());

// enable CORS
app.use(cors());

// Mount the imageGeneraterRoute as a middleware using the '/api/image-generater'
// path prefix. This means that all routes defined in imageGeneraterRoute
// will be accessible under '/api/image-generater' in the application.
app.use("/api/image-generater", imageGeneraterRoute);

// Mount the bookmarkImageRoute as a middleware using the '/api/bookmark/image'
// path prefix. This means that all routes defined in bookmarkImageRoute
// will be accessible under '/api/bookmark/image' in the application.
app.use("/api/bookmark/image", bookmarkImageRoute);

// Define a route that responds with Not Found when trying
// to access end points not present
app.use((req, res) => {
  res.status(404).send("Route Not Present");
});

http.node.use(app);
