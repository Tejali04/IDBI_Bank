var http = require('http');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mybank',
    port:3308
});

console.log('MySQL Connection details  '+connection);

http.createServer(function (request, response) 
{ 
        console.log('Creating the http server');
        connection.query('SELECT cid,cname FROM customers WHERE cid IN (?,?)',[1, 2], function(err, rows, fields)
        {
                console.log('no of records is '+rows.length);
                response.writeHead(200, { 'Content-Type': 'application/json'});
                response.end(JSON.stringify(rows));
                response.end();
        }); 

}).listen(8084);
