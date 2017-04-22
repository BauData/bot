// weatherMapping.js
// ========
'use strict';
var ATUtil = require('atutil');

var weatherMapping = function () {};

weatherMapping.prototype.mapWeatherCode = function(code, temp) {
    var lightness;
    var tempMax = 35;
    var tempMin = 0;
    var tempDelta = 50;
    temp = Math.floor(temp);
    temp = Math.floor(ATUtil.clamp(temp, tempMin, tempMax));
    temp = Math.floor(ATUtil.map(temp, tempMin, tempMax, 345, 0));
    var ColorA = temp;
    var ColorB = ATUtil.randomInt(0, 360);
    lightness = ATUtil.randomInt(40, 100);
    ColorB = "hsl(" + ColorB + ", 100%, " + lightness + "%)";
    switch (code) {
        //Thunderstorm
        //light rain
        case 200:
            lightness = ATUtil.randomInt(60, 80);
        break;
        //rain
        case 201:
            lightness = ATUtil.randomInt(50, 70);
        break;
        //heavy rain 
        case 202:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //light thunderstorm
        case 210:
            lightness = ATUtil.randomInt(40, 55);
        break;
        //thunderstorm
        case 211:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //heavy thunderstorm
        case 212:
            lightness = ATUtil.randomInt(35, 50);
        break;
        //ragged thunderstorm 
        case 221:
            lightness = ATUtil.randomInt(35, 50);
        break;
        //light drizzle
        case 230:
            lightness = ATUtil.randomInt(60, 80);
        break;
        //drizzle 
        case 231:
            lightness = ATUtil.randomInt(50, 70);
        break;
        //heavy drizzle 
        case 232:
            lightness = ATUtil.randomInt(40, 60);
        break;

        //Drizzle
        //light intensity drizzle 
        case 300:
            lightness = ATUtil.randomInt(60, 80);
        break;
        // drizzle 
        case 301:
            lightness = ATUtil.randomInt(60, 70);
        break;
        //  heavy intensity drizzle 
        case 302:
            lightness = ATUtil.randomInt(50, 70);
        break;
        // light intensity drizzle rain 
        case 310:
            lightness = ATUtil.randomInt(60, 90);
        break;
        //  drizzle rain 
        case 311:
            lightness = ATUtil.randomInt(40, 70);
        break;
        // heavy intensity drizzle rain 
        case 312:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //  shower rain and drizzle 
        case 313:
            lightness = ATUtil.randomInt(40, 55);
        break;
        //  heavy shower rain and drizzle 
        case 314:
            lightness = ATUtil.randomInt(40, 50);
        break;
        // shower drizzle 
        case 321:
            lightness = ATUtil.randomInt(40, 50);
        break;

        //RAIN
        //  light rain  
        case 500:
            lightness = ATUtil.randomInt(60, 90);
        break;
        //  moderate rain  
        case 501:
            lightness = ATUtil.randomInt(50, 80);
        break;
        //  heavy intensity rain  
        case 502:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //  very heavy rain  
        case 503:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  extreme rain  
        case 504:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  freezing rain  
        case 511:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  light intensity shower rain  
        case 520:
            lightness = ATUtil.randomInt(50, 60);
        break;
        //  shower rain  
        case 521:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  heavy intensity shower rain  
        case 522:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  ragged shower rain  
        case 531:
            lightness = ATUtil.randomInt(40, 60);
        break;

        //SNOW
        //  light snow  
        case 600:
            lightness = ATUtil.randomInt(80, 95);
        break;
        //  snow  
        case 601:
            lightness = ATUtil.randomInt(70, 95);
        break;
        //  heavy snow  
        case 602:
            lightness = ATUtil.randomInt(80, 100);
        break;
        //  sleet  
        case 611:
            lightness = ATUtil.randomInt(80, 100);
        break;
        //  shower sleet  
        case 612:
            lightness = ATUtil.randomInt(80, 100);
        break;
        //  light rain and snow  
        case 615:
            lightness = ATUtil.randomInt(60, 80);
        break;
        //  rain and snow  
        case 616:
            lightness = ATUtil.randomInt(50, 80);
        break;
        //  light shower snow  
        case 620:
            lightness = ATUtil.randomInt(60, 80);
        break;
        //  shower snow  
        case 621:
            lightness = ATUtil.randomInt(50, 80);
        break;
        //  heavy shower snow  
        case 622:
            lightness = ATUtil.randomInt(60, 80);
        break;

        //ATMOSPHERE
        //  mist  
        case 701:
            lightness = ATUtil.randomInt(40, 100);
        break;
        //  smoke  
        case 711:
            lightness = ATUtil.randomInt(40, 70);
        break;
        //  haze  
        case 721:
            lightness = ATUtil.randomInt(70, 100);
        break;
        //  sand, dust whirls  
        case 731:
            lightness = ATUtil.randomInt(80, 100);
        break;
        //  fog  
        case 741:
            lightness = ATUtil.randomInt(85, 100);
        break;
        //  sand  
        case 751:
            lightness = ATUtil.randomInt(90, 100);
        break;
        //  dust  
        case 761:
            lightness = ATUtil.randomInt(80, 100);
        break;
        //  volcanic ash  
        case 762:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //  squalls  
        case 771:
            lightness = ATUtil.randomInt(40, 100);
        break;
        //  tornado  
        case 781:
            lightness = ATUtil.randomInt(40, 60);
        break;

        // CLEAR
        //  clear sky  
        case 800:
            lightness = ATUtil.randomInt(60, 100);
        break;

        // CLOUDS
        //  few clouds  
        case 801:
            lightness = ATUtil.randomInt(50, 90);
        break;
        //  scattered clouds 
        case 802:
            lightness = ATUtil.randomInt(50, 80);
        break;
        // broken clouds 
        case 803:
            lightness = ATUtil.randomInt(40, 70);
        break;
        //  overcast clouds 
        case 804:
            lightness = ATUtil.randomInt(40, 60);
        break;

        // EXTREME
        //  tornado  
        case 900:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //  tropical storm  
        case 901:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //  hurricane  
        case 902:
            lightness = ATUtil.randomInt(40, 65);
        break;
        //  cold  
        case 903:
            lightness = ATUtil.randomInt(40, 100);
        break;
        //  hot  
        case 904:
            lightness = ATUtil.randomInt(70, 100);
        break;
        //  windy  
        case 905:
            lightness = ATUtil.randomInt(40, 100);
        break;
        //  hail  
        case 906:
            lightness = ATUtil.randomInt(40, 100);
        break;

        //ADDITIONAL
        //   calm   
        case 951:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   light breeze   
        case 952:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   gentle breeze   
        case 953:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   moderate breeze   
        case 954:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   fresh breeze   
        case 955:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   strong breeze   
        case 956:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   high wind, near gale   
        case 957:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   gale   
        case 958:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   severe gale   
        case 959:
            lightness = ATUtil.randomInt(40, 80);
        break;
        //   storm   
        case 960:
            lightness = ATUtil.randomInt(40, 60);
        break;
        //   violent storm   
        case 961:
            lightness = ATUtil.randomInt(40, 50);
        break;
        //   hurricane   
        case 962:
            lightness = ATUtil.randomInt(40, 60);
        break;

        default:
            lightness = ATUtil.randomInt(40, 100);
        break;
    }
    ColorA = "hsl(" + ColorA + ", 100%, " + lightness + "%)";
    return {
        colorA: ColorA,
        colorB: ColorB
    }
};

module.exports = new weatherMapping();