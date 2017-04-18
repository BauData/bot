// instagramNode.js
// ========
var fs = require('fs');
var ATUtil = require('atutil');
var Client = require('instagram-private-api').V1;
var _ = require('underscore');
var should = require('should');
var device;
var storage;
var username;
var password;
var comment;
var tags;

var self = module.exports = {
	setup: function (config) {
		username = config.instagram.username;
		password = config.instagram.password;
    	device = new Client.Device(username);
    	storage = new Client.CookieFileStorage(__dirname + "/" + username + '.json');
    	comment = config.instagram.comment;
    	tags = config.tags.map( function(item, index) {
    		return item.replace('#','')
		});
    },

	postingArtwork: function (filePath, picturePath, textMedia) {
		fs.stat(filePath, function(err, stat) {
			if(err == null) {
				console.log("INSTAGRAM: Posting a video..");
				Client.Session.create(device, storage, username, password)
				.then(function(session) { 
					return [session, Client.Upload.video(session, filePath, picturePath)]
				})
			    .spread(function(session, upload) { 
			        return Client.Media.configureVideo(session, upload.uploadId, textMedia, upload.durationms)
			    })
				.then(function(medium) {
			        console.log("INSTAGRAM: video posted")
			    })
			    .catch(function(e) { 
				    console.log("INSTAGRAM: Posting a photo instead..");
					Client.Session.create(device, storage, username, password)
					.then(function(session) { 
						return [session, Client.Upload.photo(session, picturePath)]
					})
				    .spread(function(session, upload) { 
				        return Client.Media.configurePhoto(session, upload.params.uploadId, textMedia)
				    })
					.then(function(medium) {
				        console.log("INSTAGRAM: photo posted")
				    })
				 })
			}

		});
	},

	randomInteraction: function (customLocation) {

		var randomTag = ATUtil.randomInt(0, tags.length - 1);
		var tag = tags[randomTag]; 
		Client.Session.create(device, storage, username, password)
		.then(function(session) { 
        	return [session, new Client.Feed.TaggedMedia(session, tag)]
    	})
		.spread(function (session, tagRes) { 
			return [session, tagRes.get()]
		})
		.spread(function (session, media) { 
	   		var randomMedia = ATUtil.randomInt(0, media.length - 1); 
        	var user_id = media[randomMedia].account.id;
	        return Client.Relationship.create(session, user_id)
	    })
	    .then(function(relationship) {
	        console.log("INSTAGRAM: relationship created")
	    })

		Client.Session.create(device, storage, username, password)
		.then(function(session) { 
        	return [session, Client.discover(session, false, 1)]  
    	})
        .spread(function(session, discover) { 	
        	var randomAccount = ATUtil.randomInt(0, discover.length - 1); 
    		var account_id = discover[randomAccount].account.id;
    		var feed = new Client.Feed.UserMedia(session, account_id);
    		return [session, feed.get()]

    	})
    	.spread(function(session, media) {
    		var randomMedia = ATUtil.randomInt(0, media.length - 1); 
    		var media_id = media[randomMedia].id; 	
    		return Client.Comment.create(session, media_id, comment)
    	})
    	.then(function(comment) {
			console.log("INSTAGRAM: added comment")
		})


		Client.Session.create(device, storage, username, password)
		.then(function(session) {
		    return [session, Client.Location.search(session, customLocation)]   
		})
		.spread(function(session, locations) {
		     var locationFeed = new Client.Feed.LocationMedia(session, _.first(locations).id);
		    return [session, locationFeed.get()]
		})
		.spread(function(session, media) {
			var randomLocation = ATUtil.randomInt(0, media.length - 1);
			var locationRandom = media[randomLocation]; 
		    var mId = locationRandom.id;
		    return [session, Client.Like.destroy(session, mId), mId]
		})
		.spread(function(session, like, mId) {
		    return [session, Client.Media.getById(session, mId)]
			})
		.spread(function(session, m) {
		    m.params.hasLiked.should.equal(false);
		    return [session, Client.Like.create(session, m.id), m.id]
		})
		.spread(function(session, m, mId) {
		    return Client.Media.getById(session, mId)
		})
		.then(function(m) {
		    m.params.hasLiked.should.equal(true);
			console.log("INSTAGRAM: like media " + m.id)
		})
	}
};