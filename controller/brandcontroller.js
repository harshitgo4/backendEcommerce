const { brands } = require("../model/brand")

exports.fetchbrands=async(req,res)=>{
    try {
        const response=await brands.find({}).exec();
        res.status(201).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
}