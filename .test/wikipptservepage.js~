var DDPClient = require("ddp");
var Gearman = require("node-gearman");
var gearman = new Gearman("localhost",4730);
var ddpclient = new DDPClient({
	host:"localhost",
	port:3000,
	ssl:false,
	autoReconnect:true,
	autoReconnectTimer:500,
	maintainCollections:true,
	ddpVersion: '1',
	userSockJs:true
});

ddpclient.connect(function(error, wasReconnect){
	if(error){
		console.log("DDP connection error!");
		return;
	}
	if(wasReconnect){
		console.log("Reestablishment of a connection.");
	}
	console.log('Connected!');
	
	var repeat=function(){
		ddpclient.call('fetchscrapeitem',['lmj'],function(err,result){
			console.log("Processing: "+result[0].topicname);
			gearman.on("connect",function(){
				var job = gearman.submitJob("scrape",result[0].topicname);
				job.on('data',function(data){
					console.log("THIS IS THE SCRAPPED DATA");
					var temp=data.toString("utf-8");
					console.log(temp);
				});
			});
			gearman.connect();
		},function(){
			console.log("DONE");
		});
	};
	repeat();
});
