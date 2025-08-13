const fs = require("fs"),
  homepage = fs.readFileSync("./template/home.html", "utf-8"),
  detailspage = fs.readFileSync("./template/details.html", "utf-8"),
  card = fs.readFileSync("./template/card.html", "utf-8"),
  commentcard = fs.readFileSync("./template/commentcard.html", "utf-8"),
  data = fs.readFileSync("./data/sushi_data.json", "utf-8"),
  dataobj = JSON.parse(data),
  users = fs.readFileSync("./data/users.json", "utf-8"),
  usersobj = JSON.parse(users),
  { replacecontent, logCheck, replaceComments } = require("../mymodule");

var output = "";

exports.getHome = (req, res) => {
  output = homepage;
  output = logCheck(req.session.user, output);
  const cards = dataobj.map((el) => replacecontent(card, el));
  output = output.replace(/{%CARDS%}/g, cards);

  res.status(200).send(output);
};

exports.getDetails = (req, res) => {
  const id = req.query.id * 1;
  output = detailspage;
  output = logCheck(req.session.user, output);
  output = replacecontent(output, dataobj[id]);
  const cards = dataobj[id].comments.map((comment) =>
    replaceComments(commentcard, comment)
  );
  output = output.replace(/{%COMMENTS%}/g, cards.join(""));
  res.status(200).send(output);
};

exports.postLike = (req, res) => {
  const id = req.query.id * 1,
    userid = req.session.user.id;
   if (!usersobj[userid]) usersobj.push(req.session.user);
  if (!usersobj[userid].likes.includes(id)) {
    req.session.user.likes.push(id);
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
};

exports.postComment = (req, res) => {
  const id = req.query.id * 1,
    { NEWcomment } = req.body;
  const comment = Object.assign(
    { username: req.session.user.username },
    { comment: NEWcomment }
  );
  dataobj[id].comments.push(comment);
  fs.writeFile("./data/sushi_data.json", JSON.stringify(dataobj), (err) => {});
  res.status(201).redirect(`/details?id=${id}`);
};
