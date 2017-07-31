var net = require('net');

var server = net.createServer(function(connection) {
	server.listen(1080, function() { 
		console.log('server is listening');
	});
});