/*
 * index.js
 * Clarifai Basic Application demo code
 * You can reference Clarifai's JavaScript library to 
 * complete this demo available at 
 * https://github.com/Clarifai/clarifai-javascript
 */
(function ($, Clarifai) {
	$(document).ready(function () {
		initialize()
	})

	// Finding a bunch of elements in the DOM
	var app = $(".app")
	var imageInput = $("#imageUrl");
	var submitButton = $("#submitBtn");
	var appClarifai;

	submitButton.on("click", function (event) {
		// getting the input from the image
		var prediced = false;
		var url = imageInput.val();
		//resetInfo();

		if(!validURL(url)){
			alert("Invalid URL. The URL must end in .jpg or .png");
			return;
		}

		/*
		 * TODO
		 * request Clarifai tag for the url by using Clarifai.getTagsByUrl{id:'SBU Hacks2018', version:'a2809388b23b4f3f829037fc376a79d4'}
		 */
	//	let appClarifai = new Clarifai.App({apiKey: '7fe98b11f3ef4db58d52e092c1349f8a'});
		appClarifai.models.predict({id:'SBU Hacks2018', version:'a2809388b23b4f3f829037fc376a79d4'}, url).then(
			function(response) {
				// do something with response
				var concept = response.outputs[0].data.concepts[0];
				var minProb = 0.49;
				var name = "";
				if(concept.value > minProb){
					console.log(concept.name);
					name = concept.name;
					prediced = true;
					if(name != "" && name != "no person")
						getWiki(name);	
				}
			},
			function(err) {
				alert("Try again in a few seconds (1)");
			}
		).then(
			function() {
				if(!prediced)
					generalPrediction(url);
			},
			function(err) {
				console.log("Try again in a few seconds (2)");
			}
				
		);
	});
	
	function generalPrediction(url){
		appClarifai.models.predict(Clarifai.GENERAL_MODEL, url).then(
			function(response) {
				console.log(response.outputs[0].data.concepts[0].name);
				console.log(response.outputs[0].data.concepts[1].name);
				console.log(response.outputs[0].data.concepts[2].name);
				name = response.outputs[0].data.concepts[0].name.toString();
				if(name != "" && name != "no person")
					getWiki(name);
			},
			function(err) {
				alert("Try again in a few seconds (3)");
			}
		);
	}

	function getWiki(name){
		name = name.charAt(0).toUpperCase() + name.slice(1);
		var site = 'http://en.wikipedia.org/wiki/'+ name;
			 WIKIPEDIA.getData(site, display, function(error) {
				console.log(error);
				}
			);
	}

	function validURL(url){
		var split = url.split(".");
		var type = split[split.length - 1];
		if(type == "png" || type == "jpg")
			return true;

		return false;
	}
	
	var display = function(info) {

      rawData = info.raw;
      var summaryInfo = info.summary;
      //var properties = rawData[info.dbpediaUrl];
	  openInfo(info.summary.title, info.summary.description);

      for (key in summaryInfo) {
        $('.summary .' + key).text(summaryInfo[key]);
      }
 	};

	// function to initialize the keys
	function initialize () {
		// getting the credential through calling getKeys()
		// which is available in Global scope because of keys.js
		var keys = getKeys() || {}

		var clientId = keys["CLARIFAI_CLIENT_ID"]
		var clientSecret = keys["CLARIFAI_CLIENT_SECRET"]

		if (!clientId || !clientSecret) {
			app.html("Enter your Clarifai's Client ID and Client Secret in order to successfully run this demo. Go to developer.clarifai.com, sign up and create your application if you haven't already. You'll have to edit keys.js file to enter your credentials")
		}
		else {
			appClarifai = new Clarifai.App({apiKey: '7fe98b11f3ef4db58d52e092c1349f8a'});		
		}


	}
}(jQuery, Clarifai));