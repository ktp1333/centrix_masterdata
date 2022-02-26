var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var dbpath = require('../config/db').url;
exports.readmongo = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection(req.body.mfile).aggregate([

        ]).sort({_id:-1}).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.save_newcommand = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        var newdata = {};
        newdata.data = req.body.data;
        newdata.title = req.body.title;
        newdata.topic = req.body.topic;
        dbo.collection(req.body.mfile).save(newdata, function (Innererr) {
            if (!Innererr) {
                res.status(200).json({ data: newdata });

            } else {
                res.status(500).json({ error: 'ERRORS.CREATEERROR' });
            }
        });



    })
}
exports.delete_command = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        var ID = mongoose.Types.ObjectId(req.body.ID);
        dbo.collection(req.body.mfile).find(
            { "_id": ID }
        ).toArray((err, docs) => {
            if (docs.length > 0) {

                dbo.collection(req.body.mfile).deleteOne(docs[0], function (Innererr) {
                    if (!Innererr) {
                        res.status(200).json({ success: true });

                    } else {
                        res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                    }
                });
            }
        })
    })
}

exports.update_command = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, db) => {

        var dbo = db;
        var ID = mongoose.Types.ObjectId(req.body.ID);

        dbo.collection(req.body.mfile).find(
            { "_id": ID,
        }
        ).toArray((err, docs) => {
            if (docs.length > 0) {
                var existdata = docs[0];
                existdata.data = req.body.data;
                existdata.title = req.body.title;
                existdata.topic = req.body.topic;
                dbo.collection(req.body.mfile).save(existdata, function (Innererr) {
                    if (!Innererr) {
                        res.status(200).json({ data: existdata });

                    } else {
                        res.status(500).json({ error: 'ERRORS.CREATEERROR' });
                    }
                });
            } else {
               
            }

        })


    })
}



