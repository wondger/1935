var express = require('express');
var app = express();

app.get('./cry', function(req, res) {
    res.write('cry');
});

app.get('./laughter', function(req, res) {
    res.write('laughter');
});

app.get('./angry', function(req, res) {
    res.write('angry');
});

app.get('./teaser', function(req, res) {
    res.write('teaser');
});

app.get('./scold', function(req, res) {
    res.write('scold');
});
