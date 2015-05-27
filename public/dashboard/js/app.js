function getEventsSource() {
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

			/* Get the calendar events. */
			var calObject = results[0];

			if(calObject) {
				calendarData = calObject.get('calendarArray');
			} 


			/* Setup the calendar options. */
			var options = {
				events_source: calendarData,
				view: 'week',
				tmpl_path: 'tmpls/',
				tmpl_cache: false,
				modal: "#events-modal",
				// day: '2013-03-12',
				day: 'now',
				onAfterEventsLoad: function(events) {
					if(!events) {
						return;
					}
					var list = $('#eventlist');
					list.html('');

					$.each(events, function(key, val) {
						$(document.createElement('li'))
							.html('<a href="' + val.url + '">' + val.title + '</a>')
							.appendTo(list);
					});
				},
				onAfterViewLoad: function(view) {
					$('.page-header h3').text(this.getTitle());
					$('.btn-group button').removeClass('active');
					$('button[data-calendar-view="' + view + '"]').addClass('active');
				},
				classes: {
					months: {
						general: 'label'
					}
				}
			};


			/* Setup the calendar view. */
			var calendar = $('#calendar').calendar(options);

			$('.btn-group button[data-calendar-nav]').each(function() {
				var $this = $(this);
				$this.click(function() {
					calendar.navigate($this.data('calendar-nav'));
				});
			});

			$('.btn-group button[data-calendar-view]').each(function() {
				var $this = $(this);
				$this.click(function() {
					calendar.view($this.data('calendar-view'));
				});
			});

			$('#first_day').change(function(){
				var value = $(this).val();
				value = value.length ? parseInt(value) : null;
				calendar.setOptions({first_day: value});
				calendar.view();
			});

			$('#language').change(function(){
				calendar.setLanguage($(this).val());
				calendar.view();
			});

			$('#events-in-modal').change(function(){
				var val = $(this).is(':checked') ? $(this).val() : null;
				calendar.setOptions({modal: val});
			});
			$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
				//e.preventDefault();
				//e.stopPropagation();
			});


		},
		error: function(error) {
	        console.log( "Error: " + error.code + " " + error.message );
		}
	});
};


(function($) {

	"use strict";

	getEventsSource();

}(jQuery));