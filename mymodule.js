exports.replaceComments = (card, obj) => {
  var output = card;
  output = output.replace(/{%USERNAME%}/g, obj.username);
  output = output.replace(/{%COMMENT%}/g, obj.comment);
  return output;
};
exports.replacecontent = (card, obj) => {
  var output = card;
  output = output.replace(/{%FOODNAME%}/g, obj.productName);
  output = output.replace(/{%IMAGE%}/g, obj.image);
  output = output.replace(/{%LIKES%}/g, obj.likes);
  output = output.replace(/{%QUANTITY%}/g, obj.quantity);
  output = output.replace(/{%PRICE%}/g, obj.price);
  output = output.replace(/{%DESCRIPTION%}/g, obj.description);
  output = output.replace(/{%ID%}/g, obj.id);
  if (!obj.vege) output = output.replace(/{%NOT_VEGE%}/g, "not-vegeterian");
  return output;
};
const logOrSign = (page) => {
  var output = page;
  output = output.replace(/{%USERNAME%}/g, "Login or SignUp");
  output = output.replace(
    /{%LOGINURL%}|{%LIKEURL%}|{%COMMENTURL%}/g,
    "/user/login"
  );
  output = output.replace(/{%METHOD%}/g, "get");
  return output;
};
const loged = (user, page) => {
  var output = page;
  output = output.replace(/{%USERNAME%}/g, user.username);
  output = output.replace(/{%LOGINURL%}/g, "/user/aboutuser");
  output = output.replace(/{%LIKEURL%}/g, "/like?id={%ID%}");
  output = output.replace(/{%COMMENTURL%}/g, "/comment?id={%ID%}");
  output = output.replace(/{%METHOD%}/g, "post");
  return output;
};
exports.logCheck = (user, output) => {
  if (user) {
    output = loged(user, output);
  } else {
    output = logOrSign(output);
  }
  return output;
};
