import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import ridesSchema from "../models/rides.js";

async function getAllRides(req, res, next) {
  try {
    const params = {
      TableName: "Rides",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createRides(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    console.log(req.body)
    const { error, value } = ridesSchema.validate(req.body);
console.log(error)
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, car_make, rides_available } = value;

    const params = {
      TableName: "Rides",
      Item: {
        id,
        car_make,
        rides_available,
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created ride", data: params.Item });
  } catch (error) {
    next(error);
  }
}

async function getRidesByCar(req, res, next) {
  const rideid = req.params.id;
  try {
    const params = {
      TableName: "Rides",
      Key: { id: rideid },
    };
    const command = new GetCommand(params);
    const result = await database.send(command);
    if (!result.Item) {
      return res.status(404).json({ message: "No rides found" });
    }
    res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}


async function deleteRidesByCar(req, res, next) {
  const rideid = req.params.id;
  try {
    const params = {
      TableName: "Rides",
      Key: { id: rideid },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


async function updateRidesbyCar(req, res, next) {
  try {
    const ride_Id = req.params.id;
    req.body.id = ride_Id;
    const { error, value } = ridesSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { rideid, car_make, rides_available } = value;

    // Get the movie from DynamoDB
    const getParams = {
      TableName: "Rides",
      Key: { id: ride_Id },
    };

    const getCommand = new GetCommand(getParams);

    const result = await database.send(getCommand);

    const ride = result.Item;

    if (!ride) {
      return res.status(404).json({ message: "No ride found" });
    }

    // Update the rides in DynamoDB
    const updateParams = {
      TableName: "Rides",
      Key: { id: ride_Id },
      UpdateExpression:
        "set #rideid = :rideid, #car_make = :car_make, #rides_available = :rides_available",
      ExpressionAttributeNames: {
        "#rideid": "rideid",
        "#car_make": "car_make",
        "#rides_available": "rides_available",
      },
      ExpressionAttributeValues: {
        ":rideid": rideid,
        ":car_make": car_make,
        ":rides_available": rides_available,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedAccount = await database.send(updateCommand);

    res.status(200).json(updatedAccount.Attributes);
  } catch (err) {
    next(err);
  }
}


export default {
  getAllRides,
  createRides,
  getRidesByCar,
  deleteRidesByCar,
 updateRidesbyCar
};