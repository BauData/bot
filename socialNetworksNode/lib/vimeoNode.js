// vimeoNode.js
// ========
var ATUtil = require('atutil');
var fs = require('fs');
var Vimeo = require('vimeo').Vimeo;
var lib;
var textComment;
var channelToSpam;

var self = module.exports = {
  setup: function (config) {
    lib = new Vimeo(config.vimeo.CLIENT_ID, config.vimeo.CLIENT_SECRET, config.vimeo.ACCESS_TOKEN);
    textComment = config.vimeo.comment;
    channelToSpam = config.vimeo.channel;
  },

  postingArtwork: function (filePath, textName, textDescription) {
  	fs.stat(filePath, function(err, stat) {
  		if(err == null) {
  			console.log("VIMEO: Posting a video..");
  			lib.streamingUpload(filePath,  function (error, body, status_code, headers) {
  			    if (!error) {
              lib.request(headers.location, function (error, body, status_code, headers) {
                console.log("VIMEO: Video posted");
                var video_id = body.uri.split('/')[2];
                lib.request({
                    method : 'PATCH',
                    path : '/videos/' + video_id,
                    query : {
                        description : textDescription,
                        name : textName
                    }
                }, function (error, body, status_code, headers) {
                    if (error) {
                        console.log('VIMEO: error');
                        console.log(error);
                    }
                }); 
              });
  			    }
  		}, function (upload_size, file_size) {
  			    //console.log("You have uploaded " + Math.round((uploaded_size/file_size) * 100) + "% of the video");
  		});
  	 }
    });
  },

  randomInteraction: function() {
  	lib.request({
        // This is the path for the videos contained within the staff picks channels
        path : channelToSpam,
        // This adds the parameters to request page number and  items per page
        query : {
            page : 1,
            per_page : 100
        }
    }, function (error, body, status_code, headers) {
        if (error) {
            console.log('VIMEO: error');
            console.log(error);
        } 
        else {
          if(body.data.length > 0) { 
            var randomUser = ATUtil.randomInt(0, body.data.length - 1); 
            var user_id = body.data[randomUser].user.uri.split('/')[2];
            
            //add as follower
            lib.request({
                method: 'PUT',
                path : '/me/following/' + user_id
            }, function (error, body, status_code, headers) {
                if (error) {
                    console.log('VIMEO: error');
                    console.log(error);
                }
                else {
                  console.log('VIMEO: Following user ' + user_id);
                }
            });
            //GET USERS' GROUPS
            lib.request({
                method: 'GET',
                path : '/users/' + user_id + '/groups'
            }, function (error, body, status_code, headers) {
                if (error) {
                  console.log('VIMEO: error getting groups');
                  console.log(error);
                }
                else {
                  if(body.data.length > 0) { 
                    var randomGroup = ATUtil.randomInt(0, body.data.length - 1);
                    var group_id = body.data[randomGroup].uri.split('/')[2];
                    //ADD THE GROUPS
                    lib.request({
                        method: 'PUT',
                        path : '/me/groups/' + group_id
                    }, function (error, body, status_code, headers) {
                        if (error) {
                            console.log('VIMEO: error adding group');
                            console.log(error);
                        }
                        else {
                          console.log('VIMEO: Adding group ' + group_id);
                        }
                    });
                  }
                } 
            });
            //GET USERS' CHANNELS
            lib.request({
                method: 'GET',
                path : '/users/' + user_id + '/channels'
            }, function (error, body, status_code, headers) {
                if (error) {
                    console.log('VIMEO: error getting channels');
                    console.log(error);
                }
                else {
                  if(body.data.length > 0) { 
                    var randomChannel = ATUtil.randomInt(0, body.data.length - 1);
                    var channel_id = body.data[randomChannel].uri.split('/')[2];
                    //ADD THE CHANNEL
                    lib.request({
                        method: 'PUT',
                        path : '/me/channels/' + channel_id
                    }, function (error, body, status_code, headers) {
                        if (error) {
                            console.log('VIMEO: error adding channel');
                            console.log(error);
                        }
                        else {
                          console.log('VIMEO: Adding channel ' + channel_id);
                        }
                    });
                  }
                } 
            });
            //GET USERS' VIDEOS
            lib.request({
                method: 'GET',
                path : '/users/' + user_id + '/videos'
            }, function (error, body, status_code, headers) {
                if (error) {
                    console.log('VIMEO: error getting videos');
                    console.log(error);
                } 
                else {
                  if(body.data.length > 0) { 
                    var randomVideo = ATUtil.randomInt(0, body.data.length - 1);
                    var video_id = body.data[randomVideo].uri.split('/')[2];
                    //ADD VIDEO
                    lib.request({
                        method: 'PUT',
                        path : '/me/likes/' + video_id
                    }, function (error, body, status_code, headers) {
                        if (error) {
                            console.log('VIMEO: error liking a video');
                            console.log(error);
                        }
                        else {
                          console.log('VIMEO: Adding a like to video ' + video_id);
                        }
                    });
                    //POST VIDEO COMMENT
                    lib.request({
                        method: 'POST',
                        path: '/videos/' + video_id + '/comments',
                        query : {
                          type: "streaming",
                          text : textComment
                        } 
                    }, function (error, body, status_code, headers) {
                        if (error) {
                            console.log('VIMEO: error posting a video comment');
                            console.log(error);
                        }
                        else {
                          console.log('VIMEO: Adding a comment to video ' + video_id);
                        }
                    });  
                  }  
                }
            });
          }  
        }
    });
  }
};