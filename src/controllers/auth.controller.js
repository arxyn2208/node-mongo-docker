const User = require('../models/User');
const jwt = require('jsonwebtoken');
const register = async function (req,res) {
    try {
        const {name,email,password,phone,age}=req.body;
        const existingUser = await User.findOne({$or:[{email},{phone}]});  
        if(existingUser){
            return res.status(400).json({error:'Email or phone already in use'});
        }
        
       const user=await User.create({name,email,password,phone,age});
        
        const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
    }
    catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const login = async function (req,res) {
    try {
        const {identifier,password}=req.body;
        const user = await User.findOne({$or:[{email:identifier},{phone:identifier}]}).select('+password');
        if(!user){
            return res.status(401).json({error:'Invalid credentials'});
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({error:'Invalid credentials'});
    }
    const token =jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.status(200).json({
        message:'Login successful',
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            age:user.age
        }   
    });
}
catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { register, login };