var Gearman = require("node-gearman");
var gearman = new Gearman("localhost",4730);
var sha256 = require("sha256");
var cheerio = require("cheerio");
var request = require("request");
var striptags = require("striptags");
var fs = require('fs');

var ProcessWiki = function(){
	this.payload="";
	this.chunks=[];
	this.tidied=[];
	this.ready=false;
	this.load=function(_payload){
		this.payload=_payload;
		link="http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles="+_payload+"&format=json&continue";
	}	
	this.run=function(fuckyou,worker){
		if(link=="")return;
		var pagekey;
		request(link,function(error,response,body){
			if(!error && response.statusCode==200){
				var temp = JSON.parse(body).query.pages;
				for(var key in temp){
					if(temp.hasOwnProperty(key)){
						pagekey=key;		
						break;
					}
				}
			}
			if(!pagekey)return;
			var newtemp=[];
			temp=(temp[pagekey]).extract;
			//split temp based on <p>,<h2> and <h3>
			temp=(temp.split(/(\<(h[2|3])\>.*\<\/(\2)\>)|(\<p\>.*\<\/p\>)/));
			temp.forEach(function(element,ind,arr){
				if(!undesirable(element))newtemp.push(element);
			});
			this.chunks=newtemp;
			this.tidied=cleanup(this.chunks);
			this.ready=true;
			fuckyou(this.tidied,worker);
		});
	}
	function undesirable(e){
		if(e=="")return 1;
		if(typeof e=="undefined")return 1;
		if(e=="h2")return 1;
		if(e.length<5)return 1;
		if(e=="<p></p>")return 1;
		return false;
	}
	function cleanup(chunks){
		var tidied=[];
		chunks.forEach(function(e){
			if(e.match(/\<p\>.*\<\/p\>/)){	
				//Paragrah match
				var temp={};
				temp['type']="p";
				temp['data']=striptags(e);
				tidied.push(temp);
			}
			else if(e.match(/\<h2\>.*\<\/h2\>/)){	
				var temp={};
				temp['type']="h2";
				temp['data']=striptags(e);
				tidied.push(temp);
			}else if(e.match(/\<h3\>.*\<\/h3\>/)){
				var temp={};
				temp['type']="h3";
				temp['data']=striptags(e);
				tidied.push(temp);
			}
		});
		return tidied;
	}
}

var x = new ProcessWiki();
gearman.registerWorker("scrape",function(payload,worker){
	if(!payload){
		worker.error();
		return ;
	}
	console.log("Job "+payload+" received!");
	x.load(payload);
	x.run(function(yy,worker){
		fs.writeFile("temp/"+sha256(payload),JSON.stringify(yy),function(err){
			console.log("WRITTEN");	
			worker.end(sha256(payload));
		});
	},worker);
	
});
