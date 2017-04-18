// tumblrNode.js
// ========
var ATUtil = require('atutil');
var fs = require('fs');
var tumblr = require('tumblr.js');
var client;
var currentBlogName;
var tags;

var self = module.exports = {
	setup: function(config) {
		client = tumblr.createClient({
			consumer_key: config.tumblr.consumer_key,
			consumer_secret: config.tumblr.consumer_secret,
			token: config.tumblr.token,
			token_secret: config.tumblr.token_secret
		});
		currentBlogName = config.tumblr.blogName;
		tags = config.tags.map( function(item, index) {
    		return item.replace('#','')
		});
	},
	// Show user's blog names 
	userInfo: function() {
		client.userInfo(function(err, data) {
			data.user.blogs.forEach(function(blog) {
				console.log(blog.name);
			});
		});	
	}, 

	postingArtwork: function (filePath, textMedia, tags) {
		fs.stat(filePath, function(err, stat) {
			if(err == null) {
				console.log("TUMBLR: Posting an animated gif..");
			    var params = {
			      encoding: 'base64'
			    };
			    var b64 = fs.readFileSync(filePath, params);
				var options = {
					data64: b64,
					tags: tags,
					caption: textMedia
				};
				client.createPhotoPost(currentBlogName, options, function(err, data) {
				    if (err) {
				    	console.log("TUMBLR: error " + err);
				    }
				    else {
				    	console.log("TUMBLR: Gif posted");
				    }
				});
			}
		});
	},

	randomInteraction: function() {
		var randomTag = ATUtil.randomInt(0, tags.length - 1);
		var tag = tags[randomTag];
		client.taggedPosts(tag, function(err, data) {
		    if (err) {
		    	console.log("TUMBLR: TaggedPosts error   " + err);
		    }
		    else {
		    	if(data.length > 0){
		    		var randomPost = ATUtil.randomInt(0, data.length - 1); 
            		var post_id = data[randomPost].id;
            		var reblogKey = data[randomPost].reblog_key;
            		var blogName = data[randomPost].blog_name;
            		client.likePost(post_id, reblogKey, function(error, dataNested) {
					    if (error) {
					    	console.log("TUMBLR: Liking a post error  " + error);
					    }
					    else {
					    	console.log("TUMBLR: Liking the post " + post_id);
					    }
					});
					//Reblog a post
            		var options = {
            			id : post_id,
            			reblog_key: reblogKey
            		};
					client.reblogPost(currentBlogName, options, function(error, dataNested) {
					    if (error) {
					    	console.log("TUMBLR: Rebloging error  " + error);
					    }
					    else {
					    	console.log("TUMBLR: Rebloging the post " + post_id);
					    }
					});
					
					// Get information about a given blog
					client.blogInfo(blogName, function(error, dataNested) {
					    if (error) {
					    	console.log("TUMBLR: Getting Blog Info error  " + error);
					    }
					    else {
					    	//Follow a blog
					    	client.followBlog(dataNested.blog.url, function(errorNested, dataNestedNested) {
							    if (errorNested) {
							    	console.log("TUMBLR: Following a blog error  " + errorNested);
							    }
							    else {
							    	console.log("TUMBLR: Following the blog " + blogName);
							    }
							});
					    }
					});
					//How to follow a user??
		    	}
		    }
		});
	}
};