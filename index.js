import express from "express";
import { dbConnection } from "./database/db.js";
import bodyParser from "body-parser";
import { apiRequestLimiter } from "./middleware/apiRateLimiter.js";
import { CONFIG } from "./config/config.js";
import {
  searchUser,
  getUser,
  updateUser,
  follow,
  unfollow,
} from "./controllers/UserController.js";
dbConnection();
const app = express();
const PORT = CONFIG.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apiRequestLimiter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/users", searchUser);
app.get("/user/:id", getUser);
app.put("/user", updateUser);
app.put("/user/follow", follow);
app.put("/user/unfollow", unfollow);

app.listen(PORT, () => {
  console.log(`server run at ${PORT}`);
});
