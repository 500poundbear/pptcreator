if(Meteor.isClient){
	Template.displaycontent.helpers({
		'para':function(){
			return Session.get("pagecontent");
		},'ptype':function(x){
			return x==='p';
		},'h2type':function(x){
			return x==="h2";
		},'h3type':function(x){
			return x==="h3";
		}
	});
}
