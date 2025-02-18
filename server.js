// Load environment variables
require('dotenv').config();
console.log("dotenv loaded. MONGO_URI:", process.env.MONGO_URI);

// Require dependencies
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// Ensuring the MongoDB URI is set
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing! Check your .env file.");
  process.exit(1);
}

// Connecting to MongoDB using Mongoose
mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  connectTimeoutMS: 30000  // 30 seconds
})
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  });

// Initializing Express app
const app = express();

// Middleware: Method Override and Body Parsers
app.use(methodOverride('_method'));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json({ limit: '50mb' }));

//View engine and layouts
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

// Importing routes
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

// Using routes
app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

// Server start
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
