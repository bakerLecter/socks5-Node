var net = require('net');

function start(){
	
	function urlslice(url){
		var tmp = url.toString("hex",0,4) + ' ' 
				+ url.toString("utf8",5,url.length-2) + ' ' 
				+ parseInt(url.toString("hex",url.length-2),16);
		return tmp;
	}
	
	var server = net.createServer(function(connection) { 
	console.log('client connected.');
	
	connection.on('data',function(data){
		
		console.log("--------- data's length: " + data.length +"---------");
	/**	if(data[0] != '05'){
			connection.close();
		} **/
		connection.pipe(connection);
		if(data.length == 3){
			if(data[1] == '01' && data[2] == '00'){
				console.log("socks5 enable.");
				var buf = new Buffer("0500",'hex');
				connection.write(buf);
			}else{
				connection.close();
			}
		}
		
		if(data.length > 3){
			console.log(data);
			console.log(data.length + ' '+ urlslice(data));
			if(data[3] == '03'){
			
			}
			var socksbuf = new Buffer("050000",'hex');
			var redirect = new Buffer(data.slice(3,data.length),"hex");

			var tmp = Buffer.concat([socksbuf,redirect]);
			console.log(tmp);
			
			connection.write(tmp);
		}
	});
	
	connection.on('end', function() {
		console.log("client disconnected.");
	});

});
	
	server.listen(1080, function() { 
	console.log('server is listening');
	});
	
}

exports.start = start;