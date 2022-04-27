const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const encrypt = require('mongoose-encryption');
console.log(process.env);

mongoose.connect(process.env.DB_KEY);


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    password :{
        type: String,
        require: true
    }
});
let secret = 'ThisIsASecretWtfItIsSuperEasy';
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

const router = express.Router();
router.get('/', (req,res)=>{
    res.render('home');
});

router.route('/login')
    .get((req,res)=>{
        res.render('login');
    })
    .post((req,res)=>{
        const email = req.body.username;
        const password = req.body.password;
        User.findOne({email: email}, (err, foundUser)=>{
            if(err) res.sendStatus(500);
            else if(foundUser){
                if(foundUser.password === password) res.render('secrets');
                else (res.redirect('/login'));
            }else res.redirect('/register');
        });
    });
router.route('/register')

    .get((req,res)=>{
    res.render('register');
    })
    .post((req,res)=>{
        console.log(req.body);
        const userData = {
            email : req.body.username,
            password : req.body.password
        }
        const newUser = new User(userData);
        newUser.save((err)=>{
            if(err) res.sendStatus(500);
            else res.render('secrets');
        });
    });


    // const PostSchema = new mongoose.Schema({
    //     secret: {
    //         type: String,
    //         required: true
    //     }
    // });
    // const secretOfPost = 'I am key to open a secret :3';
    // PostSchema.plugin(encrypt, {secret: secretOfPost}, {encryptedFields: ["secret"]});
    // const Post = new mongoose.model('Post', PostSchema);
    // const newPost = new Post({
    //     secret : `I'm a doll xd`
    // });
    // newPost.save((err)=>{
    //     Post.find((err, data)=>{
    //         console.log(data);
    //     });
    // });


module.exports = router;