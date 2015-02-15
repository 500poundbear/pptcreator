if(Meteor.isClient){
	var fetchtopics = function(){
		Meteor.call('gettopics',Session.get('createid'),function(err,res){
			Session.set("gettopics",res);
		});
	};
	Template.create.events({
		'click #submittopic':function(e,t){
			var inputtopic = t.find("#inputtopic").value;	

			Meteor.call('addtopic',inputtopic,Session.get('createid'),function(err,res){
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
