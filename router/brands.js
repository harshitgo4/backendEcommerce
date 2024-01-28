const express =require('express');
const { fetchbrands } = require('../controller/brandcontroller');

const router = express.Router();

router.get('/',fetchbrands);

exports.router=router;