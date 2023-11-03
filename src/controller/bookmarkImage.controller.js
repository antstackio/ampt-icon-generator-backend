import { storage, params } from "@ampt/sdk";
import { data } from "@ampt/data";
import bookmarkImageValidation from "../validations/bookmarkImage.validation";

const imageStorage = storage("images");

// middleware controller function to bookmark image
const bookmarkImage = async (req, res) => {
  let validImage;
  try {
    validImage =
      await bookmarkImageValidation.bookmarkImageSchema.validateAsync(req.body);
  } catch (error) {
    // Send Client Error Message
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  try {
    // check if image exists or not
    const imageExists = await imageStorage.exists(
      `/generatedImage/${req.body.imageId}`
    );
    if (!imageExists) {
      res.status(404).send({ success: false, message: "Image Not Found" });
      return;
    }

    // get bookmarked images list for logged in user
    let bookmarkedImages = await data.get(
      `bookmarkedImageList:${req.user.email}`
    );
    if (!bookmarkedImages) {
      bookmarkedImages = [];
    }
    // add imageId to bookmarked list and persist to DB
    bookmarkedImages.push(req.body.imageId);
    await data.set(`bookmarkedImageList:${req.user.email}`, bookmarkedImages);
    // respond with appropriate message
    res.status(201).send({ success: true, message: "Image Bookmarked" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export default { bookmarkImage };
