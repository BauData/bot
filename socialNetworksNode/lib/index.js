// atutil.js
// ========
"use strict";

var twitterNode;
var instagramNode;
var vimeoNode;
var tumblrNode;
var youtubeNode;
//var flickrNode;
var location;
var tags;

var socialNetworksNode = function() {

    function setup(config, customLocation, timing) {
        console.log("Accounts verification and automatic interactions on social networks");
        tags = config.tags;
        //flickrNode = require('./flickrNode');
        if(config.instagram) {
            instagramNode = require('./instagramNode');
            instagramNode.setup(config);
        }
        if(config.twitter) {
            twitterNode = require('./twitterNode');
            twitterNode.setup(config);
        }
        if(config.vimeo) {
            vimeoNode = require('./vimeoNode');
            vimeoNode.setup(config);
        }
        if(config.tumblr) {
            tumblrNode = require('./tumblrNode');
            tumblrNode.setup(config);
        }
        if(config.youtube) {
            youtubeNode = require('./youtubeNode');
            youtubeNode.setup(config);
        }
        //flickrNode.setup(config);
        location = customLocation;
        setInterval(interacting, timing);

        function interacting() {
            if(config.instagram) {
                instagramNode.randomInteraction(location);
            }
            if(config.vimeo) {
                vimeoNode.randomInteraction();
            }
            if(config.tumblr) {
                tumblrNode.randomInteraction();
            }
        }
    }

    function posting(customTags, text, fileObject) {
        console.log("Posting on social networks");
        location = customTags[0]; //the first array element is the location
        tags = tags.concat(customTags);
        var fullTextToPost = tags.join(" ") + " " + text;
        var shortTextToPost = tags.join(" ").substring(0, 140);
        var tagsComma = tags.join(", ");
        var videoTitle = customTags.join(" ").replace(/#/g," ");

        twitterNode.postingArtwork(fileObject.videoFile, shortTextToPost);
        instagramNode.postingArtwork(fileObject.noiseVideoFile, fileObject.imgVideoCover, fullTextToPost);
        vimeoNode.postingArtwork(fileObject.videoFile, videoTitle, text);
        tumblrNode.postingArtwork(fileObject.gifLossyFile, text, tagsComma);
        youtubeNode.postingArtwork(fileObject.videoFile, text, videoTitle);
    }

    function postingPhoto(customTags, text, file) {
        console.log("Posting on social networks");
        location = customTags[0]; //the first array element is the location
        tags = tags.concat(customTags);
        var fullTextToPost = tags.join(" ") + " " + text;
        var shortTextToPost = tags.join(" ").substring(0, 140);
        var tagsComma = tags.join(", ");

        twitterNode.postingPhoto(file, shortTextToPost);
        instagramNode.postingPhoto(file, fullTextToPost);
        tumblrNode.postingArtwork(file, text, tagsComma);
    }

    return {
        setup: setup,
        posting: posting,
        postingPhoto: postingPhoto
    }
};

module.exports = new socialNetworksNode();