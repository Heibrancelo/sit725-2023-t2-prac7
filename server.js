let express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { disconnect } = require("process");

let app = express();
let port = process.env.PORT || 3000;

let http = require('http').createServer(app);
let io = require('socket.io')(http);




// Express configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));


//Socket added to Node JS
io.on("connection", (socket) => {
  console.log("A user has connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 1000);
});



// MongoDB configurations
const dbName = "Cat-Database";
const uri =
  "mongodb+srv://s223529731:s223529731@cluster0.aiwgshe.mongodb.net/?retryWrites=true&w=majority";
let collection;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function runDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Initialize the collection once the connection is established
    collection = client.db(dbName).collection("allCats");
  } catch (ex) {
    console.error("Error connecting to MongoDB:", ex);
  }
}

// Functions to interact with MongoDB
function insertCat(cat, callback) {
  collection.insertOne(cat, callback);
}

function getAllCats(callback) {
  collection.find({}).toArray(callback);
}

// Express routes
app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/api/cat", (req, res) => {
  let cat = req.body;

  cat.imagePath = cat.imagePath || "./images/kitten.jpeg";

  console.log(cat);
  insertCat(cat, (err, result) => {
    if (err) {
      return res.json({ statusCode: 500, message: "Failed to insert cat." });
    }
    res.json({ statusCode: 201, data: result, message: "success" });
  });
});

app.get("/api/cats", (req, res) => {
  getAllCats((err, result) => {
    if (err) {
      return res.json({ statusCode: 500, message: "Failed to fetch cats." });
    }
    res.json({ statusCode: 200, data: result, message: "success" });
  });
});

http.listen(port, () => {
  console.log("Express server started on port " + port);
  runDB();
});
