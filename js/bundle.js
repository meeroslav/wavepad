!function e(t,i,s){function n(a,r){if(!i[a]){if(!t[a]){var u="function"==typeof require&&require;if(!r&&u)return u(a,!0);if(o)return o(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var c=i[a]={exports:{}};t[a][0].call(c.exports,function(e){var i=t[a][1][e];return n(i?i:e)},c,c.exports,e,t,i,s)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;a<s.length;a++)n(s[a]);return n}({1:[function(e,t,i){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}var n=e("./wavepad"),o=s(n),a=e("./sw-bootstrap"),r=s(a);window.addEventListener("DOMContentLoaded",function(){var e=new o["default"]("wave-pd1");e.init(),(0,r["default"])()})},{"./sw-bootstrap":2,"./wavepad":3}],2:[function(e,t,i){"use strict";function s(){function e(e){console.log("Service Worker: installing..."),e.addEventListener("statechange",function(){"installed"===e.state?t():"activated"===e.state&&console.log("Service Worker: activated")})}function t(){console.log("Service Worker: installed")}navigator.serviceWorker&&navigator.serviceWorker.register("sw.js",{scope:"./"}).then(function(i){return console.log("Service Worker: registered"),navigator.serviceWorker.controller?i.waiting?void t():i.installing?void e(i.installing):void i.addEventListener("updatefound",function(){e(i.installing)}):void 0})["catch"](function(e){console.log("Service Worker: registration failed ",e)})}Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=s},{}],3:[function(e,t,i){"use strict";function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},o=function(){function e(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}}();Object.defineProperty(i,"__esModule",{value:!0});var a=function(){function e(t,i){if(s(this,e),this.options={waveform:"square",filter:"lowpass",delay:.5,feedback:.4,barColor:"#1d1c25"},"object"===("undefined"==typeof i?"undefined":n(i)))for(var o in i)i.hasOwnProperty(o)&&(this.options[o]=i[o]);if(this.source=null,this.nodes={},this.myAudioContext=null,this.myAudioAnalyser=null,window.AudioContext=window.AudioContext||window.webkitAudioContext,!("AudioContext"in window))throw new Error("wavepad.js: browser does not support Web Audio API");if(this.myAudioContext=new window.AudioContext,"string"!=typeof t&&"object"!==("undefined"==typeof t?"undefined":n(t)))throw new Error("wavepad.js: first argument must be a valid DOM identifier");this.synth="object"===("undefined"==typeof t?"undefined":n(t))?t:document.getElementById(t),this.surface=this.synth.querySelector(".surface"),this.finger=this.synth.querySelector(".finger"),this.waveform=this.synth.querySelector("#waveform"),this.filter=this.synth.querySelector("#filter-type"),this.powerToggle=this.synth.querySelector("#power"),this.delayTimeInput=this.synth.querySelector("#delay"),this.feedbackGainInput=this.synth.querySelector("#feedback"),this.delayTimeOutput=this.synth.querySelector("#delay-output"),this.feedbackGainOutput=this.synth.querySelector("#feedback-output"),this.canvas=this.synth.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.hasTouch=!1,this.isSmallViewport=!1,this.isPlaying=!1}return o(e,[{key:"init",value:function(){this.handleResize(),this.startHandler=this.start.bind(this),this.moveHandler=this.move.bind(this),this.stopHandler=this.stop.bind(this),this.delayTimeInput.value=this.options.delay,this.feedbackGainInput.value=this.options.feedback,this.waveform.value=this.options.waveform,this.filter.value=this.options.filter,this.updateOutputs(),this.powerToggle.addEventListener("click",this.togglePower.bind(this)),this.waveform.addEventListener("change",this.setWaveform.bind(this)),this.filter.addEventListener("change",this.filterChange.bind(this)),this.delayTimeInput.addEventListener("input",this.delayChange.bind(this)),this.feedbackGainInput.addEventListener("input",this.feedbackChange.bind(this)),this.nodes.oscVolume=this.myAudioContext.createGain(),this.nodes.filter=this.myAudioContext.createBiquadFilter(),this.nodes.volume=this.myAudioContext.createGain(),this.nodes.delay=this.myAudioContext.createDelay(),this.nodes.feedbackGain=this.myAudioContext.createGain(),this.nodes.compressor=this.myAudioContext.createDynamicsCompressor(),this.myAudioAnalyser=this.myAudioContext.createAnalyser(),this.myAudioAnalyser.smoothingTimeConstant=.85,this.animateSpectrum(),this.surface.addEventListener("touchmove",function(e){e.preventDefault()})}},{key:"handleResize",value:function(){var e=this,t=window.matchMedia("(max-width: 512px)");this.isSmallViewport=t.matches?!0:!1,this.setCanvasSize(),t.addListener(function(t){e.isSmallViewport=t.matches?!0:!1,e.setCanvasSize()})}},{key:"routeSounds",value:function(){this.source=this.myAudioContext.createOscillator(),this.setWaveform(this.waveform),this.filterChange(this.filter),this.nodes.feedbackGain.gain.value=this.options.feedback,this.nodes.delay.delayTime.value=this.options.delay,this.nodes.volume.gain.value=.2,this.nodes.oscVolume.gain.value=0,this.source.connect(this.nodes.oscVolume),this.nodes.oscVolume.connect(this.nodes.filter),this.nodes.filter.connect(this.nodes.compressor),this.nodes.filter.connect(this.nodes.delay),this.nodes.delay.connect(this.nodes.feedbackGain),this.nodes.delay.connect(this.nodes.compressor),this.nodes.feedbackGain.connect(this.nodes.delay),this.nodes.compressor.connect(this.nodes.volume),this.nodes.volume.connect(this.myAudioAnalyser),this.myAudioAnalyser.connect(this.myAudioContext.destination)}},{key:"startOsc",value:function(){this.source.start(0),this.isPlaying=!0}},{key:"stopOsc",value:function(){this.source.stop(0),this.isPlaying=!1}},{key:"bindSurfaceEvents",value:function(){this.surface.addEventListener("mousedown",this.startHandler),this.surface.addEventListener("touchstart",this.startHandler)}},{key:"unbindSurfaceEvents",value:function(){this.surface.removeEventListener("mousedown",this.startHandler),this.surface.removeEventListener("touchstart",this.startHandler)}},{key:"togglePower",value:function(){this.isPlaying?(this.stopOsc(),this.myAudioAnalyser.disconnect(),this.unbindSurfaceEvents()):(this.routeSounds(),this.startOsc(),this.bindSurfaceEvents()),this.synth.classList.toggle("off")}},{key:"start",value:function(e){var t="touchstart"===e.type?e.touches[0].pageX:e.pageX,i="touchstart"===e.type?e.touches[0].pageY:e.pageY,s=this.isSmallViewport?2:1;if("touchstart"===e.type)this.hasTouch=!0;else if("mousedown"===e.type&&this.hasTouch)return;this.isPlaying||(this.routeSounds(),this.startOsc()),t-=this.surface.offsetLeft,i-=this.surface.offsetTop,this.nodes.oscVolume.gain.value=1,this.source.frequency.value=t*s,this.nodes.filter.frequency.value=this.setFilterFrequency(i),this.finger.style.webkitTransform=this.finger.style.transform="translate3d("+t+"px, "+i+"px, 0)",this.finger.classList.add("active"),this.surface.addEventListener("touchmove",this.moveHandler),this.surface.addEventListener("touchend",this.stopHandler),this.surface.addEventListener("touchcancel",this.stopHandler),this.surface.addEventListener("mousemove",this.moveHandler),this.surface.addEventListener("mouseup",this.stopHandler)}},{key:"move",value:function(e){var t="touchmove"===e.type?e.touches[0].pageX:e.pageX,i="touchmove"===e.type?e.touches[0].pageY:e.pageY;if("mousemove"!==e.type||!this.hasTouch){if(this.isPlaying){var s=this.isSmallViewport?2:1;t-=this.surface.offsetLeft,i-=this.surface.offsetTop,this.source.frequency.value=t*s,this.nodes.filter.frequency.value=this.setFilterFrequency(i)}this.finger.style.webkitTransform=this.finger.style.transform="translate3d("+t+"px, "+i+"px, 0)"}}},{key:"stop",value:function(e){var t="touchend"===e.type?e.changedTouches[0].pageX:e.pageX,i="touchend"===e.type?e.changedTouches[0].pageY:e.pageY;if(this.isPlaying){var s=this.isSmallViewport?2:1;t-=this.surface.offsetLeft,i-=this.surface.offsetTop,this.source.frequency.value=t*s,this.nodes.filter.frequency.value=this.setFilterFrequency(i),this.nodes.oscVolume.gain.value=0}this.finger.classList.remove("active"),this.surface.removeEventListener("mousemove",this.moveHandler),this.surface.removeEventListener("mouseup",this.stopHandler),this.surface.removeEventListener("touchmove",this.moveHandler),this.surface.removeEventListener("touchend",this.stopHandler),this.surface.removeEventListener("touchcancel",this.stopHandler)}},{key:"updateOutputs",value:function(){this.delayTimeOutput.value=Math.round(1e3*this.delayTimeInput.value)+" ms",this.feedbackGainOutput.value=Math.round(10*this.feedbackGainInput.value)}},{key:"setWaveform",value:function(e){this.source.type=e.value||e.target.value}},{key:"delayChange",value:function(e){this.options.delay=e.target.value,this.isPlaying&&(this.stopOsc(),this.nodes.delay.delayTime.value=this.options.delay),this.updateOutputs()}},{key:"feedbackChange",value:function(e){this.options.feedback=e.target.value,this.isPlaying&&(this.stopOsc(),this.nodes.feedbackGain.gain.value=this.options.feedback),this.updateOutputs()}},{key:"setFilterFrequency",value:function(e){var t=40,i=this.myAudioContext.sampleRate/2,s=Math.log(i/t)/Math.LN2,n=Math.pow(2,s*(2/this.surface.clientHeight*(this.surface.clientHeight-e)-1));return i*n}},{key:"filterChange",value:function(e){this.nodes.filter.type=e.value||e.target.value}},{key:"animateSpectrum",value:function(){setTimeout(this.onTick.bind(this),25)}},{key:"onTick",value:function(){this.drawSpectrum(),requestAnimationFrame(this.animateSpectrum.bind(this))}},{key:"setCanvasSize",value:function(){var e=this.isSmallViewport?256:512;this.canvas.width=this.canvas.height=e-10,this.ctx.fillStyle=this.options.barColor}},{key:"drawSpectrum",value:function(){var e=this.isSmallViewport?256:512,t=this.isSmallViewport?10:20,i=Math.round(e/t),s=new Uint8Array(this.myAudioAnalyser.frequencyBinCount);this.myAudioAnalyser.getByteFrequencyData(s),this.ctx.clearRect(0,0,e,e);for(var n=0;i>n;n+=1){var o=s[n],a=this.isSmallViewport?1:2;this.ctx.fillRect(t*n,e,t-1,-o*a)}}}]),e}();i["default"]=a},{}]},{},[1]);