const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const blockedusers = new mongoose.Schema({
    
        userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
})

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique: true },
    sessionid: [{ type: String, default:''}],
    password: { type: String, required: true },
    retypepassword: { type: String, required: true },
    status:{type:Number,default:0},//online(1) offline(0) 
    profilepicture: { type: String, default:'' },
    about: { type: String,default:'this is about' },
    blockedUsers: [blockedusers],
    blockedbyUsers: [blockedusers]
})
//middlware use for hashing password

userSchema.pre('save', async function (next) {
    
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.retypepassword = await bcrypt.hash(this.retypepassword, salt);
    }
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
