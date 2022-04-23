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

router.post('/addSuperhero', store.array('images', 5), async (req, res, next) => {
  const superhero = new Superhero({
    nickname: req.body.nickname,
    real_name: req.body.real_name,
    origin_description: req.body.origin_description,
    superpowers: req.body.superpowers,
    catch_phrase: req.body.catch_phrase,
    filename : req.body.filename,
    contentType : req.body.contentType,
    imageBase64 : req.body.imageBase64

  })

  await superhero.save()
  res.redirect('/')
})

router.post('/saveSuperhero', async (req, res) => {
  const superhero = await Superhero.findById(req.body.id)

  superhero.nickname = req.body.nickname + " the saved"
  await superhero.save()

  res.redirect('/')
})

module.exports = router
