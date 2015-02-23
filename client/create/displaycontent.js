if(Meteor.isClient){
	if(Session.get("summarisedcontent")===undefined){
		Session.set("summarisedcontent",[]);
	}

	var checkIfSummarisedContentIsReady = function(){
		var temp = Session.get("summarisedcontent");
		var allready=true;
		temp.forEach(function(e,i,a){
			//ping e.id to check for readiness
			var checkready = Meteor.call("checksummaryready",e.id,function(err,res){
				if(err){
					console.log(err);
					return;
				}
				console.log("CALLED CHECKSUMMARY READY WITH "+e.id);	
				console.log("res: "+res);
				
				//TODO
				//if(!res)setTimeout(checkifSummarisedContentIsReady,500);
			});
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
					checkIfSummarisedContentIsReady();
				});
			}
		}	
	});
}
