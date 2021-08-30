#!/usr/bin/env node

process.removeAllListeners('warning');

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const app = express();
const nodemailer = require('nodemailer');

app.use(express.json());
global.gfs;

//DB config
const db = config.get('mongoURI');
DB = mongoose.connection;

//Connect to mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err));


DB.once('open', () => {
    //init stream
    global.gfs = Grid(DB.db, mongoose.mongo);
    global.gfs.collection('uploads');
})

//create storage engine
const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
global.upload = multer({ storage });


app.use('/api/users', require('./routes/api/users'));
app.use('/api/user', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/ngo', require('./routes/api/auth2'));
app.use('/api/ngoregister', require('./routes/api/ngo'));
app.use('/api/donations', require('./routes/api/donation'));
app.use('/api/contribute', require('./routes/api/contribute'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/lostpet', require('./routes/api/lostpet'));
app.use('/api/messages', require('./routes/api/chats'));
app.use('/api/adoption', require('./routes/api/adoption'));
app.use('/api/request', require('./routes/api/request'));
app.use('/admin', require('./routes/api/admin'));
app.use('/api/transaction', require('./routes/api/transactions'));


app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));