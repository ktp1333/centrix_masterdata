var MongoClient = require('mongodb').MongoClient;
var q = require('q');
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');

var localdb = require('../config/db').local_ordercategory;


exports.insertpt = function (req, res) {
  MongoClient.connect(localdb, function (err, db) {
    if (err) throw err;
    var dbo = db;
    var myobj = req.body.jsondata;
    var filename=req.body.filename;
    dbo.collection(filename).insertMany(myobj, function (err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

exports.insertfile = function (req, res) {
  var defer = q.defer();
  var mfile=req.body.mfile;
  MongoClient.connect(localdb, function (err, db) {
    if (err) console.log(err);
    var dbo = db;
    var myobj = req.body.jsondata;
    dbo.collection(mfile).drop();
    dbo.collection(mfile).insertMany(myobj, function (insertErr, res) {
      if (insertErr)  console.log(insertErr);
      db.collection(mfile).update({}, {}, { multi: true } )
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
      defer.resolve();
    });
  });
  return defer.promise;
}
exports.insertfile_back = function (req, res) {
  var defer = q.defer();
  var mfile=req.body.mfile;
  MongoClient.connect(localdb, function (err, db) {
    if (err) console.log(err);
    var dbo = db;
    var myobj = req.body.jsondata;
    dbo.collection(mfile).drop();
    dbo.collection(mfile).insertMany(myobj, function (insertErr, res) {
      if (insertErr)  console.log(insertErr);
      db.collection(mfile).update({}, { $rename : { 
        'clinicmember_id' : 'chronic_id',
        'icd10' : 'CHRONIC',
        'hn' : 'HN',
        'regdate' : 'createat',
        'dchdate' : 'DATE_DISH',
        'dx_date' : 'DATE_DIAG',
        'lastupdate' : 'D_UPDATE',
        'current_status' : 'TYPE_DISH',
       } }, { multi: true } )
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
      defer.resolve();
    });
  });
  return defer.promise;
}