const { categories } = require("../model/categories");

exports.fetchcategories=async(req,res)=>{
    try {
        const response=await categories.find({}).exec();
        res.status(201).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
}