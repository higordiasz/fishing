const express = require('express');
const router = express.Router();
const path = require('path');
const { singleAccount, multipleAccount } = require('../controller/fishingController');

router.get('/', (req, res, next) => {
    res.render('index', { erro: "" })
});

router.all('/unico', (req, res, next) => {
  singleAccount(req, res, next);
})

router.all('/multiplo', (req, res, next) => {
  multipleAccount(req, res, next);
})

  module.exports = router;