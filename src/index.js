const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/BookRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/books", bookRoutes);
app.use("/categories", categoryRoutes);
app.use("/user", userRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(8080, () => console.log(`server is running in port 8080`));

mongoose
  .connect("", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.error(err));

mongoose.set("useFindAndModify", false);
