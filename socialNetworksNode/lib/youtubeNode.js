// tumblrNode.js
// ========
var ATUtil = require('atutil');
var fs = require('fs');
var Youtube = require("youtube-api");
var username;
var psw;

var self = module.exports = {
	setup: function(config) {
		var  oauth = Youtube.authenticate({
		    type: "oauth",
		    client_id: config.youtube.client_id,
		    client_secret: config.youtube.client_secret,
		    redirect_url: config.youtube.redirect_url
		});
	},

	postingArtwork: function (filePath, textMedia, videoTitle) {
		fs.stat(filePath, function(err, stat) {
			if(err == null) {
				console.log("YOUTUBE: Posting a video..");
				// Upload video
				Youtube.videos.insert({
				    resource: {
				        snippet: {
				            title: videoTitle,
				            description: textMedia
				        },
				         status: {
				            privacyStatus: "public"
				        }
				    },
				    part: "snippet,status",
				    media: {
				        body: fs.createReadStream(filePath)
				    }
				}, function (err, data) {
				   console.log(err || data);
				});
			    
			}
		});
	}
};