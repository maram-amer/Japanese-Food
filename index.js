const fs = require("fs"),
  http = require("http"),
  url = require("url"),
  homepage = fs.readFileSync("./template/home.html", "utf-8"),
  aboutuserpage = fs.readFileSync("./template/aboutuser.html", "utf-8"),
  detailspage = fs.readFileSync("./template/details.html", "utf-8"),
  loginpage = fs.readFileSync("./template/login.html", "utf-8"),
  SignUppage = fs.readFileSync("./template/signup.html", "utf-8"),
  card = fs.readFileSync("./template/card.html", "utf-8"),
  commentcard = fs.readFileSync("./template/commentcard.html", "utf-8"),
  data = fs.readFileSync("./data/sushi_data.json", "utf-8"),
  dataobj = JSON.parse(data),
  users = fs.readFileSync("./data/users.json", "utf-8"),
  usersobj = JSON.parse(users),
  { replacecontent, logCheck, replaceComments } = require("./mymodule"),
  express = require("express"),
  session = require("express-session"),
  path = require("path");

var output = "";
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

app.get(["/", "/home"], (req, res) => {
  output = homepage;
  output = logCheck(req.session.user, output);
  const cards = dataobj.map((el) => replacecontent(card, el));
  output = output.replace(/{%CARDS%}/g, cards);

  res.status(200).send(output);
});

app.get("/details", (req, res) => {
  const id = req.query.id * 1;
  output = detailspage;
  output = logCheck(req.session.user, output);
  output = replacecontent(output, dataobj[id]);
  const cards = dataobj[id].comments.map((comment) =>
    replaceComments(commentcard, comment)
  );
  output = output.replace(/{%COMMENTS%}/g, cards.join(""));
  res.status(200).send(output);
});

app.get("/login", (req, res) => {
  output = loginpage;
  const err = req.query.err ? "wrong Username or Password" : "";
  output = output.replace(/{%ERROR%}/g, err);

  res.status(200).send(output);
});
app.post("/login", (req, res) => {
  const { Username, Password } = req.body;
  const user = usersobj.find((obj) => obj.username === Username);
  if (user && user.password === Password) {
    req.session.user = user;
    res.status(200).redirect("/home");
  } else {
    res.status(401).redirect("/login?err=1");
  }
});

app.get("/signup", (req, res) => {
  output = SignUppage;
  const err = req.query.err ? "username or email already exists" : "";
  output = output.replace(/{%ERROR%}/g, err);
  res.status(200).send(output);
});
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const signed = usersobj.some(
    (user) => user.username === username || user.email === email
  );
  if (!signed) {
    const newUser = Object.assign(
      { id: usersobj.length },
      { username: username },
      { email: email },
      { password: password },
      { likes: [] }
    );
    usersobj.push(newUser);
    req.session.user = newUser;
    fs.writeFile("./data/users.json", JSON.stringify(usersobj), (err) => {});
    res.status(201).redirect("/home");
  } else res.status(409).redirect(`/signup?err=1`);
});
app.get("/aboutuser", (req, res) => {
  var output = logCheck(req.session.user, aboutuserpage);
  res.status(200).send(output);
});
app.post("/like", (req, res) => {
  const id = req.query.id * 1,
    userid = req.session.user.id;
  if (!usersobj[userid].likes.includes(id)) {
    usersobj[req.session.user.id].likes.push(id);
    dataobj[id].likes++;
    fs.writeFile(
      "./data/sushi_data.json",
      JSON.stringify(dataobj),
      (err) => {}
    );
    fs.writeFile("./data/users.json", JSON.stringify(usersobj), (err) => {});
  }
  res.redirect(`/details?id=${id}`);
});

app.post("/comment", (req, res) => {
  const id = req.query.id * 1,
    { NEWcomment } = req.body;
  const comment = Object.assign(
    { username: req.session.user.username },
    { comment: NEWcomment }
  );
  dataobj[id].comments.push(comment);
  fs.writeFile("./data/sushi_data.json", JSON.stringify(dataobj), (err) => {});
  res.status(201).redirect(`/details?id=${id}`);
});

app.get("/signout", (req, res) => {
  req.session.user = null;
  res.status(200).redirect("/home");
});

//server
app.listen(8080, "127.0.0.1", () => {
  console.log("listning . . ");
});
