const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');


//Ngo model
const Ngo = require('../../models/Ngo');
const {Notif} = require('../../models/Notif')
//@route POST api/ngo
//@desc Authenticate ngo
//@access Public
router.post('/', (req, res) => {
    const { email, password } = req.body;
    //simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' }); //bad request

    }
    //check for existing user
    Ngo.findOne({ email })
        .then(ngo => {
            if (!ngo) {
                return res.status(400).json({ msg: 'Ngo does not exist' });
            }

            //validate password
            bcrypt.compare(password, ngo.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
                    if(!ngo.isVerified) return res.status(400).json({msg: 'NGO not verified'})
                    jwt.sign(
                        { id: ngo.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: ngo.id,
                                    name: ngo.name,
                                    email: ngo.email
                                }
                            });
                        }
                    )

                })
        })
});


//@route GET api/ngo
//@desc  Get ngo data
//@access Public
router.get('/user/:id', auth, (req, res) => {
    Ngo.findById(req.params.id)
        .select('-password')
        .then(user => {
            global.gfs.files.find().toArray(function (err, files) {
                if (err) console.log(err);
                else {
                    res.json({ 'user': user, 'files': files })
                }
            })
        })
});

router.delete('/notifications/:user_id/:id', function (req, res) {
    console.log(req.params.id, req.params.user_id)
    Notif.findByIdAndRemove(req.params.id, (err, notifs) => {
        // console.log(user.notifs)
        Ngo.findById(req.params.user_id, (err, user) => {
            const temp = user.notifs.filter(n => n._id != req.params.id)
            console.log(temp)
            user.notifs = temp
            user.save()
        })
        res.json(notifs)
    })
})

router.get('/notifications/:id', function (req, res) {
    function custom_sort(a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    Ngo.findById(req.params.id, (err, user) => {
        // console.log(user.notifs)
        user.notifs.sort(custom_sort)
        res.json(user.notifs)
    })
})

module.exports = router;