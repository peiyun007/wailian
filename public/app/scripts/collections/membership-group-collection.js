define(['talent', 'collections/membership-collection'], function(talent, MembershipCollection) {
	return talent.Collection.extend({
		url:'membership/allHierarchical'
		,getData : function(data) {
			var deferred = new $.Deferred();
			var id = parseInt(data.id);
			this.fetch().done(function(resp) {


				var activeData = talent._.where(resp, {"id" : parseInt(id)});				
				var subordinate = talent._.pluck(talent._.where(resp, {"superior" : id}), 'id');
				var superior = activeData.length > 0 ? parseInt(activeData[0]['superior']) : 0;
				var data = [superior, id].concat(subordinate);
				var membershipCollection = new MembershipCollection();
				membershipCollection.getData({
					data : data
				}).done(function(rel){
					
					var subordinateData = talent._.map(subordinate, function(value){
						var itemData = rel[value];
						itemData.subordinateCount = talent._.where(resp, {"superior" : value}).length;
						itemData.level = 3;
						return itemData;
					})

					var activeData = rel[id] || {
						id : 0
					};

					activeData.subordinateCount = talent._.where(resp, {"superior" : id}).length;
					activeData.level = 2;
					activeData.subordinate = subordinateData;

					var superiorData = rel[superior] || {
						id : 0
					};
					superiorData.level = 1;
					activeData.subordinateCount = talent._.where(resp, {"superior" : superior}).length;
					superiorData.subordinate = [activeData];

					var result = [superiorData];
					deferred.resolve(result);
				})
			})
			return deferred.promise();
		}
		,getSuperior : function(data) {
			var deferred = new $.Deferred();
			var id = parseInt(data.id);
			this.fetch().done(function(resp) {
				var activeData = talent._.where(resp, {"id" : id});
				deferred.resolve(activeData[0].superior);
			})
			return deferred.promise();
		}
	})
})