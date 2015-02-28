if(Meteor.isClient){
	if(Session.get("summarisedcontent")===undefined){
		Session.set("summarisedcontent",[]);
	}

	var checkIfSummarisedContentIsReady = function(){
		if(Session.get("scheduledcontentsummarycheck")===true)return;
		console.log("checking if summarised content is ready.... ");
		var temp = Session.get("summarisedcontent");
		var allready=true;
			//ping e.id to check for readiness
		var checkready = Meteor.call("checksummaryready",temp,function(err,res){
			if(err){
				console.log(err);
				return;
			}console.log(res);
			if(res.constructor===Array &&res.length>=2){
				if(res[0]!==true){
					console.log("nope");
					Meteor.setTimeout(checkIfSummarisedContentIsReady,3000);
				}else{
					console.log("done");
					Session.set("summarisedcontent",res[1]);
					Session.set("summarisedcontentready",true);
				}
			}else{
			//	console.log("nope");
			//	setTimeout(checkIfSummarisedContentIsReady,1000);
			}
		});
	}

	Template.displaycontent.helpers({
		'para':function(){
			return Session.get("pagecontent");
		},'ptype':function(x){
			return x==='p';
		},'h2type':function(x){
			return x==="h2";
		},'h3type':function(x){
			return x==="h3";
		},'wrapid':function(wip){
			return Session.get("gettopics")[0].jobid+"-"+wip;
		},'summarisedcontent':function(){
			var toreturn = [];
			var content=Session.get("summarisedcontent");
			console.log(content);
			content.forEach(function(e,i,a){
				if((a[i]).constructor === Array){
					(e.results).forEach(function(e,i,a){
						//console.log(a[i]);
						//toreturn.push({'pointcontent':e.results[i].str});
					});
				}
			});

			return toreturn;
		}
	});

	Template.displaycontent.events({
		'click .contentidcheckbox':function(e,t){
			if(e.target.checked){
				console.log("SEND CONTENT id: "+e.target.id+" FOR SUMMARISATION");
				/*ID is in the format KEbZHvHtHZfc22vkB-<id>*/
				
				var splitrawid = (e.target.id).split('-');
				var jobid = splitrawid[0];
				var paraid = splitrawid[1];
				var config = {};
				config['summaryrate']=50;
				
				Meteor.call("callsummaryofjobparagraph",jobid,paraid,config,function(err,res){
					if(err!==undefined)console.log(err);
					console.log(res);
					var temp = Session.get("summarisedcontent");
					temp.push({'id':res});
					Session.set("summarisedcontent",temp);
					Session.set("summarisedcontentready",false);
					checkIfSummarisedContentIsReady();
				});
			}
		}	
	});
}
