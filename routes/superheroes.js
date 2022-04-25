const { Router } = require('express')
const Superhero = require('../models/Superhero')
const router = Router()
const fs = require('fs');
const store = require('../middleware/multer')

router.get('/', async (req, res) => {
  const superheroes = await Superhero.find({})
  res.render('index', {
    title: 'Superhero list',
    superheroes,
    pagination: {
      page: (Number.isInteger(+req.url.slice(-1))) ? +req.url.slice(-1) : 1,  // The current page the user is on
      limit: 5,   // The total number of available pages
      totalRows: superheroes.length
    }
  })
})

router.get('/addSuperhero', (req, res) => {
  res.render('layouts/addSuperhero', {
    title: 'addSuperhero',
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
            filenameArr.push(files[index].originalname);
            contentTypeArr.push(files[index].mimetype);
            imageBase64Arr.push(src);
        })
    }
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

router.post('/editSuperhero', store.array('images', 5), async (req, res) => {
    const superhero = await Superhero.findById(req.body.id)
    const files = req.files;
    if(files){
            // convert images into base64 encoding
        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path)
            return encode_image = img.toString('base64')
        })
        // compile req arrays
        imgArray.map((src, index) => {
            superhero.filename.push(files[index].originalname);
            superhero.contentType.push(files[index].mimetype);
            superhero.imageBase64.push(src);
        })
    }
    superhero.nickname = req.body.nickname,
    superhero.real_name = req.body.real_name,
    superhero.origin_description = req.body.origin_description,
    superhero.superpowers = req.body.superpowers,
    superhero.catch_phrase = req.body.catch_phrase,
    // superhero.nickname = req.body.nickname + " the saved"
    await superhero.save()

     res.redirect('/')
})

router.post('/deleteSuperhero', async (req, res) => {
  const superhero = await Superhero.findById(req.body.id)
  await superhero.deleteOne()

   res.redirect('/')
})

router.post('/delSuperheroImg', async(req, res) =>{

  const imgid = req.body.imgid
  const superhero = await Superhero.findById(req.body.heroid);
  superhero.filename.splice(imgid, 1);
  superhero.contentType.splice(imgid, 1);
  superhero.imageBase64.splice(imgid, 1);
  await superhero.save()
  res.redirect('/')
})
module.exports = router
