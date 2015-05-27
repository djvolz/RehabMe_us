$( document ).ready(function() {
	// Parse credentials (App Id, JavaScript key)
	var AppId 		  = "jix4a7ziO3LTyuL4PZ3IyyRUA7DmnwRO0zvka2z5";
	var JavaScriptKey = "YjcdhUmLeR4w43lx7lYyCmKJZXCXaiZDVADzSCJk";

	// Parse credentials (App Id, JavaScript key)
	Parse.initialize( AppId, JavaScriptKey );



	// Parse object
	var Calendar = Parse.Object.extend( "Calendar" );
	// Query
	var query = new Parse.Query( Calendar );

	var calendarData = [];

	query.find({
		success: function(results) {
				// var calObject = results[0];

				// if(calObject) {
				// 	calendarData = calObject.get('calendarArray');
				// } 
			},
			error: function(error) {
		        console.log( "Error: " + error.code + " " + error.message );
			}
		});
	});
	
	var eventsSource = {"success": 1, "result": calendarData};

	return eventsSource;
});