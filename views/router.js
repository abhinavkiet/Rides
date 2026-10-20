import express from "express";
import ridesController from "../controllers/ridesController.js";

const Router = express.Router();

Router.route("/rides")
  .get(ridesController.getAllRides)
  .post(ridesController.createRides);

  Router.route("/rides/:car") 
  .get(ridesController.getRidesByCar)
  .post(ridesController.updateRidesbyCar)
  .delete(ridesController.deleteRidesByCar);

export default Router;
