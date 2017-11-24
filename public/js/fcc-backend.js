var siteURL = 'https://rr-fcc-backend.herokuapp.com';
var userObject;
var colorSelectButton = '<select name="Poll Choices" class="btn btn-poll pull-right poll-choice poll-choice-color"><option value="aliceblue">aliceblue</option><option value="antiquewhite">antiquewhite</option><option value="aqua">aqua</option><option value="aquamarine">aquamarine</option><option value="azure">azure</option><option value="beige">beige</option><option value="bisque">bisque</option><option value="black">black</option><option value="blanchedalmond">blanchedalmond</option><option value="blue">blue</option><option value="blueviolet">blueviolet</option><option value="brown">brown</option><option value="burlywood">burlywood</option><option value="cadetblue">cadetblue</option><option value="chartreuse">chartreuse</option><option value="chocolate">chocolate</option><option value="coral">coral</option><option value="cornflowerblue">cornflowerblue</option><option value="crimson">crimson</option><option value="cyan">cyan</option><option value="darkblue">darkblue</option><option value="darkcyan">darkcyan</option><option value="darkgoldenrod">darkgoldenrod</option><option value="darkgray">darkgray</option><option value="darkgreen">darkgreen</option><option value="darkmagenta">darkmagenta</option><option value="darkorange">darkorange</option><option value="darkred">darkred</option><option value="darksalmon">darksalmon</option><option value="dodgerblue">dodgerblue</option></select>';
var colorSelectButtonTwo = '<select name="Poll Choices" class="btn poll-choice poll-choice-color"><option value="aliceblue">aliceblue</option><option value="antiquewhite">antiquewhite</option><option value="aqua">aqua</option><option value="aquamarine">aquamarine</option><option value="azure">azure</option><option value="beige">beige</option><option value="bisque">bisque</option><option value="black">black</option><option value="blanchedalmond">blanchedalmond</option><option value="blue">blue</option><option value="blueviolet">blueviolet</option><option value="brown">brown</option><option value="burlywood">burlywood</option><option value="cadetblue">cadetblue</option><option value="chartreuse">chartreuse</option><option value="chocolate">chocolate</option><option value="coral">coral</option><option value="cornflowerblue">cornflowerblue</option><option value="crimson">crimson</option><option value="cyan">cyan</option><option value="darkblue">darkblue</option><option value="darkcyan">darkcyan</option><option value="darkgoldenrod">darkgoldenrod</option><option value="darkgray">darkgray</option><option value="darkgreen">darkgreen</option><option value="darkmagenta">darkmagenta</option><option value="darkorange">darkorange</option><option value="darkred">darkred</option><option value="darksalmon">darksalmon</option><option value="dodgerblue">dodgerblue</option></select>';


$( document ).ready(function() {
	console.log('Document Ready');
	
	
	
	$.getJSON(siteURL + '/get-user').done(function(user) {
		userObject = user
		});
	
	$('#nav-logout').hover(function() {
		$('#nav-text').html('Sign Out');
	}, function() {
		$('#nav-text').text('');
	});
	
	$('#nav-login').hover(function() {
		$('#nav-text').html('Sign In');
	}, function() {
		$('#nav-text').text('');
	});
	
	$('#nav-fcc-vote').hover(function() {
		$('#nav-text').html('Free Code Camp Voting App');
	}, function() {
		$('#nav-text').text('');
	});
	
	
	
	$(document).on('click','.result-entry', function() {
		var thisID = $(this).attr('id');
		buildChart(thisID);
	});	
	
	$(document).on('click','#my-polls', function() {
		getPolls('mine');
	});
	
	$(document).on('click','#go-back', function() {
		getPolls('default');
	});
	
	$(document).on('click','#delete-poll', function() {
		var workingID = $(this).closest('.poll').attr('id');
		$.getJSON(siteURL + '/delete-poll?pollID=' + workingID + '&voteCast=' + $('#select-' + workingID).val().toString()).done(function(data) {	
			getPolls('default');
		});
	});
	
	$(document).on('click','.remove-poll-choice-button', function() {
		$(this).parent().remove();
	});	
	
	$(document).on('click','#custom-response-check', function() {
		if($('#custom-response-check').is(':checked')){
			$('.poll-choice').prop('disabled', false);
			$('.btn-poll').prop('disabled', true);
		} else {
			$('.poll-choice').prop('disabled', true);
			$('.btn-poll').prop('disabled', false);
		}
	});	
	
	$(document).on('click','#submit-poll', function() {
		var choicesArray = [];
		$('.poll-choice-entry').each(function(){
				var tempChoiceName = $(this).find('.poll-choice-name').val().toString();
				tempChoiceName = encodeURI(tempChoiceName);
				choicesArray.push( [ tempChoiceName, $(this).find('.poll-choice-color').val().toString() ] );
		});	
		$.getJSON(siteURL + '/submit-poll?newPoll=true&pollName=' + encodeURI($('#poll-name-box').val().toString()) + '&pollChoices=' + JSON.stringify(choicesArray)).done(function(data) {	
			alert('Submitted New Poll');
			getPolls();
		});
	});
	
	$(document).on('click','#create-poll', function() {
	$('#poll-list').empty();
		$('#poll-list').append('<div class="form-group"><label>Poll Name</label><input class="form-control" rows="1" id="poll-name-box" placeholder="Poll Name"></input></div><div class="form-group" id="poll-choices"><label>Poll Choices</label><button class="btn btn-success pull-right" id="add-poll-choice">+</button></div><button class="btn btn-primary btn-block" id="submit-poll">Submit This Poll</button><button class="btn btn-warning btn-block" id="go-back">Back to Polls</button>');
	});
	
	$(document).on('click','#add-poll-choice', function() {
		if($('#poll-choices').children().length < 52){
			$('#poll-choices').append('<div class="poll-choice-entry"><input class="form-control pull-left poll-choice poll-choice-name" rows="1" maxlength="100" placeholder="Poll Choice Name"></input><button class="btn btn-danger pull-right remove-poll-choice-button">-</button>' + colorSelectButton + '</div>');
		} else {
			alert('Arbitrary choice limit reached.');
		}
	});
	
	$(document).on('click','#submit-vote', function() {
		var workingID = $(this).closest('.poll').attr('id');
		
		// For custom response
		if($('#custom-response-check').is(':checked')){
			$.getJSON(siteURL + '/vote-api?pollID=' + workingID + '&customResponse=' + $('.poll-choice-name').val().toString() + '&customColor=' + $('.poll-choice-color').val().toString()).done(function(data) {	
					alert('Vote sucessfully cast for ' + $('.poll-choice-name').val().toString());
					buildChart(workingID);
				});
		} else {	
			$.getJSON(siteURL + '/vote-api?pollID=' + workingID + '&voteCast=' + $('#select-' + workingID).val().toString()).done(function(data) {	
				alert('Vote sucessfully cast for ' + $('#select-' + workingID).val().toString());
				buildChart(workingID);
			});
		}
	});
	
	// Use localhost if needed
	
	if(window.location.href.match(/127.0.0.1/) || window.location.href.match(/localhost/)){
		siteURL = 'http://127.0.0.1';
	}
	
	
	if(window.location.href.match(/pollID/)){
		buildChart(window.location.href.split('=')[1]);
	} else {
		getPolls();	
	}
	
});


