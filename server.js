var net = require('net'),
	dns = require('dns');

function start(){
	
	function urlslice(url){
		var tmp = url.toString("hex",0,4) + ' ' 
				+ url.toString("utf8",5,url.length-2) + ' ' 
				+ parseInt(url.toString("hex",url.length-2),16);
		return tmp;
	}
	
	var server = net.createServer(function(connection) { 
	console.log('client connected.');
	
	connection.on('data',function(chunk){
		
		console.log("--------- data's length: " + chunk.length +"---------");

		var SOCKSVER = chunk[0];
		var NMETHODS = chunk[1];
		var METHODS = chunk[2];
		switch(SOCKSVER){
			case 05:
				if(chunk.length == 3){
					if(NMETHODS == '01' && METHODS == '00'){
						console.log("socks5 enable.");
						var buf = new Buffer("0500",'hex');
						connection.write(buf);
					}else{
						connection.close();
					}
				}
				
				if(chunk.length > 3){
					console.log(chunk);
					console.log(chunk.length + ' '+ urlslice(chunk));
					tcp_relay(connection,chunk);
				}
				break;
			default:
					console.log("NO SUPPORT");
		}
	});
	
	connection.on('end', function() {
		console.log("client disconnected.");
	});
});
	
	server.listen(8888, function() { 
	console.log('server is listening');
	});
	
}

function tcp_relay(socket, request){
	var domain = request.toString("utf8",5,request.length-2);
	var dstPort = parseInt(request.toString("hex",request.length-2),16);
	
	dns.lookup(domain,function(err,dstip){
		if(err){
			console.log("dns error");
		}
		
		console.log(dstip + ' ' + dstPort);
		var dstSock = new net.Socket();
		dstSock.setKeepAlive(false);
		dstSock.on('connect', function() {
				 if (socket.writable) {
					 console.log('dick1');
				  var localbytes = new Buffer([0x7f,0x00,0x00,0x01]),
					  len = localbytes.length,
					  bufrep = new Buffer(10),
					  p = 4;
				  bufrep[0] = 0x05;
				  bufrep[1] = 0x00;
				  bufrep[2] = 0x00;
				  bufrep[3] = 0x01;
				  for (var i = 0; i < len; ++i, ++p)
					bufrep[p] = localbytes[i];
				  bufrep.writeUInt16BE(dstSock.localPort, p, true);
				  socket.write(bufrep);
					 console.log('dick2');
				  socket.pipe(dstSock).pipe(socket);
				  socket.resume();
				 } else if (dstSock.writable)
				  dstSock.end();
			   }).connect(dstPort, dstip);
		socket.dstSock = dstSock;
	});
}

exports.start = start;