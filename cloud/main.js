
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

Parse.Cloud.define("addFriendToFriendsRelation", function(request, response) {

	Parse.Cloud.useMasterKey();

	var friendRequestId = request.params.friendRequest;
	var query = new Parse.Query("FriendRequest");

    //get the friend request object
    query.get(friendRequestId, {

    	success: function(friendRequest) {

            //get the user the request was from
            var fromUser = friendRequest.get("from");
            //get the user the request is to
            var toUser = friendRequest.get("to");

            var relation = fromUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            relation.add(toUser);

            //save the fromUser
            fromUser.save(null, {

            	success: function() {

                    //saved the user, now edit the request status and save it
                    friendRequest.set("status", "accepted");
                    friendRequest.save(null, {

                    	success: function() {

                    		response.success("saved relation and updated friendRequest");
                    	}, 

                    	error: function(error) {

                    		response.error(error);
                    	}

                    });

                },

                error: function(error) {

                	response.error(error);

                }

            });

        },

        error: function(error) {

        	response.error(error);

        }

    });

});

Parse.Cloud.define("removeFriendToFriendsRelation", function(request, response) {

	Parse.Cloud.useMasterKey();

	var friendRequestId = request.params.friendRequest;
	var query = new Parse.Query("FriendRequest");

    //get the friend request object
    query.get(friendRequestId, {
    	success: function(friendRequest) {
            //get the user the request was from
            var fromUser = friendRequest.get("from");
            //get the user the request is to
            var toUser = friendRequest.get("to");

            var relation = fromUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            relation.remove(toUser);

            var reverseRelation = toUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            reverseRelation.remove(fromUser);

            // This section is a mess of a nest, I apologize.
            //save the fromUser
            fromUser.save(null, {
            	success: function() {
            		//save the toUser
            		toUser.save(null, {
            			success: function() {
		                    //saved the user, now destroy the friendRequest
		                    // friendRequest.set("status", "removed");
		                    friendRequest.destroy({
		                    	success: function(friendRequest) {
								    // The object was deleted from the Parse Cloud.
								    response.success("removed relation and deleted friendRequest");
								},
								error: function(friendRequest, error) {
								    // The delete failed.
								    // error is a Parse.Error with an error code and message.
								    response.error(error);
								}
							});
		                },
		                error: function(error) {
		                	response.error(error);
		                }
		            });
            	},
            	error: function(error) {
            		response.error(error);
            	}
            });
        },
        error: function(error) {
        	response.error(error);
        }
    });

});