function getPolls(type){
	$('#poll-list').empty();
	if (type == 'mine'){
		$.getJSON(siteURL + '/vote-api?myPolls=true').done(function(data) {
			searchResultsArray = data;
			searchResultsArray.forEach(function(resultEntry){
				$('#poll-list').append('<div class="result-entry text-center" id="' + resultEntry._id + '">' + resultEntry.pollTitle + '</div>');
			});
		});
	} else {	
		$.getJSON(siteURL + '/vote-api?pollList=true').done(function(data) {
			searchResultsArray = data;
			searchResultsArray.forEach(function(resultEntry){
				$('#poll-list').append('<div class="result-entry text-center" id="' + resultEntry._id + '">' + resultEntry.pollTitle + '</div>');
			});
		});
	}
}

function buildChart(thisID){
		var voteLabels = [];
		var voteCount = [];
		var voteColor = [];
		$('#poll-list').empty();
			$.getJSON(siteURL + '/vote-api?pollID=' + thisID).done(function(data) {
			thePoll = data;
			$('#poll-list').append('<div id="' + thePoll._id + '" class="poll"><h2>' + thePoll.pollTitle + '</h2><div id="canvasDiv"><canvas class="pull-right" id="resultChart"></canvas></div></div>');
			if(userObject){
				// Custom choices enabled if logged in.
				$('#' + thePoll._id).append('<select id="select-' + thePoll._id + '" name="Poll Choices" class="btn btn-poll"></select><h3>Custom Response <input id="custom-response-check" type="checkbox" value="" class="large-check"></div></h3><div id="custom-response-area"><input class="form-control poll-choice poll-choice-name" rows="1" maxlength="100" placeholder="Poll Choice Name"></input><div class="checkbox">' + colorSelectButtonTwo + '</div><div id="button-area"><button class="btn btn-primary btn-block" id="submit-vote">Sumbit Vote</button><button class="btn btn-warning btn-block" id="go-back">Back to Polls</button></div>');
				$('.poll-choice').prop('disabled', true);
			} else {
				$('#' + thePoll._id).append('<select id="select-' + thePoll._id + '" name="Poll Choices" class="btn btn-poll"></select><div id="button-area"><button class="btn btn-primary btn-block" id="submit-vote">Sumbit Vote</button><button class="btn btn-warning btn-block" id="go-back">Back to Polls</button></div>');	
			}
			var counter = 0;
			while(counter < thePoll.pollChoices.length){
				$('#select-' + thePoll._id).append('<option value="' + thePoll.pollChoices[counter].choiceName + '">' + thePoll.pollChoices[counter].choiceName + '</option>');
				voteLabels.push(thePoll.pollChoices[counter].choiceName);
				voteCount.push(thePoll.pollChoices[counter].voteCount);
				voteColor.push(thePoll.pollChoices[counter].voteColor);
				counter++;
			}
			
			
			
			var ctx = document.getElementById("resultChart").getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: voteLabels,
					datasets: [{
						label: '# of Votes',
						data: voteCount,
						backgroundColor: voteColor,
						borderColor: voteColor,
						borderWidth: 1
					}]
				},
				options: {
				}
			});
			
			if(userObject.id == thePoll.pollOwner){
				$(document).find('#button-area').append('<button class="btn btn-danger btn-block" id="delete-poll">Delete Poll</button>');
			}
			if(1==1){
				var workingID = $('.poll').attr('id');
				//$(document).find('#button-area').append('<div class="fb-share-button" data-href="' + siteURL + '/fcc-voting?pollID=' + workingID + '" data-layout="button_count"><button class="btn btn-block"></button></div>');
				$(document).find('#button-area').append('<div class="fb-share-button" data-href="https://rr-fcc-backend.herokuapp.com/fcc-voting?pollID=5a17279ab685810014698de9" data-layout="button" data-size="large" data-mobile-iframe="false"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Frr-fcc-backend.herokuapp.com%2Ffcc-voting%3FpollID%3D5a17279ab685810014698de9&amp;src=sdkpreparse">Share</a></div>');
			}
		});
		
}
