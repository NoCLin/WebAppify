// ==UserScript==
// @name         WebAppify (Dev)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make any website an installable PWA.
// @author       NoCLin
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @updateURL    http://localhost:18000/WebAppify.dev.user.js
// @downloadURL  http://localhost:18000/WebAppify.dev.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      icon.horse
// @connect      localhost
// ==/UserScript==

(function () {
    'use strict';
    const devUrl = 'http://localhost:18000/WebAppify.user.js'
    function addScript(url) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    GM.xmlHttpRequest({
        method: 'GET',
        url: devUrl,
        onload: function (response) {
            eval(response.response)
        },
        onerror: function (err) {
            console.error("load local script error",err)
        }
    });

})()