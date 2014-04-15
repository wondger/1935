var fs   = require('fs');

/**
 * setData
 * @param {Object} req
 * @param {Object} res
 */
var setData = function(req, res) {
    console.log('setData()');
    var state = req.params.state,
        data  = require('../data.json');

    data[state] += 1;
    data = JSON.stringify(data);

    fs.writeFile('./data.json', data, function(err) {
        if (err) {
            throw err;
        } else {
            res.json({
                state: 1,
                msg: '感谢您的投票！'
            });
        }
    });
};

/**
 * getData
 * @param {Object} req
 * @param {Object} res
 */
var getData = function(req, res) {
    console.log('getData()');
    var data  = require('../data.json');

    console.log(data);
    res.json(data);
};

/**
 * renderHome
 * @param {Object} req
    debugger;
 * @param {Object} res
 */
var renderHome = function(req, res) {
    console.log('renderHome()' + new Date());
    console.log(req.buc_user);
    /*
    res.render('test', {}, function(err, html) {
        if (err) {
            throw err;
        } else {
            res.send(html);
        }
    });
    */
    res.render('index', {}, function(err, html) {
        console.log('render index:' + new Date());
        console.log('err:' + new Date());
        console.log(err);
        console.log('html:' + new Date());
        //console.log(html);
        if (err) {
            throw err;
        } else {
            res.send(html);
        }
    });
};

module.exports = function(app) {

    app.get('/', renderHome);
    app.get('/vote/get/', getData);
    app.get('/vote/set/:state/', setData);

};
