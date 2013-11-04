require(['talent'
	,'collections/membership-group-collection'
	],function(talent
	,MembershipGroupCollection){
	// talent.app.reqres.setHandler('User', function(options, operation){
	// 	if(!UserListCollection.instance){
	// 		UserListCollection.instance = new UserListCollection(); 
	// 	}
	// 	return UserListCollection.instance[operation](options);
	// } );
	talent.app.reqres.setHandler('Membership', function(options, operation){
		if(!MembershipGroupCollection.instance){
			MembershipGroupCollection.instance = new MembershipGroupCollection(); 
		}
		return MembershipGroupCollection.instance[operation](options);
	});
})