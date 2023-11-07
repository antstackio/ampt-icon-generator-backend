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

/**
 * This is an asynchronous function that retrieves the list of bookmarked images for the currently logged in user.
 * It fetches the list of bookmarked image IDs from the database using the user's email as a key.
 * Then, it iterates over the list of image IDs, checks if each image exists in the storage, and if it does,
 * it fetches the download URL for the image and adds it to the imageUrlList.
 * The function returns a list of URLs for all existing bookmarked images.
 * If an error occurs during the process, it logs the error and sends a response with a status of 500 (Internal Server Error).
 *
 * @param {Object} req - The request object, containing user details and other request parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 */
const getBookmarkedImageList = async (req, res) => {
  try {
    // get bookmarked images list for logged in user
    let bookmarkedImages = await data.get(
      `bookmarkedImageList:${req.user.email}`
    );

    let imageUrlList = [];
    // iterate through each imageid and get the image url
    for (
      let imageIndex = 0;
      imageIndex < bookmarkedImages.length;
      imageIndex++
    ) {
      let imageExists = await imageStorage.exists(
        `/generatedImage/${bookmarkedImages[imageIndex]}`
      );
      if (!imageExists) {
        continue;
      }

      // download url and add to the list
      let imageUrl = await imageStorage.getDownloadUrl(
        `/generatedImage/${bookmarkedImages[imageIndex]}`
      );
      imageUrlList.push({ id: bookmarkedImages[imageIndex], value: imageUrl });
    }
    res.status(200).send(imageUrlList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

/**
 * This is an asynchronous function that deletes a bookmarked image for the currently logged in user.
 * It fetches the list of bookmarked image IDs from the database using the user's email as a key.
 * Then, it finds the index of the image ID to be deleted in the bookmarked images list.
 * If the image ID is found, it is removed from the bookmarked images list and the updated list is saved back to the database.
 * The function also removes the image from the storage.
 * If an error occurs during the process, it logs the error and sends a response with a status of 500 (Internal Server Error).
 *
 * @param {Object} req - The request object, containing user details and other request parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 */
const deleteBookmarkedImage = async (req, res) => {
  let validImage;
  try {
    validImage =
      await bookmarkImageValidation.bookmarkImageSchema.validateAsync(
        req.params
      );
  } catch (error) {
    // Send Client Error Message
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  try {
    // get bookmarked images list for logged in user
    let bookmarkedImages = await data.get(
      `bookmarkedImageList:${req.user.email}`
    );

    const index = bookmarkedImages.indexOf(req.params.imageId);
    bookmarkedImages.splice(index, 1);
    await data.set(`bookmarkedImageList:${req.user.email}`, bookmarkedImages);

    // delete image from S3
    await imageStorage.remove(`/generatedImage/${req.body.imageId}`);

    res
      .status(200)
      .send({ success: true, message: "Removed Image from Bookmarks" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export default { bookmarkImage, getBookmarkedImageList, deleteBookmarkedImage };
