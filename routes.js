Router.route('/',function(){
	this.render('home');
});
Router.route('/login',function(){
	this.render('login');
});
Router.route('/about',function(){
	this.render('about');
});
Router.route('/dashboard',function(){
	this.render('dashboard');
});
Router.route('/create',function(){
	this.render('create');
});
Router.route('/create/:_id',function(){
	Session.set("createid",this.params._id);
	this.render('create');
});
