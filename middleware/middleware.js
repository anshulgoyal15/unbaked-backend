const mongoose = require('mongoose');
const device = require('../model/device');
const user = require('../model/user');
const jwt = require('jsonwebtoken')
//const kil=require("./seed.js");
const key = require('../conf/key')
const comment = require("../model/comments");
const middlewareobject = {};
middlewareobject.checklogin = function (req, res, next) {
    try {
        console.log(JSON.stringify(req.headers))
        const token = req.headers.authorization.split(" ")[1]
        console.log(token)
        jwt.verify(token, key.tokenKey, function (err, payload) {
            console.log(payload)
            if (payload) {

                return next();
            } else {
                res.json({ message: 'Please login first' })
            }
        })
    }
    catch (e) {
        res.json({ message: 'Please login first' })
    }
}

middlewareobject.onwership = function check(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, key.tokenKey, function (err, payload) {
            console.log(payload)
            if (payload) {
                device.findById(req.params.id).populate('author').exec(function (err, newdevice) {
                    console.log(newdevice.author._id)
                    console.log(payload.userId)
                    console.log(newdevice.author._id == payload.userId)
                    if (newdevice.author._id == payload.userId) {
                        next();
                    }
                });
            } else {
                res.json({ message: 'Please login first' })
            }
        })
    }
    catch (e) {
        res.json({ message: 'error' })
    }

};
module.exports = middlewareobject;
