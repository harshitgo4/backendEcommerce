const express =require('express');
const { createProduct, fetchAllProducts, fetchproductByID, updateProduct, } = require('../controller/productcontroller');
const router = express.Router();

router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchproductByID)
      .patch('/:id',updateProduct)

exports.router=router;