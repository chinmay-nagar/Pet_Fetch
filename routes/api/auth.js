const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');


//User model
const User = require('../../models/User');
//Ngo model
const Ngo = require('../../models/Ngo')

//@route POST api/auth
//@desc Authenticate user
//@access Public
router.post('/', (req, res) => {
    // console.log(req.body.email)
    const { email, password } = req.body;
    // console.log(email)
    //simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' }); //bad request

    }
    //check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            console.log("validated")
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )

                })
        })
});


//@route GET api/auth/user
//@desc  Get user data
//@access Private
router.get('/user/:id', auth, (req, res) => {
    User.findById(req.params.id)
        .select('-password')
        .then(user => {
            global.gfs.files.find().toArray(function (err, files) {
                if (err) console.log(err);
                else {
                    res.json({ 'user': user, 'files': files })
                }
        })
})});


//@route GET api/auth/name/:id
//@desc  Get user/user name
//@access Public
router.get('/name/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            // global.gfs.files.find().toArray(function (err, files) {
            //     if (err) console.log(err);
            //     else {
            //         files.findById(user.profile_pic)
            if(!user) {
                console.log("printing ngo name")
                
                Ngo.findById(req.params.id).then(ngo => { 
                    console.log(ngo.name) 
                    return res.json({'name': ngo.name})
                })
            }
            res.json({ 'name': user.name })
                // }
        // })
})});


//@route GET api/auth/
//@desc  Get type of user
//@access Public
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
                    if(!user) {
                        console.log('ngo')
                        return res.json({type: 'ngo'})
                    }
                    else{
                        console.log('user')
                        return res.json({type: 'user'})
                    }
})});


module.exports = router;