var Projects = new Mongo.Collection("projects");
if(Meteor.isServer){
	



	Meteor.methods({
		'addnewproject':function(str){
			str['timestamp']=new Date();
			str['creator']=this.userId;
			str['details']=[];	
			str['topics']="";
			Projects.insert(str);
			return true;
		},'getuserslides':function(st,en){
			var slides=Projects.find({'creator':this.userId},{$limit:10}).fetch();
			return slides;
		},'addtopic':function(newtopic,createid){
			var topic={};
			topic['topicname']=newtopic;
			topic['processed']=false;
			var add=Projects.update({'creator':this.userId,'_id':createid},{$push:{'details':topic}},{multi:false});
			return "HELLO";
		},'gettopics':function(createid){
			var get=Projects.find({'creator':this.userId,'_id':createid},{$limit:1}).fetch();
			return get[0].details;
		},'himj':function(y){
			return "YEA";
		}
	});

}
