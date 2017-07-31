var net = require('net');

var client = net.connect({port: 1080}, function() {
   console.log('connect to the server.');  
   var buf = new Buffer("050100",'hex');
   client.write(buf);
	
});

client.on('data', function(data) {
	if(data[0] == '05' && data[1] == '01'){
		console.log("socks5 connected.");
	}
});

client.on('end', function() { 
   console.log('断开与服务器的连接');
});