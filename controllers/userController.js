const fs = require("fs"),
  aboutuserpage = fs.readFileSync("./template/aboutuser.html", "utf-8"),
  loginpage = fs.readFileSync("./template/login.html", "utf-8"),
  SignUppage = fs.readFileSync("./template/signup.html", "utf-8"),
  users = fs.readFileSync("./data/users.json", "utf-8"),
  usersobj = JSON.parse(users),
  { replacecontent, logCheck, replaceComments } = require("../mymodule"),
  bcrypt = require("bcrypt");

var output = "";

exports.getLogin = (req, res) => {
  output = loginpage;
  const err = req.query.err ? "wrong Username or Password" : "";
  output = output.replace(/{%ERROR%}/g, err);

  res.status(200).send(output);
};
exports.postLogin = async (req, res) => {
  const { Username, Password } = req.body;
  const user = usersobj.find((obj) => obj.username === Username);
  if (user && (await bcrypt.compare(Password, user.password))) {
    req.session.user = user;
    res.status(200).redirect("/home");
  } else {
    res.status(401).redirect("/user/login?err=1");
  }
};
exports.getSignup = (req, res) => {
  output = SignUppage;
  const err = req.query.err ? "username or email already exists" : "";
  output = output.replace(/{%ERROR%}/g, err);
  res.status(200).send(output);
};

exports.postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  const signed = usersobj.some(
    (user) => user.username === username || user.email === email
  );
  if (!signed) {
    const newUser = Object.assign(
      { id: usersobj.length },
      { username: username },
      { email: email },
      { password: await bcrypt.hash(password, 9) },
      { likes: [] }
    );
    usersobj.push(newUser);
    req.session.user = newUser;
    fs.writeFile("./data/users.json", JSON.stringify(usersobj), () => {});
    res.status(201).redirect("/home");
  } else res.status(409).redirect(`/user/signup?err=1`);
};

exports.signout = (req, res) => {
  req.session.user = null;
  res.status(200).redirect("/home");
};

exports.getAboutUser = (req, res) => {
  var output = logCheck(req.session.user, aboutuserpage);
  res.status(200).send(output);
};
