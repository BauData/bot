// atutil.js
// ========
"use strict";

var twitterNode;
var instagramNode;
var vimeoNode;
var tumblrNode;
//var flickrNode;
var location;
var tags;

var socialNetworksNode = function() {

    function setup(config, customLocation, timing) {
        console.log("Accounts verification and automatic interactions on social networks");
        tags = config.tags;
        twitterNode = require('./twitterNode');
        instagramNode = require('./instagramNode');
        vimeoNode = require('./vimeoNode');
        tumblrNode = require('./tumblrNode');
        //flickrNode = require('./flickrNode');

        twitterNode.setup(config); 
        vimeoNode.setup(config);
        tumblrNode.setup(config);
        instagramNode.setup(config);
        //flickrNode.setup(config);
        location = customLocation;
        setInterval(interacting, timing);

        function interacting() {
            vimeoNode.randomInteraction();
            tumblrNode.randomInteraction();
            instagramNode.randomInteraction(location);
        }
    }

    function posting(customTags, text, fileObject) {
        console.log("Posting on social networks");
        location = customTags[0]; //the first array element is the location
        tags = tags.concat(customTags);
        var fullTextToPost = tags.join(" ") + " " + text;
        var shortTextToPost = tags.join(" ").substring(0, 140);
        var tagsComma = tags.join(", ");
        var vimeoTitle = customTags.join(" ").replace(/#/g," ");

        twitterNode.postingArtwork(fileObject.videoFile, shortTextToPost);
        instagramNode.postingArtwork(fileObject.noiseVideoFile, fileObject.imgVideoCover, fullTextToPost);
        vimeoNode.postingArtwork(fileObject.videoFile, vimeoTitle, text);
        tumblrNode.postingArtwork(fileObject.gifLossyFile, text, tagsComma);
    }

    return {
        setup: setup,
        posting: posting
    }
};

module.exports = new socialNetworksNode();