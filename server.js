
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require("fs");

//load customers route
var users = require('./routes/users');
var timesheet = require('./routes/sheets');
var task = require('./routes/tasks'); 
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
     connection(mysql,{ 
        host: 'localhost', //'localhost',
        user: 'root',
        password : 'root',
        port : 3307, //port mysql
        database:'timesheet'
    },'request') //or single

);

/*
 * GET home page.
 */
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + './index.html'));
});
app.post('/users/doLogin',users.checkLogin);
app.get('/sheet/list/:userId', timesheet.sheet_list);
app.post('/sheet/add', timesheet.save);
app.get('/tasks/list/:userId',task.task_list);
app.post('/tasks/save', task.save);
app.get('/tasks/edit/:id',task.edit);
app.post('/tasks/update',task.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
