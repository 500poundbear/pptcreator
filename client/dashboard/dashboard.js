var Projects = new Mongo.Collection("projects");
if(Meteor.isClient){
	
	Meteor.call('getuserslides',function(err,result){
		Session.set("getuserslides",result);
	});	
	Meteor.methods({
		'createdslides':function(){
			return [{'test':'test'}];

		}
	});
	Template.dashboard.events({
		'click #createnewslides':function(e,t){
			var createnewslidesname=t.find("#createnewslidesname").value;
			
			//Validation here
			Meteor.call('addnewproject',{'name':createnewslidesname},function(err,result){
				if(result){
					alert("Project "+createnewslidesname+" Added!");
				}

				Meteor.call('getuserslides',function(err,result){
					Session.set("getuserslides",result);
				});	
			});
		}
	});	
	Template.dashboard.helpers({
		'randomslidesname':function(){
			return 'My New Slides'+Math.ceil(Math.random()*100);
		},'createdslides':function(){
			return Session.get("getuserslides");
		}
	});
}
