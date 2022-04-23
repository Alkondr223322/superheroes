const { Router } = require('express')
const Superhero = require('../models/Superhero')
const router = Router()
const fs = require('fs');
const store = require('../multer')

router.get('/', async (req, res) => {
  const superheroes = await Superhero.find({})

  res.render('index', {
    title: 'Superhero list',
    isIndex: true,
    superheroes
  })
})

router.get('/addSuperhero', (req, res) => {
  res.render('layouts/addSuperhero', {
    title: 'addSuperhero',
    isCreate: true
  })
})

router.post('/addSuperhero', store.array('images', 5), async (req, res) => {
    const files = req.files;
    let filenameArr = [], contentTypeArr = [], imageBase64Arr = [];
    if(files){
            // convert images into base64 encoding
        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path)
            return encode_image = img.toString('base64')
        })
        // compile req arrays
        imgArray.map((src, index) => {
            filenameArr.push(files[index].originalName);
            contentTypeArr.push(files[index].mimetype);
            imageBase64Arr.push(src);
        })
    }else{console.log("no files added")}
    const superhero = new Superhero({
        nickname: req.body.nickname,
        real_name: req.body.real_name,
        origin_description: req.body.origin_description,
        superpowers: req.body.superpowers,
        catch_phrase: req.body.catch_phrase,
        filename : filenameArr,
        contentType : contentTypeArr,
        imageBase64 : imageBase64Arr
    })

     await superhero.save()
     res.redirect('/')
})

router.post('/saveSuperhero', async (req, res) => {
    // const superhero = await Superhero.findById(req.body.id)

    // superhero.nickname = req.body.nickname + " the saved"
    //  await superhero.save()

     res.redirect('/')
})

module.exports = router
