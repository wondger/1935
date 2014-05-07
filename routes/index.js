var fs   = require('fs');

/**
 * setData
 * @description: set vote data(containing both zan and cai)
 * @param {Object} req
 * @param {Object} res
 */
var setData = function(req, res) {
    console.log('setData()');
    var state = req.params.state;

    fs.readFile('./data.json', 'utf-8', function(err, data) {

        if (err) {
            console.error(err);
            console.log('setData() readFileSync error');
            return;
        }

        var data = JSON.parse(data);
        if (typeof data[state] === 'number') {
            data[state] = parseInt(data[state]) + 1;
        } else {
            data[state] = 0;
        }
        //data = JSON.stringify(data);

        fs.writeFile('./data.json', JSON.stringify(data), function(err) {
            if (err) {
                throw err;
            } else {
                res.json({
                    state: 1,
                    msg: '感谢您的投票！'
                });
            }
        });
    });

};

/**
 * getData
 * @description: get vote data to display in barchart
 * @param {Object} req
 * @param {Object} res
 */
var getData = function(req, res) {
    var data  = fs.readFileSync('./data.json', 'utf-8');

    console.log(data);
    res.json(data);
};

/**
 * renderHome
 * @description: index to be displayed, ie. the default html page content to be
 * displayed
 * @param {Object} req
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
    //render xxx.html in views
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

/**
 * renderVote
 * @description: render mobile vote page
 * @param {Object} req
 * @param {Object} res
 */
var renderVote = function(req, res) {
    console.log('renderVote()' + new Date());
    // display buc user information
    console.log(req.buc_user);
    // render corresponding vote.html page in folder views
    res.render('vote', {}, function(err, html) {
        console.log('render vote:' + new Date());
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

/**
 * renderControl
 * @description: render mobile remote control page for ev3 lego robots
 * @param {Object} req
 * @param {Object} res
 */
var renderControl = function(req, res) {
    console.log('renderControl()' + new Date());
    // display buc user information
    console.log(req.buc_user);
    // render corresponding vote.html page in folder views
    res.render('control', {}, function(err, html) {
        console.log('render control:' + new Date());
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

var socketHandler = function(req, res) {
    console.log('socketHandler()' + new Date());
    // display buc user information
    console.log(req.buc_user);
    // render corresponding vote.html page in folder views
    res.render('sockethandler', {}, function(err, html) {
        console.log('render sockethandler:' + new Date());
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

    // default renderHome for index page
    app.get('/', renderHome);
    app.get('/vote', renderVote);
    app.get('/socket', socketHandler);
    app.get('/control', renderControl);
    app.get('/vote/get/', getData);
    app.get('/vote/set/:state/', setData);

};
