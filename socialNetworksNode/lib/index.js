"use strict";

var twitterNode;
var instagramNode;
var vimeoNode;
var tumblrNode;
var youtubeNode;
//var flickrNode;
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
        //flickrNode = require('./flickrNode');
        //flickrNode.setup(config);
    }

    function posting(customTags, text, fileObject) {
        console.log("Posting on social networks");
        tags = tags.concat(customTags);
        var fullTextToPost = tags.join(" ") + " " + text;
        var shortTextToPost = tags.join(" ").substring(0, 140);
        var tagsComma = tags.join(", ");
        var videoTitle = customTags.join(" ").replace(/#/g," ").substring(0, 180);;
        if(twitterNode) {
            twitterNode.postingArtwork(fileObject.videoFile, shortTextToPost);
        }
        if(instagramNode) {
            instagramNode.postingArtwork(fileObject.noiseVideoFile, fileObject.imgCover, fullTextToPost);
        }
        if(vimeoNode) {
            vimeoNode.postingArtwork(fileObject.videoFile, videoTitle, text);
        }
        if(tumblrNode) {
            tumblrNode.postingArtwork(fileObject.gifLossyFile, text, tagsComma);
        }
        if(youtubeNode) {
            youtubeNode.postingArtwork(fileObject.videoFile, text, videoTitle);
        }
    }

    function postingPhoto(customTags, text, file) {
        console.log("Posting on social networks");
        tags = tags.concat(customTags);
        var fullTextToPost = tags.join(" ") + " " + text;
        var shortTextToPost = tags.join(" ").substring(0, 140);
        var tagsComma = tags.join(", ");
        if(twitterNode) {
            twitterNode.postingPhoto(file, shortTextToPost);
        }
        if(instagramNode) {
            instagramNode.postingPhoto(file, fullTextToPost);
        }
        if(tumblrNode) {
            tumblrNode.postingArtwork(file, text, tagsComma);
        }
    }

    function interaction(customLocation, timing) {
        if(intervalId != 0) {
            clearInterval(intervalId);
            intervalId = 0;
        }
        intervalId = setInterval(interacting, timing);

        function interacting() {
            console.log("Social networks interaction");
            if(instagramNode) {
                instagramNode.randomInteraction(customLocation);
            }
            if(vimeoNode) {
                vimeoNode.randomInteraction();
            }
            if(tumblrNode) {
                tumblrNode.randomInteraction();
            }
        }
    }

    function reset() {
        twitterNode = null;
        instagramNode = null;
        vimeoNode = null;
        tumblrNode = null;
        youtubeNode = null;
    }

    return {
        setup: setup,
        posting: posting,
        postingPhoto: postingPhoto,
        interaction: interaction
    }
};

module.exports = new socialNetworksNode();