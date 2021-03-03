const express = require('express')
const router = express.Router();

const mongoose = require('mongoose')
const User = require('../models/user')
const Code = require('../models/code')
const AccessToken = require('../models/accessToken')
const generateQR = require("../util/generateQR");
var QRCode = require('qrcode')
var path = require('path');
const fs = require('fs');

/** Route create new code. */
router.post('', (req, res) => {
    if (req.accessToken) {
        var newCode = new Code({
            data:req.body.data,
            error_correction_level:((req.body.error_correction_level) ? req.body.error_correction_level : "M"),
            image_width:((req.body.image_width) ? req.body.image_width : 500),
            light_color:((req.body.light_color) ? req.body.light_color : "#ffffff"),
            dark_color:((req.body.dark_color) ? req.body.dark_color : "#000000"),
            media_type:((req.body.media_type) ? req.body.media_type : "png"),
        })
        newCode.user = req.accessToken.user;
        newCode.save().then(newCode => {
            QRCode.toFile(
                `src/public/codes/${newCode.code}.${newCode.media_type}`,
                newCode.data,
                {
                    errorCorrectionLevel: newCode.error_correction_level,
                    color: {
                        dark: newCode.dark_color,
                        light: newCode.light_color,
                    },
                    width: newCode.image_width,
                }, function (err, url) {
                    res.send(newCode)
                    console.log(url)
                })
        }).catch(err => {
            console.log(err);
            res.status(500)
            res.send('Error')
        })
    } else {
        res.status(401)
        res.send('Error')
    }
})


/** Route to patch to code. */
router.patch('/:codeCode', (req, res) => {
    if (req.accessToken == false) {
        res.status(401).send('Error')
    } else {
        Code.findOneAndUpdate({code : req.params.codeCode},
        {
            $set: req.body,
            function(err, code){
                code
                res.send(code)
            }
        }).then(newCode => {
            Code.findById(newCode._id).then(newCode =>{
                QRCode.toFile(
                    `src/public/codes/${newCode.code}.${newCode.media_type}`,
                    newCode.data,
                    {
                        errorCorrectionLevel: newCode.error_correction_level,
                        color: {
                        dark: newCode.dark_color,
                        light: newCode.light_color,
                        },
                        width: newCode.image_width,
                    }, function (err, url) {
                        res.send(newCode)
                        console.log(url)
                    })
            })
        }).catch(err => {
            console.log(err);
            res.status(500)
            res.send('Error')
        })
    }
})

/** Route to patch to code. */
router.get('/:codeCode', (req, res) => {
    if (req.accessToken == false) {
        res.status(401).send('Error')
    } else {
        Code.findOne({code : req.params.codeCode}).then(code => {
            console.log(`codes/${code.code}.${code.media_type}`)
            res.sendFile(path.join(__dirname, '../public', 'codes', `${code.code}.${code.media_type}`))
        }).catch(err => {
            console.log(err);
            res.status(500)
            res.send('Error')
        })
    }
})

/** Route to patch to code. */
router.delete('/:codeCode', (req, res) => {
    if (req.accessToken == false) {
        res.status(401).send('Error')
    } else {
        Code.findOne({code : req.params.codeCode}).then(code => {
            fs.rm(path.join(__dirname, '../public', 'codes', `${code.code}.${code.media_type}`),
                (result => {
                    Code.findByIdAndDelete(code._id).then(code => {
                        res.send('OK')
                    })
                })
            )
        }).catch(err => {
            console.log(err);
            res.status(500)
            res.send('Error')
        })
    }
})

module.exports = router