var net = require('net');

	dstip='192.168.1.1';
	dstPort='80';
	
	console.log(dstip + ' ' + dstPort);
	
	var dstSock = new net.Socket();
	
	dstSock.setKeepAlive(false);
	
	dstSock.on('connect', function() {
		console.log("fuck");
		
		dstSock.on('data',function(data){
			console.log(data);
		});
	}).connect(dstPort, dstip);
	