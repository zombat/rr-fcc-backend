var workingDocumentID;
const hostName = 'https://rr-qdda.herokuapp.com';

$( document ).ready(function() {
	console.log('Document Ready');
	
	$('#updateButton').attr('disabled', true);
	$('#deleteButton').attr('disabled', true);
	$("#insertButton").attr("disabled", true);
	
	$('#nav-directory').hover(function() {
		$('#nav-text').html('Directory');
	}, function() {
		$('#nav-text').text('');
	});	
	
	$('#nav-message').hover(function() {
		$('#nav-text').html('Message');
	}, function() {
		$('#nav-text').text('');
	});	
	
	$('#nav-alerts').hover(function() {
		$('#nav-text').html('Alerts');
	}, function() {
		$('#nav-text').text('');
	});
	
	$('#nav-settings').hover(function() {
		$('#nav-text').html('Settings');
	}, function() {
		$('#nav-text').text('');
	});
	
	$('#nav-profile').hover(function() {
		$('#nav-text').html('Profile');
	}, function() {
		$('#nav-text').text('');
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
	
	
	$('#updateButton').click(function(){
		if(checkData()){
		sanitizeNumbers();
			var contactMethodArray = [];
			$('.contact-method-entry').each(function(){
				var tempString = $(this).find('.contactMethodName').val().toString();
				tempString = encodeURI(tempString);
				contactMethodArray.push( [ tempString, $(this).find('.contactMethodData').val().toString() ] );
			});
			var jsonDocument = {
				'_id' : workingDocumentID,
				'firstName' : encodeURI($('#firstNameBox').val()),
				'lastName' : encodeURI($('#lastNameBox').val()),
				'contactMethods' : contactMethodArray
			};
			$.getJSON(hostName + '/UpdateRecord/' + JSON.stringify(jsonDocument)).done(function(err, res) {
				if(err){
				}
				if(res){
					alert('Updated Record.');
					searchQuery();
				} else {
					alert('Error: Record not updated.');
				}
			});
		}
	});
	
	$(document).on('keyup','.contactMethodData', function() {
	});	
	
	
	
	
	
	
	$('#searchBox').keyup(function(event) {
		if (event.keyCode === 13) {
			searchQuery();
		}
	});
	
	
	$('#searchButton').click(function(){
			searchQuery();
		});
		
		
	$('#debugButton').click(function(){
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		// -------------------------------------------------------------------------------------- DEBUG CODE!!!
		
		

		
	});	

	
	$('#newButton').click(function(){
		$('#contactMethods').empty();
		$('#searchBox').val('');
		$('#firstNameBox').val('');
		$('#lastNameBox').val('');
		workingDocumentID = null;
		$("#updateButton").attr("disabled", true);
		$("#deleteButton").attr("disabled", true);
		$("#insertButton").attr("disabled", false);
	});
		
				
	$('#insertButton').click(function(){
		if(checkData()){
			$("#insertButton").attr("disabled", true);
			sanitizeNumbers;
			var contactMethodArray = [];
			$('.contact-method-entry').each(function(){
				var tempString = $(this).find('.contactMethodName').val().toString();
				tempString = encodeURI(tempString);
				contactMethodArray.push( [ tempString, $(this).find('.contactMethodData').val().toString() ] );
			});
			var jsonDocument = {
				'firstName' : encodeURI($('#firstNameBox').val()),
				'lastName' : encodeURI($('#lastNameBox').val()),
				'contactMethods' : contactMethodArray
			};
			
			$.getJSON(hostName + '/InsertRecord/' + JSON.stringify(jsonDocument)).done(function(err, res) {
				if(err){
				}
				if(res){
					alert('Inserted Record.');
					$('#searchBox').val($('#firstNameBox').val().toString());
					searchQuery();
					$('#firstNameBox').val('');
					$('#lastNameBox').val('');
					workingDocumentID = null;
				}
			});
		}
	});	
	
	
	$('#deleteButton').click(function(){
		var jsonDocument = {
			'_id' : workingDocumentID
		};
		$.getJSON(hostName + '/UpdateRecord/' + JSON.stringify(jsonDocument)).done(function(err, res) {
			if(err){
			}
			if(res){
					alert('Deleted Record.');
				searchQuery();
			}
		});
	});
	
	
	$(document).on('click','.removeContactMethodButton', function() {
		$(this).parent().remove();
	});
	
	
	$('#addContactMethodButton').click(function() {
		if($('#contactMethods').children().length < 64){
			$('#contactMethods').append('<div class="contact-method-entry"><input class="form-control pull-left contact-method contactMethodName" rows="1" maxlength="17" placeholder="Contact Method Name"></input><button class="btn btn-danger pull-right removeContactMethodButton">-</button><input class="form-control pull-right contact-method contactMethodData" rows="1" maxlength="17" placeholder="Contact Number"></input></div>');
		} else {
			alert('A maximum of 64 contact methods are supported');
		}
	});
	searchQuery();
	var date = BSONDateTime.create();
	alert();
});

function entrySelect(data){
	var searchResultsArray = [];
	$('#contactMethods').empty();
	$.getJSON(hostName + '/SearchID/' + data ).done(function(data) {
		searchResultsArray = data;
		$('#firstNameBox').val(searchResultsArray[0].firstName);
		$('#lastNameBox').val(searchResultsArray[0].lastName);
		if(searchResultsArray[0].contactMethods){
			searchResultsArray[0].contactMethods.forEach(function(contactMethod){
				$('#contactMethods').append('<div class="contact-method-entry"><input tool class="form-control pull-left contact-method contactMethodName" rows="1" value="' + contactMethod[0] + '" maxlength="17" placeholder="Contact Method Name"></input><button class="btn btn-danger pull-right removeContactMethodButton">-</button><input class="form-control pull-right contact-method contactMethodData" rows="1" value="' + contactMethod[1] + '" maxlength="17" placeholder="Contact Number"></input></div>');
			});
		}
		workingDocumentID = searchResultsArray[0]._id;
		$("#updateButton").attr("disabled", false);
		$("#deleteButton").attr("disabled", false);
		$("#insertButton").attr("disabled", true);
	});
}

function searchQuery(){
	var searchResultsArray = [];
	$( "#searchResults" ).empty();
	if($('#searchBox').val().toString() === '' || $('#searchBox').val().toString() === ' '){
		$.getJSON(hostName + '/SearchDB/.*').done(function(data) {
			searchResultsArray = data;
			searchResultsArray.forEach(function(resultEntry){
				$('#searchResults').append('<div class="result-entry" ><div onclick="entrySelect(\'' + resultEntry._id + '\')">' + resultEntry.firstName + ' ' + resultEntry.lastName + '</div></div>');
			});
		});
	}
	
	$.getJSON(hostName + '/SearchDB/' + $('#searchBox').val().toString()).done(function(data) {
		searchResultsArray = data;
		searchResultsArray.forEach(function(resultEntry){
			$('#searchResults').append('<div class="result-entry" ><div onclick="entrySelect(\'' + resultEntry._id + '\')">' + resultEntry.firstName + ' ' + resultEntry.lastName + '</div></div>');
		});
	});
}

function sanitizeNumbers(){
	$('.contact-method-entry').each(function(){
		var tempString = $(this).find('.contactMethodData').val().toString();
		tempString = tempString.replace(/[^0-9.]/g, '');
		$(this).find('.contactMethodData').val(tempString);
	});
}

function checkData(){
	var warnings = 0;
	var errors = 0;
	var alertMessage = '';
	if($('#lastNameBox').val().length === 0){
		errors++;
		$('#lastNameBox').addClass('btn-danger');
		alertMessage += 'Last name field cannot be blank.\n';
	} else {
		$('#lastNameBox').removeClass('btn-danger');
	}
	if($('#firstNameBox').val().length === 0){
		warnings++;
		$('#firstNameBox').addClass('btn-warning');
		alertMessage += 'First name field should not be blank.\n';
	} else {
		$('#firstNameBox').removeClass('btn-warning');
	}
	$('.contact-method-entry').each(function(){
		if($(this).find('.contactMethodName').val().length === 0){
			errors++;
			$(this).find('.contactMethodName').addClass('btn-danger');	
			if(!alertMessage.match(/Contact method name cannot be blank./g)){
				alertMessage += 'Contact method name cannot be blank.\n';
			}
		} else {
			$(this).find('.contactMethodName').removeClass('btn-danger');	
		}
		if($(this).find('.contactMethodData').val().length === 0){
			warnings++;
			$(this).find('.contactMethodData').addClass('btn-warning');	
			if(!alertMessage.match(/Contact number should not be blank./g)){
				alertMessage += 'Contact number should not be blank.\n';
			}
		} else {
			$(this).find('.contactMethodData').removeClass('btn-warning');	
		}
	});
	if(alertMessage){
		alert('Errors :' + errors + '\nWarnings :' + warnings + '\n' + alertMessage);
	}
	if(errors !== 0){
		return false;
	} else {
		return true;
	}
}
