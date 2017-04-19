// atutil.js
// ========
"use strict";
var fs = require('fs');

var ATUtil = function () {};

ATUtil.prototype.randomRange = function(min, max) {
  return min + Math.random() * (max - min);
};

ATUtil.prototype.randomInt = function(min,max){
	return Math.floor(min + Math.random() * (max - min + 1));
};

ATUtil.prototype.map = function(value, min1, max1, min2, max2) {
	return this.lerp(this.norm(value, min1, max1), min2, max2);
};

ATUtil.prototype.lerp = function(value, min, max) {
	return min + (max -min) * value;
};

ATUtil.prototype.norm = function(value, min, max) {
	return (value - min) / (max - min);
};

ATUtil.prototype.clamp = function(value, min, max) {
	 	return Math.min(Math.max(value, min), max);
};

ATUtil.prototype.shuffle = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

ATUtil.prototype.randomVector3 = function(range) {
	return new THREE.Vector3(this.randomRange(-range,range), this.randomRange(-range,range), this.randomRange(-range,range));
};

ATUtil.prototype.randomPointOnParticles = function(r) {
    var angle = Math.random() * Math.PI * 2;
    var u = Math.random() * 2 - 1;  
    var v = new THREE.Vector3(
        Math.cos(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
        Math.sin(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
        u * r
    );
    return v;
};

ATUtil.prototype.float32Concat = function(first, second) {
    var firstLength = first.length;
    var result = new Float32Array(firstLength + second.length);
    result.set(first);
    result.set(second, firstLength);
    return result;
};

ATUtil.prototype.pad = function(n, length) {
  	var len = length - (''+n).length;
  	return (len > 0 ? new Array(++len).join('0') : '') + n;
};

ATUtil.prototype.rmDir = function (dirPath) {
	try { var files = fs.readdirSync(dirPath); }
  	catch(e) { return; }
  	if (files.length > 0)
    	for (var i = 0; i < files.length; i++) {
      		var filePath = dirPath + '/' + files[i];
      		if (fs.statSync(filePath).isFile())
        		fs.unlinkSync(filePath);
      		else
        		this.rmDir(filePath);
   		}
	//fs.rmdirSync(dirPath);
};

ATUtil.prototype.timenow =  function () {
    var now = new Date(), 
    ampm = 'am', 
    h = now.getHours(), 
    m = now.getMinutes(), 
    s = now.getSeconds();
    if(h >= 12){
        if(h > 12) h -= 12;
        ampm = 'pm';
    }
    if(m < 10) m = '0'+m;
    if(s < 10) s = '0'+s;
    return now.toLocaleDateString()+ ' ' + h + ':' + m + ':' + s + ' ' + ampm;
};

  //Syncr: check if file exists
ATUtil.prototype.checkExist = function(file) {
    try {
      var stats = fs.statSync(file);
      console.log(file + ' exists. Deleting it');
      fs.unlinkSync(file);
    }
    catch(err) {
      console.log(file + ' does not exist');
    }
};

module.exports = new ATUtil();