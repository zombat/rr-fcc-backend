// const siteURL = 'https://rr-fcc-backend.herokuapp.com';
const siteURL = 'http://127.0.0.1';

$( document ).ready(function() {
	console.log('Document Ready');

	
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
	
	getPolls();
	
	
	$(document).on('click','.result-entry', function() {
		var thisID = $(this).attr('id');
		var voteLabels = [];
		var voteCount = [];
		$('#poll-list').empty();
		$.getJSON(siteURL + '/vote-api?pollID=' + thisID).done(function(data) {
			thePoll = data;
			console.log(thePoll);
			$('#poll-list').append('<div id="' + thePoll._id + '"><h2>' + thePoll.pollTitle + '</h2><div id="canvasDiv"><canvas class="pull-right" id="resultChart"></canvas></div></div>');
			$('#' + thePoll._id).append('<select id="select-' + thePoll._id + '" name="Poll Choices" class="btn btn-poll"></select><button class="btn btn-primary btn-block">Sumbit Vote</button>');
			var counter = 0;
			while(counter < thePoll.pollChoices.length){
				$('#select-' + thePoll._id).append('<option value="' + counter + '">' + thePoll.pollChoices[counter][0] + '</option>');
				voteLabels.push(thePoll.pollChoices[counter][0]);
				voteCount.push(thePoll.pollChoices[counter][1]);
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
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1
					}]
				},
				options: {
				}
			});
			
			
			
		});
	});
	
});

	





function getPolls(){
	$.getJSON(siteURL + '/vote-api?pollList=true').done(function(data) {
		searchResultsArray = data;
		searchResultsArray.forEach(function(resultEntry){
			$('#poll-list').append('<div class="result-entry text-center" id="' + resultEntry._id + '">' + resultEntry.pollTitle + '</div>');
		});
	});
}

function entrySelect(){
	
}

