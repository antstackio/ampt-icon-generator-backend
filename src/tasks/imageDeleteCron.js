import { task, storage } from "@ampt/sdk";
import { data } from "@ampt/data";

const imageStorage = storage("images");

const imageDeleteTask = task(
  "Delete Non-Bookmarked Images Every Day",
  async (event) => {
    // This code block will run at 1 am every day
    let tempImageList = await data.get("temporaryImageStore");

    for (let imageI = 0; imageI < tempImageList.length; imageI++) {
      await imageStorage.remove(
        `/generatedImage/${tempImageList[imageI].imageId}`
      );
    }
    await data.set("temporaryImageStore", []);
  }
);

export default imageDeleteTask;
