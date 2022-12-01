const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8080;
const usersRouter = require("./routes/usersRoutes");
const groupsRouter = require("./routes/groupsRoutes");
const statsRouter = require("./routes/statsRoutes");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/stats", statsRouter);

app.listen(port, () => console.log(`listening on port: ${port}`));
