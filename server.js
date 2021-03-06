var ATUtil = require('atutil');
var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var waitOn = require('wait-on');
var socialNetworksNode = require('socialNetworksNode');


//GLOBAL VAR
var fileObject;
var shader = '';
var bot = '';
var randomCityData;
var weatherText = '';
var weatherTemp = '';
var frameLimit;
var timing = 30 * 60 * 1000;
var customTags = [];
//checking system to not call the postingAll method two times
var posting = false; 


//SERVER EXPRESS
var app = express();
var server = app.listen(process.env.PORT || 3000, "0.0.0.0");
app.use(express.static('dist'));
app.get('/getRandomCity', setRandomCity);


//WEATHER CITIES
var jsonListCities = [];
//todo change name
fs.stat('city.list.json', function(err, stat) {
  	if(err == null) {
		fs.readFile('city.list.json', 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  else {
		  	var strLines = data.split("\n");
			for (var i in strLines) {
				var obj = JSON.parse(strLines[i]);
				jsonListCities.push(obj);
			}
			console.log("cities loaded");
		  } 
		});
	}
});


function setRandomCity (request, response) {
	customTags = [];
	var randomCity = ATUtil.randomInt(0, Object.keys(jsonListCities).length);
	randomCityData = { 
		"cityID": jsonListCities[randomCity]._id,
		"cityName": jsonListCities[randomCity].name,
		"cityCountry": jsonListCities[randomCity].country,
		"cityLat": jsonListCities[randomCity].coord.lat,
		"cityLon": jsonListCities[randomCity].coord.lon
	};
	response.send(randomCityData);

	var cityTags = [
 		"#" + randomCityData.cityName.replace(/ /g,""),
 		"#" + randomCityData.cityCountry,
 		"#" + randomCityData.cityLat,
 		"#" + randomCityData.cityLon
	];
	customTags = customTags.concat(cityTags); 
}

