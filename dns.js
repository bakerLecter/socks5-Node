var dns = require('dns');

var domain = "www.baidu.com";
dns.lookup(domain,function(err,ip){
	if(err){
		console.log("fuck up");
	}
	console.log(ip);
})