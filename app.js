const express = require("express"),
  session = require("express-session"),
  userRoutes = require("./routes/userRoutes"),
  dishesRoutes = require("./routes/dishesRoutes");
path = require("path");

const app = express();

//middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "key-123",
    resave: false,
    saveUninitialized: false,
  })
);

//routes
app.use("/user", userRoutes);
app.use("/", dishesRoutes);

//server
app.listen(8080, "127.0.0.1", () => {
  console.log("listning . . ");
});
