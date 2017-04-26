// twitterNode.js
// ========
var fs = require('fs');
var Twit = require('twit');
var Sentencer = require('sentencer');
var T;
var userName;
var tags;

var self = module.exports = {

  setup: function (config, configTags) {
  	T = new Twit(config);
  	self.setUsername();
    var streamUser = T.stream('user');
	streamUser.on('follow', self.followed);
	streamUser.on('unfollow', self.unfollowed);
	streamUser.on('tweet', self.tweetEvent);
	//If you don't handle the "error" event in your script, Node.js will handle it for you by exiting.
	streamUser.on('error', (err) => {
	  console.log('TWITTER: error!');
	});
	tags = configTags;
	var tagString = tags.join(",");
	var streamTwitter = T.stream('statuses/filter', { track: tagString });
	streamTwitter.on('tweet', self.retweet);
	streamTwitter.on('error', (err) => {
	  console.log('TWITTER: error!');
	});
  },

  setUsername: function () {
  	T.get('account/settings')
	  .catch(function (err) {
	    console.log('TWITTER: ', err.stack)
	  })
	  .then(function (result) {
	    userName = result.data.screen_name;
	})
  },

  postingArtwork: function (filePath, textMedia) {
	fs.stat(filePath, function(err, stat) {
		if(err == null) {
			console.log("TWITTER: Posting a video..");
		    T.postMediaChunked({ file_path: filePath}, function (err, data, response) {
				if(!err){
					var mediaIdStr = data.media_id_string;
  					var params = { status: textMedia, media_ids: [mediaIdStr], alt_text: { text:  textMedia} };
  					T.post('statuses/update', params, self.postTweet);
				}
				else{
					console.log("TWITTER: Error");
					console.log(err);
				}
			});
		}
	});
  },

  postingPhoto: function (filePath, textMedia) {
	fs.stat(filePath, function(err, stat) {
		if(err == null) {
			console.log("TWITTER: Posting a photo..");
			var b64content = fs.readFileSync(filePath, { encoding: 'base64' })
			T.post('media/upload', { media_data: b64content }, function (err, data, response) {
			  // now we can assign alt text to the media, for use by screen readers and 
			  // other text-based presentations and interpreters 
			  var mediaIdStr = data.media_id_string;
			  var meta_params = { media_id: mediaIdStr, alt_text: { text: textMedia } };
 
			  T.post('media/metadata/create', meta_params, function (err, data, response) {
			    if (!err) {
			      // now we can reference the media and post a tweet (media will attach to the tweet) 
			      var params = { status: textMedia, media_ids: [mediaIdStr] }
			 
			      T.post('statuses/update', params, self.postTweet);
			    }
			    else{
					console.log("TWITTER: Error");
					console.log(err);
				}
			  })
			})
		}
	});
  },

  postTweet: function (err, data, response) {
	if (!err) {
		console.log("TWITTER: A tweet posted");
	}
  },

  tweetIt: function (txt) {
    console.log("TWITTER: " + txt);
	var tweet = { 
			status: txt
	};
	T.post('statuses/update', tweet, self.postTweet);
  },

  followed: function (event) {	
	var screenName = event.source.screen_name;
	var screenNameTarget = event.target.screen_name;
	if (screenName != userName && userName) {
		console.log("TWITTER: Follow event");
		var nouns = Sentencer.make("{{ nouns }}");
  		var text = '.@' + screenName + ", do you like " + nouns + "?";
		self.tweetIt(text);
		self.friendship(event.source.id_str);
  	}
  },

  unfollowed: function (event) {
	var screenName = event.source.screen_name;
	if (screenName != userName) {
  		console.log("TWITTER: Unfollow event");
  		var text = '.@' + screenName + " adios!";
		self.tweetIt(text);
  	}
  },

  tweetEvent: function (eventMsg) {
	var replyTo = eventMsg.in_reply_to_screen_name;
	var from = eventMsg.user.screen_name;
	if (replyTo === userName && replyTo && from != userName) {
		console.log("TWITTER: Tweet event");
		var sentence = Sentencer.make(" {{ adjective }} {{ nouns }} are {{ adjective }}.");
		var newTweet = '.@' + from + ' thank you for tweeting me! ' + sentence;
		self.tweetIt(newTweet);
		self.friendship(eventMsg.user.id_str);
	}
  },

  retweet: function (eventMsg) {
  	if(eventMsg.user.screen_name != userName) {
  	  	T.post('statuses/retweet/' + eventMsg.id_str, function(error, tweet, response) {
		  	if (!error) {
		  		self.friendship(eventMsg.user.id_str);
			    console.log("TWITTER: A retweet posted");
			}
		});	
  	}
  },

  friendship: function (userID) {
  	T.post('friendships/create',  {id: userID} , function(error, tweet, response) {
	  	if (!error) {
		    console.log("TWITTER: Following a user");
		}
	});
  }
};