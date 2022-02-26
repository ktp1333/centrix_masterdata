// var dbpath_local = '../Edoc_centrix/app/datajson/';
var dbpath_local = require('../config/db').local_json;
exports.readjson = function (req, res) {
    mfile = req.body.mfile;

    const fs = require('fs');
    if (fs.existsSync(dbpath_local + mfile)) {
        console.log('file exist');
        fs.readFile(dbpath_local + mfile, (err, data) => {
            if (err) throw err;

            let docs = JSON.parse(data);
            res.status(200).json({
                data: docs
            });
            // console.log(data);
        });

    } else {
        console.log(dbpath_local + mfile);
        // fs.writeFile(dbpath_local + mfile),'[]';
        var obj = [];

        var dictstring = JSON.stringify(obj, null, 2);
        const fs1 = require('fs');
        fs1.writeFile(dbpath_local + 'department.json', dictstring, function (err, result) {
            if (err) console.log('error', err);
        });
    }


}
exports.writejson = function (req, res) {
    mfile = req.body.mfile;
    indata = req.body.indata;
    const fs = require('fs');

    fs.readFile(dbpath_local + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(mfile);
            obj = JSON.parse(data); //now it an object
            obj.push(indata);
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath_local + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}
exports.deletejson = function (req, res) {
    mfile = req.body.mfile;
    const fs = require('fs');

    fs.readFile(dbpath_local + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            // console.log(67, req.body.idx);

            // obj = JSON.parse(data); //now it an object
            // console.log(70, obj);
            // // obj.splice(req.body.idx, 1);
            // obj.replace(req.body.idx, '');

            // console.log(72, obj);
            const array = JSON.parse(data);
            const itemtoremove =req.body.idx;
            console.log(array);
            console.log(itemtoremove);
            const filteredItems = array.filter(function(item) {
                return JSON.stringify(item) !== JSON.stringify(itemtoremove)
                })
            console.log(filteredItems);

            var strNotes = JSON.stringify(filteredItems, null, 2);
            fs.writeFile(dbpath_local + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: filteredItems
                });
            });

        }
    });
}
exports.editjson = function (req, res) {
    mfile = req.body.mfile;
    indata = req.body.indata;
    const fs = require('fs');

    fs.readFile(dbpath_local + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.body.idx);

            obj = JSON.parse(data); //now it an object
            console.log(obj);
            obj.splice(req.body.idx, 1);
            console.log(obj);
            obj.push(indata);
            console.log(obj);
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath_local + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}

exports.deletetemplatejson = function (req, res) {
    mfile = req.body.mfile;
    fdata = req.body.data;
    ftitle = req.body.title;
    const fs = require('fs');

    fs.readFile(dbpath_local + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            obj = JSON.parse(data); //now it an object
            console.log(obj);

            var index = -1;

            var filteredObj = obj.find(function (item, i) {
                if (item.data === fdata && item.title === ftitle) {
                    index = i;
                    return i;
                }
            });

            console.log(index);
            obj.splice(index, 1);
            console.log(obj);

            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath_local + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}
