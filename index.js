import { http } from "@ampt/sdk";
import express from "express";
import imageGeneraterRoute from "./src/imageGenerate.route.js";

const app = express();

// parse json request body
app.use(express.json());

// Mount the imageGeneraterRoute as a middleware using the '/api/image-generater'
// path prefix. This means that all routes defined in imageGeneraterRoute
// will be accessible under '/api/image-generater' in the application.
app.use("/api/image-generater", imageGeneraterRoute);

// Define a route that responds with Not Found when trying
// to access end points not present
app.use((req, res) => {
  res.statusCode(httpStatus.NOT_IMPLEMENTED).send("Route Not Present");
});

http.node.use(app);
