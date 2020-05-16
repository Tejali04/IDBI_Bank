var express = require("express");
var app     = express();
var session = require('express-session');
var path    = require("path");
var mysql = require('mysql');
var hbs = require('hbs');

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use('/assets',express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mybank",
  port:3308
});



app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/home.html'));
});

app.get('/nextpage',function(req,res){
  res.sendFile(path.join(__dirname+'/nextpage.html'));
});

app.get('/test',function(req,res){
  res.sendFile(path.join(__dirname+'/insert.html'));
});

app.post('/reg',function(req,res){
  
  var cid=req.body.cid;
  var cname=req.body.cname;
  var address=req.body.address;
  var email=req.body.email;
  
  //res.write('You sent the username "' + req.body.cid+'".\n');
  //res.write('You sent the name "' + req.body.cname+'".\n');
  //res.write('You sent the address "' + req.body.address+'".\n');
  //res.write('You sent the email "' + req.body.email+'".\n');

  con.connect(function(err) {
  //if (err) throw err;
  var sql = "INSERT INTO customers (cid,cname,address,email) VALUES ('"+cid+"', '"+cname+"','"+address+"','"+email+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    //console.log(name);
    res.redirect('test');
  });
  });
})

//mofify file
app.get('/test1',function(req,res){
    res.sendFile(path.join(__dirname+'/update.html'));
  });
app.post('/submit',function(req,res){
  var cid=req.body.cid;
  var cname=req.body.cname;
  var address=req.body.address;
  var email=req.body.email;
  
  //res.write('You sent the username "' + req.body.cid+'".\n');
  //res.write('You sent the name "' + req.body.cname+'".\n');
  //res.write('You sent the address "' + req.body.address+'".\n');
  //res.write('You sent the email "' + req.body.email+'".\n');

  con.connect(function(err) {
  //if (err) throw err;
  var sql = "update customers set cname='"+cname+"',address= '"+address+"',email='"+email+"' where cid='"+cid+"'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record Updated");
    //console.log(name);
    res.redirect('test1');
  });
  });
})

//delete file
app.get('/test2',function(req,res){
  res.sendFile(path.join(__dirname+'/delete.html'));
});
app.post('/close',function(req,res){
  
  var cid=req.body.cid;
  //res.write('You sent the Id "' + req.body.cid+'".\n');
  con.connect(function(err) {
  //if (err) throw err;
  var sql =  "DELETE FROM customers WHERE cid="+cid+"";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
    res.redirect('test2');
    
  });
  });
})

app.get('/test3',(req, res) => {
  let sql = "SELECT * FROM customers";
  //let sql1 = "SELECT * FROM student";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

app.get('/test4',(req, res) => {
  let sql = "SELECT * FROM student";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view1',{
      results: results
    });
  });
});

app.get('/test3/:cid',(req, res) => {
  let cid=req.body.cid;
  let sql = "SELECT * FROM customers where cid="+cid+"";

  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

app.get('/auth',function(req,res){
	res.sendFile(path.join(__dirname+'/login.html'));
  });

app.post('/regist', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		con.query('SELECT * FROM Login WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/nextpage');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/nextpage', function(req, response) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});


app.listen(3000);
console.log("Running at Port 3000");