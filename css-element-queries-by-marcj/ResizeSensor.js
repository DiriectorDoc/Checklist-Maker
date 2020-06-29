!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ResizeSensor=t()}("undefined"!=typeof window?window:this,function(){if("undefined"==typeof window)return null;var e="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),t=e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||function(t){return e.setTimeout(t,20)},n=e.cancelAnimationFrame||e.mozCancelAnimationFrame||e.webkitCancelAnimationFrame||function(t){e.clearTimeout(t)};function i(e,t){var n=Object.prototype.toString.call(e),i="[object Array]"===n||"[object NodeList]"===n||"[object HTMLCollection]"===n||"[object Object]"===n||"undefined"!=typeof jQuery&&e instanceof jQuery||"undefined"!=typeof Elements&&e instanceof Elements,o=0,r=e.length;if(i)for(;o<r;o++)t(e[o]);else t(e)}function o(e){if(!e.getBoundingClientRect)return{width:e.offsetWidth,height:e.offsetHeight};var t=e.getBoundingClientRect();return{width:Math.round(t.width),height:Math.round(t.height)}}function r(e,t){Object.keys(t).forEach(function(n){e.style[n]=t[n]})}var s=function(e,d){var a=0;function c(e,n){if(e)if(e.resizedAttached)e.resizedAttached.add(n);else{e.resizedAttached=new function(){var e,t,n=[];this.add=function(e){n.push(e)},this.call=function(i){for(e=0,t=n.length;e<t;e++)n[e].call(this,i)},this.remove=function(i){var o=[];for(e=0,t=n.length;e<t;e++)n[e]!==i&&o.push(n[e]);n=o},this.length=function(){return n.length}},e.resizedAttached.add(n),e.resizeSensor=document.createElement("div"),e.resizeSensor.dir="ltr",e.resizeSensor.className="resize-sensor";var i={pointerEvents:"none",position:"absolute",left:"0px",top:"0px",right:"0px",bottom:"0px",overflow:"hidden",zIndex:"-1",visibility:"hidden",maxWidth:"100%"},s={position:"absolute",left:"0px",top:"0px",transition:"0s"};r(e.resizeSensor,i);var d=document.createElement("div");d.className="resize-sensor-expand",r(d,i);var c=document.createElement("div");r(c,s),d.appendChild(c);var f=document.createElement("div");f.className="resize-sensor-shrink",r(f,i);var h=document.createElement("div");r(h,s),r(h,{width:"200%",height:"200%"}),f.appendChild(h),e.resizeSensor.appendChild(d),e.resizeSensor.appendChild(f),e.appendChild(e.resizeSensor);var l=window.getComputedStyle(e),u=l?l.getPropertyValue("position"):null;"absolute"!==u&&"relative"!==u&&"fixed"!==u&&"sticky"!==u&&(e.style.position="relative");var p=!1,m=0,v=o(e),z=0,w=0,g=!0;a=0;var y=function(){if(g){if(0===e.offsetWidth&&0===e.offsetHeight)return void(a||(a=t(function(){a=0,y()})));g=!1}var n,i;n=e.offsetWidth,i=e.offsetHeight,c.style.width=n+10+"px",c.style.height=i+10+"px",d.scrollLeft=n+10,d.scrollTop=i+10,f.scrollLeft=n+10,f.scrollTop=i+10};e.resizeSensor.resetSensor=y;var S=function(){m=0,p&&(z=v.width,w=v.height,e.resizedAttached&&e.resizedAttached.call(v))},b=function(){v=o(e),(p=v.width!==z||v.height!==w)&&!m&&(m=t(S)),y()},A=function(e,t,n){e.attachEvent?e.attachEvent("on"+t,n):e.addEventListener(t,n)};A(d,"scroll",b),A(f,"scroll",b),a=t(function(){a=0,y()})}}i(e,function(e){c(e,d)}),this.detach=function(t){a&&(n(a),a=0),s.detach(e,t)},this.reset=function(){e.resizeSensor.resetSensor&&e.resizeSensor.resetSensor()}};if(s.reset=function(e){i(e,function(t){e.resizeSensor.resetSensor&&t.resizeSensor.resetSensor()})},s.detach=function(e,t){i(e,function(e){e&&(e.resizedAttached&&"function"==typeof t&&(e.resizedAttached.remove(t),e.resizedAttached.length())||e.resizeSensor&&(e.contains(e.resizeSensor)&&e.removeChild(e.resizeSensor),delete e.resizeSensor,delete e.resizedAttached))})},"undefined"!=typeof MutationObserver){var d=new MutationObserver(function(e){for(var t in e)if(e.hasOwnProperty(t))for(var n=e[t].addedNodes,i=0;i<n.length;i++)n[i].resizeSensor&&s.reset(n[i])});document.addEventListener("DOMContentLoaded",function(e){d.observe(document.body,{childList:!0,subtree:!0})})}return s});