const { Router } = require("express");
const Superhero = require("../models/Superhero");
const router = Router();
const fs = require("fs");
const store = require("../middleware/multer");
// render out main page, passing DB objects and pagination data
router.get("/", async (req, res) => {
  const superheroes = await Superhero.find({});
  res.render("index", {
    title: "Superhero list",
    superheroes,
    pagination: {
      page: Number.isInteger(+req.url.slice(-1)) ? +req.url.slice(-1) : 1, // The current page the user is on
      limit: 5, // The total number of available pages
      totalRows: superheroes.length,
    },
  });
});
// render superhero adding form
router.get("/addSuperhero", (req, res) => {
  res.render("layouts/addSuperhero", {
    title: "addSuperhero",
  });
});
// add a new hero to the database
router.post(
  "/addSuperhero",
  store.array("images", 5),
  async (req, res, next) => {
    const files = req.files;
    let filenameArr = [],
      contentTypeArr = [],
      imageBase64Arr = [];
    let promises = [];
    if (files) {
      // check if uploaded files are images
      for (let i = 0; i < files.length; i++) {
        if (files[i].mimetype.split("/")[0] != "image") {
          const error = new Error("Error! Non-image file uploaded");
          return next(error);
        }
      }
      // convert images into base64 encoding
      let imgArray = files.map((file) => {
        let img = fs.readFileSync(file.path);
        return (encode_image = img.toString("base64"));
      });
      // compile req arrays
      imgArray.map((src, index) => {
        filenameArr.push(files[index].originalname);
        contentTypeArr.push(files[index].mimetype);
        imageBase64Arr.push(src);
      });
      files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
      });
    }
    const superhero = new Superhero({
      nickname: req.body.nickname,
      real_name: req.body.real_name,
      origin_description: req.body.origin_description,
      superpowers: req.body.superpowers,
      catch_phrase: req.body.catch_phrase,
      filename: filenameArr,
      contentType: contentTypeArr,
      imageBase64: imageBase64Arr,
    });

    await superhero.save().catch((error) => {
      if (error.name === "MongoError" && error.code === 11000) {
        promises.push(
          Promise.reject({
            error: `Duplicate names. req.body.nickname already exists! `,
          })
        );
      }
      promises.push(
        Promise.reject({ error: error.message || `Something went wrong` })
      );
    });
    return Promise.all(promises)
      .then((msg) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
// edit existing superheroes
router.post(
  "/editSuperhero",
  store.array("images", 5),
  async (req, res, next) => {
    const superhero = await Superhero.findById(req.body.id);
    const files = req.files;
    let promises = [];
    if (files) {
      // check if uploaded files are images
      for (let i = 0; i < files.length; i++) {
        if (files[i].mimetype.split("/")[0] != "image") {
          const error = new Error("Error! Non-image file uploaded");
          return next(error);
        }
      }
      // convert images into base64 encoding
      let imgArray = files.map((file) => {
        let img = fs.readFileSync(file.path);
        return (encode_image = img.toString("base64"));
      });
      // compile req arrays
      imgArray.map((src, index) => {
        superhero.filename.push(files[index].originalname);
        superhero.contentType.push(files[index].mimetype);
        superhero.imageBase64.push(src);
      });
      files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
      });
    }
    (superhero.nickname = req.body.nickname),
      (superhero.real_name = req.body.real_name),
      (superhero.origin_description = req.body.origin_description),
      (superhero.superpowers = req.body.superpowers),
      (superhero.catch_phrase = req.body.catch_phrase),
      await superhero.save().catch((error) => {
        if (error.name === "MongoError" && error.code === 11000) {
          promises.push(
            Promise.reject({
              error: `Duplicate names. req.body.nickname already exists! `,
            })
          );
        }
        promises.push(
          Promise.reject({ error: error.message || `Something went wrong` })
        );
      });
    return Promise.all(promises)
      .then((msg) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
// delete existing superhero
router.post("/deleteSuperhero", async (req, res) => {
  const superhero = await Superhero.findById(req.body.id);
  await superhero.deleteOne();

  res.redirect("/");
});
// remove an image from the gallery
router.post("/delSuperheroImg", async (req, res) => {
  const imgid = req.body.imgid;
  const superhero = await Superhero.findById(req.body.heroid);
  superhero.filename.splice(imgid, 1);
  superhero.contentType.splice(imgid, 1);
  superhero.imageBase64.splice(imgid, 1);
  await superhero.save();
  res.redirect("/");
});
module.exports = router;
