module.exports = {
  local_ordercategory: "mongodb://localhost:27017/ordercategory",
  local_orderitem: "mongodb://localhost:27017/orderitem",
  // dbpath: 'mongodb://centrix:abc%40123@demo.humancentric.info/centrixdb',
  dbpath: process.env.MONGODB_CONNECTION,
  local_json: "../centrix_masterdata/app/datajson/",
  // local_json: 'C:\Users\kittipong.pr\Documents\GitHub\centrix_masterdata\app\datajson/',
  centrix_dev:"mongodb://arcusairdb_dev_user:CJva6E3DnrR2JPNHNu3Yarg7NXmVf7yk@mongo.labs.humancentric.info:34027/arcusairdb_dev",
};
