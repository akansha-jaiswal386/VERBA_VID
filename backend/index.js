const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./Routes/userRouter.js");
// require("./connection.js");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.get("/ping", (req, res) => {
    res.send("Pong");
});
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use("/auth", router);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});