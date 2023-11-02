import Joi from "joi";

const bookmarkImageSchema = Joi.object({
  imageId: Joi.number().required(),
});

export default { bookmarkImageSchema };
