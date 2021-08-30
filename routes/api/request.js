const express = require('express');
const router = express.Router();
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
//Post model
const AdoptPet = require('../../models/Adopt');
const Adopter = require('../../models/Adopter');
const config = require('config');
const crypto = require('crypto');
// const fs = require('fs');
// //file upload
var multer = require('multer');
var ipapi = require('ipapi.co');

router.get('/:id', (req, res) => {

    Adopter.find({ownerID:req.params.id}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json("An error occured.");
        }
        else {
            global.gfs.files.find().toArray(function (err, files) {
                if (err) console.log(err);
                else {
                    console.log('hello')
                    // items.sort(custom_sort)
                    res.json({ 'items': items})
                    // console.log(items)

                }


            })
        }
    });
    
});


router.put('/', (req, res) => {
     if(req.body.formData.status=='Approved'){
        Adopter.findByIdAndUpdate(req.body.formData.applicationID,{status: 'Approved'},(err,doc)=>{
          
           if(err){
             console.log(err)
           }
           else{
               console.log('Application approved successfully')
         
         }
            });
    }
    else if(req.body.formData.status=='Declined'){
        Adopter.findByIdAndUpdate(req.body.formData.applicationID,{status: 'Declined'},(err,doc)=>{
            //this will give you the document what you want to update.. then 
           if(err){
             console.log(err)
           }
           else{
               console.log('Application declined successfully')
         
         }
            });
    }
     
     

    
});
router.delete('/:id', function (req, res) {
    Adopter.findByIdAndRemove(req.params.id, function (err, out) {
        if (err) console.log(err)
        else res.json(out)
    })
})


module.exports = router;