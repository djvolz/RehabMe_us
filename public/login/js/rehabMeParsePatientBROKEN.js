/*
TODO: 
1. fix table alignment problem. Right now the two tables columns are not aligned
2. fix facebook login
*/


$( document ).ready(function() {

	// color codes
	var red = '#E57373';
	var yellow = '#FFF59D';
	var green = '#A5D6A7';

	// Parse credentials (App Id, JavaScript key)
	var AppId 		  = "jix4a7ziO3LTyuL4PZ3IyyRUA7DmnwRO0zvka2z5";
	var JavaScriptKey = "YjcdhUmLeR4w43lx7lYyCmKJZXCXaiZDVADzSCJk";

	// Parse credentials (App Id, JavaScript key)
	Parse.initialize( AppId, JavaScriptKey );


	// Parse object
	var Exercise = Parse.Object.extend( "Exercise" );
	// Query
	var query = new Parse.Query( Exercise );
	// order by
	query.descending( "updatedAt" );
	// limit how many entries you would like to query
	// query.limit( 5 );

	// you can filter the data (all entries where skipped is CalfRaises)
	//query.equalTo( "skipped", "CalfRaises" );

	// Data we are creating for the table
				//var myExercises = '';
				//var performed = [];
		// for calculate number of exercises skipped and performed
	var numberPerformed = 0;
	var numberSkipped = 0;
	var duration_long = '';
		// for constructing the exercise table head
	var data = {};
	var currentExercise = {};
	var allExercises = [];
	var DayCol = '';
	var performed = false;
		// for fill the date column
	var date = '';
	var allDates = [];
	var performanceScore = []; // array of performance score associated with each row (exercise)
	var performanceScore2 = [];// array of performance score associated with each column (date)
	//var needToDo = 5;// TODO: replace 5 with actual number of times an exercise needs to be performed

	// Actual pending-words finding function
	query.find( {

		success: function( results ) {
			console.log("Results length: " + results.length);
			console.log(results);

			var exercise;
			for (exercise in results) {

				// get all dates, in the format of 'Sun Mar 29 2015'
				date = String(object['createdAt']);
				var dateCol = date.substr(0,15);
				if (!data[dateCol]) { // if this is new data entry
					data[dateCol] = {}; // add new data entry
				}

			 	// get current exercise 
			 	if (object.get('performed')){
			 		currentExercise = object.get('performed');
			 		performed = true;
					numberPerformed = currentExercise.length;
					console.log(numberPerformed);
				} 
				else {
					currentExercise = object.get('skipped')
					numberSkipped = currentExercise.length;
					performed = false;
				}
				if (!data[dateCol][currentExercise]) {
					data[dateCol][currentExercise] = 0
					if (performed) {
						data[dateCol][currentExercise] = 1
					}
				}
				else {
					if (performed) {
						data[dateCol][currentExercise] += 1
					}
				}

			}
			allExercises = Object.keys(data[dateCol]);
			allDates = Object.keys(data);
			$('#datesColSpan').attr('colspan', allDates.length)

			//construct table head: Dates
			var width = 80/allDates.length;
			for (i=allDates.length-1;i>=0;i--){
				DayCol += '<td id="dateCol-' + String(allDates.length-i) + '" align="center" width='+ String(width) + '%>' + allDates[i] + '</td>'
			}

			// fill in dates and data for one row
			var td = '<td width=20% align="center" '
			var dataEntry = '';
			for (j=0;j<allExercises.length;j++) {
				var performanceScoreTemp = 0; // cumulative performance score for each exercise
				dataEntry += '<tr id="' + 'exercise-'+String(j)+'">'; // create id for exercise row
				dataEntry += td + 'id="exercise-name-' + String(j) + '">' + allExercises[j];
				for (i=allDates.length-1;i>=0;i--){
					var performance = data[allDates[i]][allExercises[j]]; 
					if (!performance) {
						// if performance undefined, assign 0
						performance = 0;
					}
					performanceScoreTemp += performance; // actual performance ratio in decimal
					var dataEntry_input = String(performance);
					dataEntry += '<td align="center" width=' + String(width) + '%>' 
					 + dataEntry_input + '</td>'
				}
				dataEntry += '</td><tr>'
				performanceScore.push(performanceScoreTemp/allDates.length);
			}

			// calculate performance score by date
			for (i=allDates.length-1;i>=0;i--) {
				var performanceScoreTemp2 = 0;
				for (j=0;j<allExercises.length;j++) {
					performanceScoreTemp2 += data[allDates[i]][allExercises[j]];
				}
				performanceScore2.push(performanceScoreTemp2/allExercises.length);
			}
			
			// display data
			$ ( '#wordData' ).html(dataEntry);
			$ ( '#Date' ).html( DayCol );
			$ ( '#counter-performed' ).html(numberPerformed);
			$ ( '#counter-skipped' ).html(numberSkipped);

			// modify row data color
			var table = $('#wordData'),
				row = table.find('tr');
			// loop through rows and change color row by row
			for (i=0;i<row.length;i++) {
				if (performanceScore[i] >= 1) {
					$('#exercise-name-'+String(i)).css('background-color', green);
				} 
				else if ( 1/3 <= performanceScore[i] && performanceScore[i] < 1) {
					$('#exercise-name-'+String(i)).css('background-color', yellow);
				} else { 
					$('#exercise-name-'+String(i)).css('background-color', red); // color entire row red if not perform well
				}
			}

			// modify column data color
			for (i=1;i<=performanceScore2.length;i++) {
				if (performanceScore2[i-1] <= 1/3) {
					//var accessor1 = '#wordData tr td:nth-child(' + String(i+1) + ')';
					//$(accessor1).css('background-color', red);
					var accessor2 = '#dateCol-'+String(i);
					$(accessor2).css('background-color', red);
				}
				else if (performanceScore2[i-1] > 1/3 && performanceScore2[i-1] <= 2/3) {
					var accessor2 = '#dateCol-'+String(i);
					$(accessor2).css('background-color', yellow);
				} else {
					var accessor2 = '#dateCol-'+String(i);
					$(accessor2).css('background-color', green);
				}
			}

			// set panel head color
			var minPerformance = Math.min.apply(Math,performanceScore2);
			if (minPerformance < 1/3) {
				$('.panel-heading').css('background-color', red);
			} 
			else if (minPerformance>=1/3 && minPerformance< 2/3) {
				$('.panel-heading').css('background-color', yellow);
			} else {
				$('.panel-heading').css('background-color', green);
			}
			
		},
	    // Handle errors
	    error: function( error ) {
	        console.log( "Error: " + error.code + " " + error.message );
	    }
   	});
});