const Handlebars = require("handlebars");
const paginateHelper = require("./middleware/paginationHelper");
const calcPage = require("./middleware/calculatePage");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const superheroRoutes = require("./routes/superheroes");
const config = require("./config");

const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
hbs.handlebars.registerHelper(
  "paginateHelper",
  paginateHelper.createPagination
);
hbs.handlebars.registerHelper("calcPage", calcPage.calcPage);
app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(express.static(path.join(__dirname, "uploads")));
app.use(superheroRoutes);

async function start() {
  try {
    await mongoose.connect(config.MONGO_URI);
    app.listen(PORT, () => {
      console.log("Server has been started...");
    });
  } catch (e) {
    console.log(e);
  }
}
start();
