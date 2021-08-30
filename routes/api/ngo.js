const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');


var multer = require('multer');

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
const storage = new GridFsStorage({
    url: config.get('mongoURI'),
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                //  const filename = file.originalname;
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const original = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: original
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

//User model
const Ngo = require('../../models/Ngo');
//@desc Register new ngo
//@access Public
router.post('/', upload.array('files[]', 10), (req, res) => {
    const { name, email, password, contact, hno, street, city, state, pincode, license } = req.body;
    console.log(name, email, password, contact, license, hno, street, city, state, pincode,)
    
    //simple validation
    if (!name || !email || !password|| !contact||!license) {
        return res.status(400).json({ msg: 'Please enter all fields' }); //bad request

    }
    //check for existing ngo
    Ngo.findOne({ email })
        .then(ngo => {
            if (ngo) {
                return res.status(400).json({ msg: 'Ngo already exists' });
            }

            const newNgo = new Ngo({
                name,
                email,
                password, 
                contact, 
                license,
                hno, 
                street, city, pincode, state
            });

            //create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newNgo.password, salt, (err, hash) => {
                    if (err) throw err;
                    newNgo.password = hash;
                    newNgo.profile_pic = (req.files[0].filename);
                    newNgo.save()
                        .then(ngo => {

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
                        });
                })
            })
        })
});


module.exports = router;