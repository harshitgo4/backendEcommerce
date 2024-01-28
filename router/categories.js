
const express =require('express');
const { fetchcategories } = require('../controller/categories');

const router = express.Router();

router.get('/',fetchcategories);

exports.router=router;