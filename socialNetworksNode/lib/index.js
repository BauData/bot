"use strict";

var twitterNode;
var instagramNode;
var vimeoNode;
var tumblrNode;
var youtubeNode;
var flickrNode;
var intervalId = 0;
var tags;

var socialNetworksNode = function() {

    function setup(config) {
        console.log("Social networks settings");
        
        tags = config.tags;
        reset();

        if(config.instagram) {
            instagramNode = require('./instagramNode');
            instagramNode.setup(config.instagram, tags);
        }
        if(config.twitter) {
            twitterNode = require('./twitterNode');
            twitterNode.setup(config.twitter, tags);
        }
        if(config.vimeo) {
            vimeoNode = require('./vimeoNode');
            vimeoNode.setup(config.vimeo);
        }
        if(config.tumblr) {
            tumblrNode = require('./tumblrNode');
            tumblrNode.setup(config.tumblr, tags);
        }
        if(config.youtube) {
            youtubeNode = require('./youtubeNode');
            youtubeNode.setup(config.youtube);
        }
        if(config.flickr) {
            flickrNode = require('./flickrNode');
            flickrNode.setup(config.flickr, tags);
        }
    }

    function posting(customTags, text, fileObject) {
        console.log("Posting on social networks");
        customTags = tags.concat(customTags);
        var fullTextToPost = customTags.join(" ") + " " + text;
        var shortTextToPost = customTags.join(" ").substring(0, 140);
        var tagsComma = customTags.join(", ");
        var title = customTags.join(" ").replace(/#/g," ").substring(0, 128);
        var lat = customTags[customTags.length - 4].replace(/#/g,"");
        var lon = customTags[customTags.length - 3].replace(/#/g,"");
        if(twitterNode) {
            twitterNode.postingArtwork(fileObject.videoFile, shortTextToPost);
        }
        if(instagramNode) {
            instagramNode.postingArtwork(fileObject.noiseVideoFile, fileObject.imgCover, fullTextToPost);
        }
        if(vimeoNode) {
            //VIMEO accepts 5000 chars max
            vimeoNode.postingArtwork(fileObject.videoFile, title, text.substring(0, 5000));
        }
        if(tumblrNode) {
            tumblrNode.postingArtwork(fileObject.gifLossyFile, text, tagsComma);
        }
        if(youtubeNode) {
            youtubeNode.postingArtwork(fileObject.videoFile, text, title);
        }
        if(flickrNode) {
            flickrNode.postingArtwork(fileObject.imgCover, text, title, lat, lon);
        }
    }

    function postingPhoto(customTags, text, file) {
        console.log("Posting on social networks");
        customTags = tags.concat(customTags);
        var fullTextToPost = customTags.join(" ") + " " + text;
        var shortTextToPost = customTags.join(" ").substring(0, 140);
        var tagsComma = customTags.join(", ");
        var title = customTags.join(" ").replace(/#/g," ");
        var lat = customTags[customTags.length - 4].replace(/#/g,"");
        var lon = customTags[customTags.length - 3].replace(/#/g,"");
        if(twitterNode) {
            twitterNode.postingPhoto(file, shortTextToPost);
        }
        if(instagramNode) {
            instagramNode.postingPhoto(file, fullTextToPost);
        }
        if(tumblrNode) {
            tumblrNode.postingArtwork(file, text, tagsComma);
        }
        if(flickrNode) {
            flickrNode.postingArtwork(file, text, title, lat, lon);
        }
    }

    function interaction(cityData, timing) {
        if(intervalId != 0) {
            clearInterval(intervalId);
            intervalId = 0;
        }
        intervalId = setInterval(interacting, timing);

        function interacting() {
            console.log("Social networks interaction");
            if(instagramNode) {
                instagramNode.randomInteraction(cityData.cityName);
            }
            if(vimeoNode) {
                vimeoNode.randomInteraction();
            }
            if(tumblrNode) {
                tumblrNode.randomInteraction();
            }
            if(flickrNode) {
                flickrNode.randomInteraction(cityData.cityLat, cityData.cityLon);
            }
        }
    }

    function reset() {
        twitterNode = null;
        instagramNode = null;
        vimeoNode = null;
        tumblrNode = null;
        youtubeNode = null;
        flickrNode = null;
    }

    return {
        setup: setup,
        posting: posting,
        postingPhoto: postingPhoto,
        interaction: interaction
    }
};

module.exports = new socialNetworksNode();