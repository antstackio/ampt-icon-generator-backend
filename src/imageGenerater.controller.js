import axios from "axios";
import { storage, params } from "@ampt/sdk";
import { data } from "@ampt/data";

const imageStorage = storage("images");

// middleware controller function to handle generate image api's
const generateImage = async (req, res) => {
  try {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: params("imageGenerateApi") + "Prod/image",
      headers: {
        "Content-Type": "text/plain",
      },
      data: req.body.prompt,
      responseType: "arraybuffer",
    };

    // make api request to generate image
    let response = await axios.request(config);

    // get count of images from the DB to determine next id
    let imageCount = await data.get("imageIdCount");
    if (!imageCount) {
      await data.set("imageIdCount", 0);
      imageCount = 0;
    }
    const newImageId = await data.add("imageIdCount", 1);

    // store generated image in S3
    await imageStorage.write(`/generatedImage/${newImageId}`, response.data, {
      type: "image/jpeg",
    });

    // get saved images download url
    const imageUrl = await imageStorage.getDownloadUrl(
      `/generatedImage/${newImageId}`
    );

    // send image id and image url as success response
    res.send({ success: false, data: { id: newImageId, imageUrl: imageUrl } });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export default { generateImage };
