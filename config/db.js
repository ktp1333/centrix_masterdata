module.exports = {
	// url : 'mongodb://root:centrix%40min@localhost:27017/singleID?authSource=admin',
	// db: 'arcusairdb_qa',
	localdb: 'mongodb://localhost:27017/masterdata',
	// dbpath: 'mongodb://centrix:abc%40123@demo.humancentric.info/centrixdb',
	dbpath: process.env.MONGODB_CONNECTION,
	local_json: '../centrix_masterdata/app/datajson/',
	// local_json: 'C:\Users\kittipong.pr\Documents\GitHub\centrix_masterdata\app\datajson/',



}	