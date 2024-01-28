const mongoose=require('mongoose')
const {Schema} = mongoose;
const categoriesSchema = new Schema({
   value:{type:String,required:true},
   label:{type:String,required:true}
})

exports.categories=mongoose.model('categories',categoriesSchema);