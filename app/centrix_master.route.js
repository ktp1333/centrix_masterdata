var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var moment = require("moment");
var mongoose = require("mongoose");
var async = require("async");
// var md5 = require('md5');
var _ = require("underscore");
var dbpath = require("../config/db").dbpath;
var localdb = require("../config/db").localdb;

exports.find_ordercategories = function (req, res) {
  MongoClient.connect(dbpath, function (err, db) {
    var dbo = db;
    dbo
      .collection("ordercategories")
      .aggregate([
        {
          $match: {
            orguid: mongoose.Types.ObjectId(req.body.orguid),
            // "orguid": ObjectId("569794170946a3d0d588efe6"),
            statusflag: "A",
            name: { $regex: new RegExp(`^(.*?(${req.body.name})[^$]*)$`, "i") },
          },
        },
        {
          $lookup: {
            from: "ordercategories",
            localField: "parentcategoryuid",
            foreignField: "_id",
            as: "parentcategoryuid",
          },
        },
        {
          $unwind: {
            path: "$parentcategoryuid",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //     $project: {
        //         _id: 1,
        //         valuedescription: 1,
        //     },
        // },
      ])
      .toArray((err, docs) => {
        if (docs && docs.length > 0) {
          console.log(docs);
          var ret = [];
          for (i = 0; i < docs.length; i++) {
            if (docs[i].parentcategoryuid) {
              mc = docs[i].parentcategoryuid.ordercattype;
            } else {
              mc = "";
            }
            ret.push({
              No: i + 1,
              ID: docs[i]._id,
              name: docs[i].name,
              code: docs[i].code,
              parentcategory: mc,
              ordercattype: docs[i].ordercattype,
              activeto: docs[i].activeto,
              activefrom: docs[i].activefrom,
              billingtype: docs[i].billingtype,
              locallangdesc: docs[i].locallangdesc,
              description: docs[i].description || "",
              showpopupduringentry: docs[i].showpopupduringentry,
              iscareprovidermandatory: docs[i].iscareprovidermandatory,
              isdiagnosislinkingmandatory: docs[i].isdiagnosislinkingmandatory,
              isdiagnosismandatory: docs[i].isdiagnosismandatory,
              issubcategory: docs[i].issubcategory,
              alertforduplicate: docs[i].alertforduplicate,
              allowcontinuousorders: docs[i].allow,
            });
          }

          console.log(ret);
          res.status(200).json({
            data: ret,
          });
          dbo.close();
        } else {
          res.status(200).json({
            data: [],
          });
          console.log("nodata");
        }
      });
  });
};
exports.list_ordercategories = function (req, res) {
  MongoClient.connect(dbpath, function (err, db) {
    var dbo = db;
    dbo
      .collection("ordercategories")
      .aggregate([
        {
          $match: {
            orguid: mongoose.Types.ObjectId(req.body.orguid),
            // "orguid": ObjectId("569794170946a3d0d588efe6"),
            statusflag: "A",
            // domaincode: "FORMTY",
          },
        },
        {
          $lookup: {
            from: "ordercategories",
            localField: "parentcategoryuid",
            foreignField: "_id",
            as: "parentcategoryuid",
          },
        },
        {
          $unwind: {
            path: "$parentcategoryuid",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //     $project: {
        //         _id: 1,
        //         valuedescription: 1,
        //     },
        // },
      ])
      .toArray((err, docs) => {
        if (docs && docs.length > 0) {
          console.log(docs);
          var ret = [];
          for (i = 0; i < docs.length; i++) {
            if (docs[i].parentcategoryuid) {
              mc = docs[i].parentcategoryuid.ordercattype;
            } else {
              mc = "";
            }
            ret.push({
              No: i + 1,
              ID: docs[i]._id,
              name: docs[i].name,
              code: docs[i].code,
              parentcategory: mc,
              ordercattype: docs[i].ordercattype,
              activeto: docs[i].activeto,
              activefrom: docs[i].activefrom,
              billingtype: docs[i].billingtype,
              locallangdesc: docs[i].locallangdesc,
              description: docs[i].description || "",
              showpopupduringentry: docs[i].showpopupduringentry,
              iscareprovidermandatory: docs[i].iscareprovidermandatory,
              isdiagnosislinkingmandatory: docs[i].isdiagnosislinkingmandatory,
              isdiagnosismandatory: docs[i].isdiagnosismandatory,
              issubcategory: docs[i].issubcategory,
              alertforduplicate: docs[i].alertforduplicate,
              allowcontinuousorders: docs[i].allow,
            });
          }

          console.log(ret);
          res.status(200).json({
            data: ret,
          });
          dbo.close();
        } else {
          res.status(200).json({
            data: [],
          });
          console.log("nodata");
        }
      });
  });
};
exports.find_detail = function (req, res) {
  MongoClient.connect(dbpath, function (err, db) {
    var dbo = db;
    dbo
      .collection("ordercategories")
      .aggregate([
        {
          $match: {
            orguid: mongoose.Types.ObjectId(req.body.orguid),
            _id: mongoose.Types.ObjectId(req.body.ID),
            // "orguid": ObjectId("569794170946a3d0d588efe6"),
            statusflag: "A",
            // domaincode: "FORMTY",
          },
        },
        {
          $lookup: {
            from: "ordercategories",
            localField: "parentcategoryuid",
            foreignField: "_id",
            as: "parentcategoryuid",
          },
        },
        {
          $unwind: {
            path: "$parentcategoryuid",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //     $project: {
        //         _id: 1,
        //         valuedescription: 1,
        //     },
        // },
      ])
      .toArray((err, docs) => {
        if (docs && docs.length > 0) {
          console.log(docs);
          var ret = [];
          for (i = 0; i < docs.length; i++) {
            if (docs[i].parentcategoryuid) {
              mc = docs[i].parentcategoryuid.ordercattype;
            } else {
              mc = "";
            }
            ret.push({
              ID: docs[i]._id,
              name: docs[i].name,
              code: docs[i].code,
              parentcategory: mc,
              ordercattype: docs[i].ordercattype,
              activeto: docs[i].activeto,
              activefrom: docs[i].activefrom,
              billingtype: docs[i].billingtype,
              locallangdesc: docs[i].locallangdesc,
              description: docs[i].description || "",
              showpopupduringentry: docs[i].showpopupduringentry,
              iscareprovidermandatory: docs[i].iscareprovidermandatory,
              isdiagnosislinkingmandatory: docs[i].isdiagnosislinkingmandatory,
              isdiagnosismandatory: docs[i].isdiagnosismandatory,
              issubcategory: docs[i].issubcategory,
              alertforduplicate: docs[i].alertforduplicate,
              allowcontinuousorders: docs[i].allow,
            });
          }

          console.log(ret);
          res.status(200).json({
            data: ret,
          });
          dbo.close();
        } else {
          res.status(200).json({
            data: [],
          });
          console.log("nodata");
        }
      });
  });
};
exports.list_dbdetail = function (req, res) {
  var mfile = req.body.mfile;
  // const databasename = "centrixdb_demo";

  MongoClient.connect(dbpath, function (err, db) {
    var dbo = db;
    // MongoClient.connect(dbpath, (connectErr, db) => {
    //     var dbo = db;
    dbo
      .collection(mfile)
      .aggregate([
        {
          $match: {
            orguid: mongoose.Types.ObjectId(req.body.orguid),
            statusflag: "A",
          },
        },
        {
          $unwind: {
            path: "$cchpilist",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cchpimasters",
            localField: "cchpilist.cchpimasteruid",
            foreignField: "_id",
            as: "cchpimasteruid",
          },
        },
        {
          $unwind: {
            path: "$cchpimasteruid",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            cchpilist: "$cchpilist.chiefcomplaint",
            cchpilist2: "$cchpimasteruid.name",
            code: 1,
            name: 1,
            useruid: 1,
          },
        },
      ])
      .toArray((err, docs) => {
        if (docs && docs.length > 0) {
          console.log(docs);
          var ret = [];
          for (i = 0; i < docs.length; i++) {
            console.log(docs[i].ReferralDate);
            if (docs[i].cchpilist) {
              var mcchpi = docs[i].cchpilist;
            } else {
              var mcchpi = docs[i].cchpilist2;
            }
            ret.push({
              cchpi: mcchpi,
              code: docs[i].code,
              name: docs[i].name,
              useruid: docs[i].useruid,
            });
          }

          console.log(ret);
          res.status(200).json({
            data: ret,
          });
          dbo.close();
        } else {
          res.status(200).json({
            data: [],
          });
          console.log("nodata");
        }
        // console.log(docs);
        // res.status(200).json({
        //     data: docs
        // });
        // dbo.close();
      });
  });
};
exports.list_collection = function (req, res) {
  MongoClient.connect(localdb)
    .then((client) => {
      const connect = client.db("masterdata");
      connect.listCollections().toArray(function (err, docs) {
        if (!err) {
          console.log(docs);
          var ret = [];
          for (i = 0; i < docs.length; i++) {
            ret.push({
              name: docs[i].name,
            });
          }
          res.status(200).json({
            data: ret,
          });
        }
      });
    })
    .catch((err) => {
      // Printing the error message
      console.log(err.Message);
    });
 
};
exports.collection_detail = function (req, res) {
  var mfile = req.body.mfile;
  // const databasename = "centrixdb_demo";

  MongoClient.connect(localdb, function (err, db) {
    var dbo = db;
    dbo
      .collection(mfile)
      .aggregate([
        {
          $match: {
          },
        },
      
      ])
      .toArray((err, docs) => {
        if (docs && docs.length > 0) {
          console.log(docs);
        
          res.status(200).json({
            data: docs,
          });
          dbo.close();
        } else {
          res.status(200).json({
            data: [],
          });
          console.log("nodata");
        }
        // console.log(docs);
        // res.status(200).json({
        //     data: docs
        // });
        // dbo.close();
      });
  });
};
exports.updateordercat = function (req, res) {
  var mfile = req.body.mfile;
  MongoClient.connect(localdb, (connectErr, db) => {
    if (req.body != null) {
      var dbo = db;
      dbo
        .collection(mfile)
        .find({
          _id: mongoose.Types.ObjectId(req.body.ID),
        })
        .toArray((err, docs) => {
          if (docs.length == 0) {
            // if (doc && doc.length > 0) {
            var newitem = {};
            newitem.CODE = req.body.CODE;
            newitem.NAME = req.body.NAME;
            newitem.DESCRIPTION = req.body.DESCRIPTION;
            newitem.ORDERCATEGORYTYPE = req.body.ORDERCATEGORYTYPE;
            newitem.BILLINGTYPE = req.body.BILLINGTYPE;
            newitem.ISSUBCATEGORY = req.body.ISSUBCATEGORY;

            dbo.collection(mfile).save(newitem, function (Innererr) {
              if (!Innererr) {
                res.status(200).json({
                  docs: newitem,
                });
              } else {
                res.status(500).json({
                  error: "ERRORS.CREATEERROR",
                });
              }
            });
          } else {
            var doc = docs[0];
            var ID = doc._id;
            var newitem = doc;
            newitem.CODE = req.body.CODE;
            newitem.NAME = req.body.NAME;
            newitem.DESCRIPTION = req.body.DESCRIPTION;
            newitem.ORDERCATEGORYTYPE = req.body.ORDERCATEGORYTYPE;
            newitem.BILLINGTYPE = req.body.BILLINGTYPE;
            newitem.ISSUBCATEGORY = req.body.ISSUBCATEGORY;
            dbo.collection(mfile).update(
              {
                _id: ID,
              },
              newitem,
              function (Innererr) {
                if (!Innererr) {
                  res.status(200).json({
                    docs: newitem,
                  });
                } else {
                  res.status(500).json({
                    error: "ERRORS.CREATEERROR",
                  });
                }
              }
            );
          }
        });
    } else {
      res.status(500).json({
        error: "ERRORS.CODEINUSE",
      });
    }
  });
};
exports.updatesubordercat = function (req, res) {
  var mfile = req.body.mfile;
  MongoClient.connect(localdb, (connectErr, db) => {
    if (req.body != null) {
      var dbo = db;
      dbo
        .collection(mfile)
        .find({
          _id: mongoose.Types.ObjectId(req.body.ID),
        })
        .toArray((err, docs) => {
          if (docs.length == 0) {
            // if (doc && doc.length > 0) {
            var newitem = {};
            newitem.CODE = req.body.CODE;
            newitem.NAME = req.body.NAME;
            newitem.DESCRIPTION = req.body.DESCRIPTION;
            newitem.ORDERCATEGORYTYPE = req.body.ORDERCATEGORYTYPE;
            newitem.BILLINGTYPE = req.body.BILLINGTYPE;
            // newitem.ISSUBCATEGORY = req.body.ISSUBCATEGORY;
            newitem.PARENTCATEGORYNAME = req.body.PARENTCATEGORYNAME;
            dbo.collection(mfile).save(newitem, function (Innererr) {
              if (!Innererr) {
                res.status(200).json({
                  docs: newitem,
                });
              } else {
                res.status(500).json({
                  error: "ERRORS.CREATEERROR",
                });
              }
            });
          } else {
            var doc = docs[0];
            var ID = doc._id;
            var newitem = doc;
            newitem.CODE = req.body.CODE;
            newitem.NAME = req.body.NAME;
            newitem.DESCRIPTION = req.body.DESCRIPTION;
            newitem.ORDERCATEGORYTYPE = req.body.ORDERCATEGORYTYPE;
            newitem.BILLINGTYPE = req.body.BILLINGTYPE;
            // newitem.ISSUBCATEGORY = req.body.ISSUBCATEGORY;
            newitem.PARENTCATEGORYNAME = req.body.PARENTCATEGORYNAME;
            dbo.collection(mfile).update(
              {
                _id: ID,
              },
              newitem,
              function (Innererr) {
                if (!Innererr) {
                  res.status(200).json({
                    docs: newitem,
                  });
                } else {
                  res.status(500).json({
                    error: "ERRORS.CREATEERROR",
                  });
                }
              }
            );
          }
        });
    } else {
      res.status(500).json({
        error: "ERRORS.CODEINUSE",
      });
    }
  });
};
exports.delete_data = function (req, res) {
  MongoClient.connect(localdb, (connectErr, db) => {
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
// exports.find_lastcode = function (req, res) {
//   MongoClient.connect(dbpath, function (err, db) {
//     var dbo = db;
//     dbo
//       .collection("favouritenotes")
//       .aggregate([
//         {
//           $match: {
//             // "orguid": mongoose.Types.ObjectId(req.body.orguid),
//             statusflag: "A",
//           },
//         },
//         {
//           $lookup: {
//             from: "referencevalues",
//             localField: "notetypeuid",
//             foreignField: "_id",
//             as: "notetypeuid",
//           },
//         },
//         { $unwind: { path: "$notetypeuid", preserveNullAndEmptyArrays: true } },
//         {
//           $project: {
//             // "notetypeuid": "$notetypeuid._id",
//             notetype: "$notetypeuid.valuedescription",
//             code: 1,
//             name: 1,
//           },
//         },
//         {
//           $addFields: {
//             codeint: { $toInt: "$code" },
//           },
//         },
//         {
//           $sort: {
//             codeint: -1,
//           },
//         },
//       ])
//       .toArray((err, docs) => {
//         if (docs && docs.length > 0) {
//           console.log(docs);

//           res.status(200).json({
//             data: docs,
//           });
//           dbo.close();
//         } else {
//           res.status(200).json({
//             data: [],
//           });
//           console.log("nodata");
//         }
//       });
//   });
// };
// exports.save_note = function (req, res) {
//   var mfile = req.body.mfile;
//   MongoClient.connect(dbpath, (connectErr, db) => {
//     if (req.body != null) {
//       var dbo = db;
//       var newitem = {};
//       newitem.notetext = req.body.notetext;
//       newitem.notetypeuid = mongoose.Types.ObjectId(req.body.notetypeuid);
//       newitem.code = req.body.code;
//       newitem.name = req.body.name;
//       newitem.orguid = mongoose.Types.ObjectId(req.body.orguid);
//       newitem.useruid = mongoose.Types.ObjectId(req.body.useruid);
//       newitem.createdby = mongoose.Types.ObjectId(req.body.useruid);
//       newitem.modifiedby = mongoose.Types.ObjectId(req.body.useruid);
//       newitem.createdat = new Date();
//       newitem.modifiedat = new Date();
//       newitem.statusflag = "A";
//       newitem.__v = 0;
//       dbo.collection(mfile).save(newitem, function (Innererr) {
//         if (!Innererr) {
//           res.status(200).json({
//             va: newitem,
//           });
//         } else {
//           res.status(500).json({
//             error: "ERRORS.CREATEERROR",
//           });
//         }
//       });
//     } else {
//       res.status(500).json({
//         error: "ERRORS.CODEINUSE",
//       });
//     }
//   });
// };
