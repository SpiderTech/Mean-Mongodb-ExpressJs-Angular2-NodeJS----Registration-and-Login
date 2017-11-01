const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
module.exports = (router)=>{
    router.post('/register',(req,res)=>{
        let user = new User({
            email:req.body.email.toLowerCase(),
            username:req.body.username.toLowerCase(),
            password:req.body.password
        });
        user.save((err)=>{
            if(err){
                res.json({success:false,message:'User already Found'});
            }else{
                res.json({success:true,message:'User Registration Successfull'});
            }
        });
    });
    router.get('/checkemail/:email',(req,res)=>{
        User.findOne({email:req.params.email},(err,email)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(email){
                    res.json({success:false,message:'E-mail is already taken'});
                }else{
                    res.json({success:true,message:'E-mail is avaliable'});
                }
            }
        });
    }); 
    router.get('/checkusername/:username',(req,res)=>{
        User.findOne({username:req.params.username},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(user){
                    res.json({success:false,message:'Username is already taken'});
                }else{
                    res.json({success:true,message:'Username is avaliable'});
                }
            }
        });
    }); 
    router.post('/login',(req,res)=>{
        User.findOne({username:req.body.username.toLowerCase()},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(!user){
                    res.json({success:false,message:'Username not found'});
                }else{
                    const validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success:false,message:'Password is invalid'});
                    }else{
                        const token = jwt.sign({userId:user._id},config.secret,{expiresIn:'24h'});
                        res.json({success:true,message:'Login success!',token:token,user:{username:user.username}});
                    }
                }
            }   
        });
    });
    router.use((req,res,next)=>{
        const token = req.headers['authorization'];
        if(!token){
            res.json({success:false,message:'No token provided'});
        }else{
            jwt.verify(token,config.secret,(err,decoded)=>{
                if(err){
                    res.json({success:false,message:'Invalid token'+err});
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }
    });
    router.get('/profile',(req,res)=>{
        User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(!user){
                    res.json({success:false,message:'No user found'});
                }else{
                    res.json({success:true,user:user});
                }
            }
        });
    });
    return router;
};