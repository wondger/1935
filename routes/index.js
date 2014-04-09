var fs   = require('fs');

/**
 * setData
 * @param {Object} req
 * @param {Object} res
 */
var setData = function(req, res) {
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
                msg: '写入成功'
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
    var data  = require('../data.json');

    res.json(data);
};

/**
 * renderHome
 * @param {Object} req
 * @param {Object} res
 */
var renderHome = function(req, res) {
    res.render('index', {}, function(err, html) {
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