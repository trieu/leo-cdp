// JavaScript Document
//HTML5 Ad Template JS from DoubleClick by Google

//Declaring elements from the HTML i.e. Giving them Instance Names like in Flash - makes it easier
var container;
var content;
var bgExit;

//Function to run with any animations starting on load, or bringing in images etc
init = function(){
	
	//Assign All the elements to the element on the page
	container = document.getElementById('container_dc');
	content = document.getElementById('content_dc');
	bgExit = document.getElementById('background_exit_dc');
	
	//Bring in listeners i.e. if a user clicks or rollsover
	addListeners();
	//Show Ad
	container.style.display = "block";
}


//Add Event Listeners
addListeners = function() {
	bgExit.addEventListener('click', bgExitHandler, false);
}

bgExitHandler = function(e) {
	//Call Exits
	Enabler.exit('HTML5_Background_Clickthrough');
}