//SOCKET
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {

	console.log('new conncetion: ' + socket.id);
	socket.on("renderFrame", renderFrame);
	socket.on("coverFrame", coverFrame);
	socket.on("shader", setShader);
	socket.on("weather", setWeather);
	socket.on("bot", setBot);
	socket.on('frameLimit', setFrameLimit);

	function setShader (data) {
		shader = data;
		console.log("shader field is set");
	}

	function setBot (data) {
		if(bot != data) {
			bot = data;
			setFileObjectPath(data);
			setSocialNetwork(data);
			console.log("bot is set");
		}
		else {
			console.log("the bot has already been set");
		}
		setSocialNetworkInteraction();
	}

	function setFileObjectPath (data) {
		var folderPath = __dirname + '/media/' + data /*+ '/'*/;
		fileObject = {
	 		videoFile : folderPath + 'output.mp4',
	 		noiseVideoFile : folderPath + 'outputnoise.mp4',
	 		gifFile : folderPath + 'output.gif',
	 		gifLossyFile : folderPath + 'outputlossy.gif',
	 		imgCover : folderPath + 'outputcover.jpg'
		 };
		 console.log("fileObject is set");
	}

	function setSocialNetwork (data) {
		socialNetworksNode.setup(require('./src/' + data + '/config'));
	}

	function setSocialNetworkInteraction () {
		socialNetworksNode.interaction(randomCityData, timing);
	}

	function setWeather (data) {
		weatherText = data.description;
		weatherTemp = data.temperature;
		var weatherTags = [
	 		'#' + weatherText.replace(/ /g,"_"),
	 		'#' + weatherTemp + '°C'
	 	];
	 	customTags = customTags.concat(weatherTags); 
		console.log("weather fields are set");
	}
	function setFrameLimit(data) {
    	frameLimit = data;
	}

	function coverFrame(data) {
		if(fileObject) {
			ATUtil.checkExist(fileObject.imgCover);
			console.log("Creating a cover frame..");
			data = data.split(',')[1]; // Get rid of the data:image/png;base64 at the beginning of the file data
	        var buffer = new Buffer(data, 'base64');
			fs.writeFileSync(fileObject.imgCover, buffer.toString('binary'), 'binary');
			console.log("The cover frame is ready");
			if(frameLimit == 1) {
				socket.broadcast.emit('closeMsg', 1);

				if(!posting) {
					var opts = {
						resources: [fileObject.imgCover],
						window: 6000
					};
					posting = true;
					waitOn(opts, function (err) {
						if (err) { 
						  	return console.log(err); 
						}
						//removing all tmp images
						ATUtil.rmDir('./tmp');
						posting = false;
						postingAll();
					});
				}
			}
		}
	}

	function renderFrame(data) {
		if(fileObject) {
			data.file = data.file.split(',')[1]; // Get rid of the data:image/png;base64 at the beginning of the file data
	        var buffer = new Buffer(data.file, 'base64');
	        fs.writeFileSync(__dirname + '/tmp/frame-' + data.frame + '.png', buffer.toString('binary'), 'binary');
	        if (data.frame == frameLimit) {
	        	socket.broadcast.emit('closeMsg', 1);
	        	deleteFiles();
				createVideo();
				createGIF();

				if(!posting) {
					var opts = {
						resources: [fileObject.noiseVideoFile, fileObject.gifLossyFile],
						window: 60000
					};
					posting = true;
					waitOn(opts, function (err) {
					  if (err) { 
					  	return console.log(err); 
					  }
					  //removing all tmp images
					  ATUtil.rmDir('./tmp');
					  posting = false;
					  postingAll();
					});
				}
	        }
	    }
	}

	function createVideo() {
		console.log("Creating a video..");
		var cmd1 = '/usr/local/bin/ffmpeg -r 30 -i ./tmp/frame-%03d.png -vcodec libx264 -acodec aac -vf "scale=1280:trunc(ow/a/2)*2" -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k -ar 44100 -pix_fmt yuv420p -threads 0 ' + fileObject.videoFile;
		exec(cmd1, videoFinished(fileObject.videoFile));

		function videoFinished(filePath) {
			var opts = {
				resources: [filePath],
				window: 60000
			}
			waitOn(opts, function (err) {
			  if (err) { 
			  	return console.log(err); 
			  }
			  console.log("The video is ready");
			  createVideoNoise(filePath);
			});

			function createVideoNoise(fileParentPath) {
				
				console.log("Creating a video with noisy audio..");
				var cmd2 = '/usr/local/bin/ffmpeg -y -f lavfi -i aevalsrc="-2+random(0)" -i ' + fileParentPath + ' -c:v copy -preset slow -crf 19 -c:a aac -pix_fmt yuv420p -shortest ' + fileObject.noiseVideoFile;	
				exec(cmd2, noisyVideoFinished);	

				function noisyVideoFinished() {
					console.log("The noisy video is ready");
				}
			}
			
		}
	}

	function createGIF() {
		console.log("Creating an animated gif..");
		var cmd1 = "/usr/local/bin/convert -limit memory 900 -delay 0 -resize 25% -loop 0 ./tmp/frame-???.png " + fileObject.gifFile;
		exec(cmd1, gifFinished(fileObject.gifFile));

		function gifFinished(filePath) {
			var opts = {
				resources: [filePath],
				window: 60000
			}
			waitOn(opts, function (err) {
			  if (err) { 
			  	return console.log(err); 
			  }
			  console.log("The animated gif is ready");
			  createGIFLossy(filePath);
			});

			function createGIFLossy(fileParentPath) {
				console.log("Creating an animated lossy gif..");
				var cmd2 = "/usr/local/bin/gifsicle -O3 --lossy=80 " + fileParentPath + " -o " + fileObject.gifLossyFile;
				exec(cmd2, gifLossyFinished);	

				function gifLossyFinished() {
					console.log("The animated lossy gif is ready");
					
				}
			}
		}
	}
}

function deleteFiles() {
	ATUtil.checkExist(fileObject.videoFile);
	ATUtil.checkExist(fileObject.noiseVideoFile);
 	ATUtil.checkExist(fileObject.gifFile);
 	ATUtil.checkExist(fileObject.gifLossyFile);
}

function postingAll() {
 	if(frameLimit != 1) {
		socialNetworksNode.posting(customTags, shader, fileObject);
 	}
 	else {
 		socialNetworksNode.postingPhoto(customTags, shader, fileObject.imgCover);
 	}
}







