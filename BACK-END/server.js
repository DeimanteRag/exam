const mongoose = require("mongoose");
const app = require("./app");

const mongoURI = "mongodb+srv://dragauskaitee:a6Hxg8A1WhhXLdFc@cluster0.dqj2baa.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI).then(console.log("DB connection established."));

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


