// ==UserScript==
// @name         WebAppify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make any website an installable PWA.
// @author       NoCLin
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @updateURL    http://
// @downloadURL  http://
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      icon.horse
// ==/UserScript==

(function () {
    'use strict';

    function resizeImage(img_url, width, height) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.src = img_url;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL();
                resolve(dataURL);
            };
            image.onerror = (e) => {
                reject(new Error('Failed to load image'));
            };
        });
    }

    function fetchWithGM(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    resolve(response);
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    function blobToBase64Url(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64Url = reader.result;
                if (base64Url) {
                    resolve(base64Url);
                } else {
                    reject(new Error('Failed to convert blob to Base64 URL'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    function setupManifest(config) {

        document.querySelectorAll("link[rel='manifest']").forEach(e => e.remove())
        console.log("setupManifest", config)

        const configBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))))
        const dataUrl = `data:application/json;base64,${configBase64}`

        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = dataUrl;
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }

    let iconURL = ""
    const descriptionElement = document.querySelector("meta[name='description']")
    const manifestElement = document.querySelector("link[rel='manifest']")

    const name = document.title
    const description = descriptionElement ? descriptionElement.content || '' : ''
    const existedManifestURL = manifestElement ? manifestElement.href || '' : ''

    // TODO: load from existedManifestURL
    let manifest = {

        name: name,
        short_name: name,
        description: description,
        start_url: window.location.href,
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
            {
                "src": iconURL,
                "sizes": "512x512 64x64 32x32 24x24 16x16",
                "type": "image/png"
            }
        ]
    };


    let modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '9999';

    let form = document.createElement('form');
    form.style.position = 'absolute';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.background = '#fff';
    form.style.padding = '20px';
    form.style.width = '400px';
    form.style.borderRadius = '10px';

    form.innerHTML = `<h2>Manifest Editor</h2>

        <label for="name">App Name:</label>
        <input type="text" id="name" name="name" value="${manifest.name}">
        <br>
        <label for="short-name">Short Name:</label>
        <input type="text" id="short-name" name="short_name" value="${manifest.short_name}">
        <br>
        <label for="description">Description:</label>
        <input type="text" id="description" name="description" value="${manifest.description}">
        <br>
        <label for="start-url">Start URL:</label>
        <input type="url" id="start-url" name="start_url" value="${manifest.start_url}">
        <br>
        <label for="display-mode">Display Mode:</label>
        <select id="display-mode" name="display">
            <option value="standalone" ${manifest.display === 'standalone' ? 'selected' : ''}>Standalone</option>
            <option value="fullscreen" ${manifest.display === 'fullscreen' ? 'selected' : ''}>Fullscreen</option>
            <option value="minimal-ui" ${manifest.display === 'minimal-ui' ? 'selected' : ''}>Minimal UI</option>
            <option value="browser" ${manifest.display === 'browser' ? 'selected' : ''}>Browser</option>
        </select>
        <br>
        <label for="webappify-icon">Icon:</label>
        <img id="webappify-icon" width="64" height="64" alt="icon"/>
        <br>
        
        <label for="bg-color">Background Color:</label>
        <input type="text" id="bg-color" name="background_color" value="${manifest.background_color}">
        <br>
        <label for="bg-color">Theme Color:</label>
        <input type="text" id="theme-color" name="theme_color" value="${manifest.theme_color}">
        <br>
        <button type="submit">Install!</button>

        `;

    modal.appendChild(form);
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        modal.style.display = 'none';

        for (let key in manifest){
            if (key === "icons") continue;
            manifest[key] = form.elements[key].value
        }
        manifest["icons"][0]["src"] = iconURL
        setupManifest(manifest)
    });

    function showModal(show) {
        if (!show) {
            if (existedManifestURL) {
                alert("The website already has a manifest file, please use the editor to make modifications.")
                return;
            }
        }else{
            modal.style.display = 'block';
        }

        const targetSizeIconUrl = `https://icon.horse/icon/${window.location.host}?size=large`

        fetchWithGM(targetSizeIconUrl).then(response => {
            return blobToBase64Url(response.response)
        }).then(base64data => {
            return resizeImage(base64data, 512, 512)
        }).then(resized => {

            iconURL = resized
            if (show) {
                document.querySelector("#webappify-icon").src = resized
            } else {
                manifest.icons[0].src = iconURL
                setupManifest(manifest)
            }

        }).catch(err => {
            console.error(err)
            alert(err)
        })

    }

    GM.registerMenuCommand('Install as PWA (Editor)', () => showModal(true));
    GM.registerMenuCommand('Install as PWA', () => showModal(false));

})();