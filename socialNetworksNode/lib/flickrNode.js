// flickrNode.js
// ========
var ATUtil = require('atutil');
var fs = require('fs');
var Flickr = require("flickrapi");
var Sentencer = require('sentencer');
var flickrOptions;
var userId;

var self = module.exports = {
  setup: function (config, configTags) {
    flickrOptions = config;
    userId = config.user_id;
    tags = configTags.map( function(item, index) {
        return item.replace('#', '')
    });
  },

  postingArtwork: function (filePath, textName, titleName, photoLat, photoLon) {
    fs.stat(filePath, function(err, stat) {
      if(err == null) {
        console.log("FLICKR: Posting a photo..");
        Flickr.authenticate(flickrOptions, function(error, flickr) {
          var uploadOptions = {
            photos: [{
              title: titleName,
              description: textName,
              tags: tags,
              photo: filePath,
              is_public: 1, 
              is_friend: 1, 
              is_family: 1,
              content_type: 2 
            }]
          };

          Flickr.upload(uploadOptions, flickrOptions, function(err, result) {
            if(err) {
              console.log(error);
            }
            else {
              flickr.photos.geo.setLocation({photo_id: result, lat: photoLat, lon: photoLon, accuracy: '11'}, function(err,res) {
                if(err) { 
                  console.log("FLICKR error: ", err); 
                }
                else {
                  console.log("FLICKR: photo posted");
                }
              });
            }
          });
        });
      }
    });
  },

  randomInteraction: function(cityLat, cityLon) {
    Flickr.authenticate(flickrOptions, function(error, flickr) {
      var randomTag = ATUtil.randomInt(0, tags.length - 1);
      var tag = tags[randomTag];
      flickr.photos.search({ tags: tag }, function(err,result) {
        if(err) {  
          console.log("FLICKR error: ", err); 
        }
        else {
          if(result.photos.photo.length > 0) { 
            var randomPhoto = ATUtil.randomInt(0, result.photos.photo.length - 1); 
            var photoId = result.photos.photo[randomPhoto].id;
              
            flickr.favorites.add({photo_id: photoId}, function(err,result) {
              if(err) { 
                console.log("FLICKR error: ", err); 
              }
              else {
                console.log("FLICKR: added to favorite " + photoId);
              }
            });
          }
        }
      });
      var groupName = Sentencer.make("{{ nouns }}");
      flickr.groups.search({ text:  groupName}, function(err,result) {
        if(err) {  
          console.log("FLICKR error: ", err); 
        }
        else {
          if(result.groups.group.length > 0) {
            var randomGroup = ATUtil.randomInt(0, result.groups.group.length - 1);
            var groupId = result.groups.group[randomGroup].nsid;
            flickr.groups.join({group_id: groupId, accept_rules: true}, function(err,result) {
                  if(err) { 
                    console.log("FLICKR error: ", err); 
                  }
                  else {
                    flickr.people.getPhotos({user_id: userId}, function(err,res) {
                      if(err) { 
                        console.log("FLICKR error user: ", err); 
                      }
                      else {
                        if(res.photos.photo.length > 0) {
                          var randomPho = ATUtil.randomInt(0, res.photos.photo.length - 1);
                          var photoId = res.photos.photo[randomPho].id;
                          flickr.groups.pools.add({photo_id: photoId, group_id: groupId}, function(err,res) {
                            if(err) { 
                              console.log("FLICKR error: ", err); 
                            }
                            else {
                              console.log("FLICKR photo added to the group: " + groupId); 
                            }
                          });
                        }
                      }
                    });

                    flickr.groups.pools.getPhotos({group_id: groupId}, function(err,res) {
                      if(err) { 
                        console.log("FLICKR error: ", err); 
                      }
                      else {
                        if(res.photos.photo.length > 0){
                          var randomPhoto = ATUtil.randomInt(0, res.photos.photo.length - 1);
                          var photoId = res.photos.photo[randomPhoto].id;
                          var comment = Sentencer.make("{{ adjective }}");
                          flickr.photos.comments.addComment({photo_id: photoId, comment_text: comment}, function(err,res) {
                            if(err) { 
                              console.log("FLICKR error: ", err); 
                            }
                            else {
                              console.log('FLICKR comment ' + comment + ' posted to ' + photoId);
                            }
                          });
                        }
                      }
                    });
                  }
              });
            } 
          }
      });
      flickr.photos.search({ lat:  cityLat, lon: cityLon, accuracy: '11'}, function(err, result) {
          if(err) {  
              console.log("FLICKR error: ", err); 
          }
          else {
            if(result.photos.photo.length > 0){
                var randomPhoto = ATUtil.randomInt(0, result.photos.photo.length - 1);
                var photoId = result.photos.photo[randomPhoto].id;
                var comment = Sentencer.make("{{ adjective }}");
                flickr.photos.comments.addComment({photo_id: photoId, comment_text: comment}, function(err,res) {
                  if(err) { 
                    console.log("FLICKR error: ", err); 
                  }
                  else {
                    console.log('FLICKR location comment ' + comment + ' posted to ' + photoId);
                  }
                });
            }
          }
      });
    });
  }

};