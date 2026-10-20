import joi from "joi";

const ridesSchema = joi.object({
  car_make: joi.string().required(),
  rides_available: joi.number().required(),
  id: joi.string().required(),
  
});

export default ridesSchema;