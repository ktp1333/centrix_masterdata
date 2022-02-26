module.exports = function (app) {
    // var local_host = require('./local_host.route.js');
    // app.post('/local_host/findconsent', local_host.findconsent);
    // app.post('/local_host/saveconsent', local_host.saveconsent);
    app.get('/org-config', function (req, res) {
        if (!process.env.ORG) {
            return res.status(500).json({ error: 'no organistion config' })
        }

        return res.status(200).json({ org: process.env.ORG })
    })

    var security = require('./utils/security');
    app.get('/security/login/:username/:shake128/:md5?', security.login);



    var centrix_master = require('./centrix_master.route.js');
    app.post('/centrix_master/list_ordercategories', centrix_master.list_ordercategories);
    app.post('/centrix_master/find_detail', centrix_master.find_detail);
    app.post('/centrix_master/find_ordercategories', centrix_master.find_ordercategories);
    app.post('/centrix_master/list_collection', centrix_master.list_collection);
    app.post('/centrix_master/collection_detail', centrix_master.collection_detail);
    app.post('/centrix_master/updateordercat', centrix_master.updateordercat);
    app.post('/centrix_master/updatesubordercat', centrix_master.updatesubordercat);
    app.post('/centrix_master/delete_data', centrix_master.delete_data);

    var importdata = require('./insert.js');
    app.post('/importdata/insertpt', importdata.insertpt);
    app.post('/importdata/insertfile', importdata.insertfile);

    var local_host = require('./local_host.route.js');
    app.post('/local_host/readmongo', local_host.readmongo);
    app.post('/local_host/save_newcommand', local_host.save_newcommand);
    app.post('/local_host/delete_command', local_host.delete_command);
    app.post('/local_host/update_command', local_host.update_command);
    var local_json = require('./local_json.route.js');
    app.post('/local_json/readjson', local_json.readjson);
    app.post('/local_json/writejson', local_json.writejson);
    app.post('/local_json/deletejson', local_json.deletejson);
    app.post('/local_json/editjson', local_json.editjson);
    app.post('/local_json/deletetemplatejson', local_json.deletetemplatejson);
    
}
