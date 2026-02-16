const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password:{
    type: String,
    select: false,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    minlength : 10,
    unique: true,
    trim : true 
  },
  age: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});
// using a mongoose pre-save hook to hash the password before saving the user document to the database. 
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')){
   return next();
  }
  this.password=await bcrypt.hash(this.password,10);
  next();
});
//compare password by creaationg custom method and takes the password entered by user and using bcrypt to compare with hashed password stored in db
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword,this.password);
};

module.exports = mongoose.model('User', userSchema);