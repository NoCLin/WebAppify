# WebAppify

> Make any website an installable PWA, **regardless of whether or not the website owner has provided one**.

|          |          |
|----------|----------|
| ![image](./imgs/install.png) | ![image](./imgs/google.png) |
| ![image](./imgs/poe.png)     | ![image](./imgs/notion.png) |

Known limitations:

- Tested on Chrome + Tampermonkey only.
- Firefox and Safari are not supported.

## Installation

- Install
[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) /
[Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
 (or any other alternatives)
- [Click here to install](https://github.com/NoCLin/WebAppify/raw/master/WebAppify.user.js)


## Steps

1. Open the context menu by right-clicking
2. Select Tampermonkey / Greasemonkey (or any other alternatives) -> WebAppify -> Install as PWA
3. Locate the installation button on the right-hand side of the address bar

## Highlights

- insert manifest
- Retrieve the icon and resize it to 512x512 in browser.
- build Base64 URL (No need to worry about CORS or CSP)
