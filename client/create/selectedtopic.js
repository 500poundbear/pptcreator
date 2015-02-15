if(Meteor.isClient){
	Template.selectedtopic.helpers({
		'statuscolour':function(status){
			return (status)?"green":"yellow";
		}
	});




}
