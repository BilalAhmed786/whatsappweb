const mongoose = require('mongoose')


const Schema = mongoose.Schema({
loginuser:{type:mongoose.Types.ObjectId,required:true},
chatuser:{type:mongoose.Types.ObjectId,required:true}

})

 const notifications =   mongoose.model('notifications',Schema)

 module.exports = notifications