import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Router from "./views/router.js"; // <-- ADD THIS LINE

const port = 3000;
const app = express();

app.use(express.json());
app.use(Router); // <-- ADD THIS LINE

async function startServer() {
  try {
    app.listen(port, () => console.log(`🤖 Listening on Port: ${port}`));
  } catch (err) {
    console.log("🤖 Oh no something went wrong", err);
  }
}

startServer();