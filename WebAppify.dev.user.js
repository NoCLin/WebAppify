// ==UserScript==
// @name         WebAppify (Dev)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make any website an installable PWA.
// @author       NoCLin
// @match        *://*/*
// @icon         data:image/webp;base64,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
// @updateURL    http://localhost:18000/WebAppify.dev.user.js
// @downloadURL  http://localhost:18000/WebAppify.dev.user.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
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
            console.error("load local script error", err)
        }
    });

})()