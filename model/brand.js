const mongoose=require('mongoose')
const {Schema} = mongoose;
const brandSchema = new Schema({
   value:{type:String,required:true},
   label:{type:String,required:true}
})

exports.brands=mongoose.model('brands',brandSchema);