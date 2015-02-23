if(Meteor.isClient){
	var fetchtopics = function(){
		Meteor.call('gettopics',Session.get('createid'),function(err,res){
			Session.set("gettopics",res);
			console.log("GETTOPICS");
			console.log(res);
			var ready=true;
			res.forEach(function(e){
				if(e.processed===false)ready=false;
			});
			if(!ready){
				console.log("NOT READY");
				Meteor.setTimeout(fetchtopics,2000);
			}else{
				console.log("READY");
				//Once ready, populate screen with content
				if(res.length>0 ){	
					res.forEach(function(e,i){
						Meteor.call('getcontent',e.jobid,function(err,res){
							console.log(res);
							Session.set("pagecontent",res);
						});
					});
				}
			}
		});
	};
	Template.create.events({
		'click #submittopic':function(e,t){
			if(Session.get("gettopics").length>1){
				alert("Limited to 1 currently!");
				return false;
			}
			
			var inputtopic = t.find("#inputtopic").value;	

			Meteor.call('addtopic',inputtopic,Session.get('createid'),function(err,res){
				alert(res);
				console.log("Topic Added");
			});
			fetchtopics();
			return false;
		}	
	});
	Template.create.helpers({
		'createid':function(){
			return Session.get("createid");
		},
		'chosentopics':function(){
			fetchtopics();
			return Session.get("gettopics");
		}
	});
}
