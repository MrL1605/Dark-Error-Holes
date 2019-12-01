/*global chrome */
/**
 * Created By : Lalit
 * Created On : 12/1/19
 */

const ERRORS_TO_TRACK = ["net::ERR_NAME_NOT_RESOLVED"];

/**
 * Keep Listening to errors, and when found replace it with our custom error page.
 **/
chrome.webRequest.onErrorOccurred.addListener((details) => {
        console.log("Error Occurred at", details);
        if (ERRORS_TO_TRACK.indexOf(details.error) !== -1 && details.frameId === 0) {
            let errorPageUrl = createErrorPageURL(details.error, details.url);
            chrome.tabs.update(details.tabId, {url: errorPageUrl});
        }
    },
    {urls: ["<all_urls>"]}
);

/**
 * Keep listening to updated on all tabs, if it is found that our error page exists, let it load completely.
 * Then get the document and register a click listener to button retrieved from extension views,
 * and replace the text for respective error.
 **/
chrome.tabs.onUpdated.addListener((tabId, change, _tab) => {

    if (change.status === "complete") {
        let internalViews = chrome.extension.getViews({type: "tab"});
        console.log("tab Internals", internalViews);
        if (internalViews.length === 1) {
            let tabView = internalViews[0];
            console.log("toggleImagePreviewVisibility", tabView.document);
            if (!tabView.document.getElementById("created")) {
                setErrorMessage(tabView.document);
                setOnClickListener(tabView.document);
                createNewDiv(tabView.document);
            }
        }
    }
});

function setErrorMessage(doc) {
    doc.getElementById("error-msg").innerText = getErrorCode(doc);
}

function setOnClickListener(doc) {
    doc.getElementById("reload-btn").href = getRetUrl(doc);
}

function createNewDiv(doc) {
    let createDiv = doc.createElement("div");
    createDiv.id = "created";
    doc.body.append(createDiv);
}

function createErrorPageURL(err_code, orgUrl) {
    let _url = chrome.runtime.getURL("./src/html/error_page.html");
    _url += "#ret_url=" + encodeURIComponent(orgUrl);
    _url += "&error_code=" + encodeURIComponent(err_code);
    return _url;
}

function getRetUrl(doc) {
    let extensionUrl = doc.location.hash;
    for (let param of extensionUrl.trim().split("#")[1].split("&")) {
        let paramKey = param.split("=")[0];
        if (paramKey === "ret_url")
            return decodeURIComponent(param.split("=")[1]);
    }
}

function getErrorCode(doc) {
    let extensionUrl = doc.location.hash;
    for (let param of extensionUrl.trim().split("#")[1].split("&")) {
        let paramKey = param.split("=")[0];
        if (paramKey === "error_code")
            return decodeURIComponent(param.split("=")[1]);
    }
}

/* Example Error found till now
background_script.js:29 Error Occurred at {error: "net::ERR_BLOCKED_BY_CLIENT", frameId: 0, fromCache: false, initiator: "https://www.google.com", method: "GET", …}error: "net::ERR_BLOCKED_BY_CLIENT"frameId: 0fromCache: falseinitiator: "https://www.google.com"method: "GET"parentFrameId: -1requestId: "7162"tabId: 372timeStamp: 1575205997633.307type: "image"url: "https://adservice.google.com/adsid/google/ui"__proto__: Object
background_script.js:29 Error Occurred at {error: "net::ERR_NETWORK_CHANGED", frameId: 0, fromCache: false, initiator: "https://www.google.com", method: "POST", …}error: "net::ERR_NETWORK_CHANGED"frameId: 0fromCache: falseinitiator: "https://www.google.com"method: "POST"parentFrameId: -1requestId: "7168"tabId: 372timeStamp: 1575206016499.4521type: "ping"url: "https://www.google.com/gen_204?atyp=i&ei=bLzjXZa-Lfia4-EPu_SCkAM&ct=slh&v=2&s=2&pv=0.45216063382549887&me=14:1575205997816,V,0,0,0,0:2170,e,U&zx=1575205999986"__proto__: Object
background_script.js:29 Error Occurred at {error: "net::ERR_NAME_RESOLUTION_FAILED", frameId: 0, fromCache: false, initiator: "https://www.google.com", method: "POST", …}
background_script.js:29 Error Occurred at {error: "net::ERR_QUIC_PROTOCOL_ERROR", frameId: 77, fromCache: false, initiator: "https://12.client-channel.google.com", ip: "74.125.24.189", …}
background_script.js:29 Error Occurred at {error: "net::ERR_NAME_RESOLUTION_FAILED", frameId: 54, fromCache: false, initiator: "https://12.client-channel.google.com", method: "GET", …}
background_script.js:29 Error Occurred at {error: "net::ERR_FAILED", frameId: 54, fromCache: false, initiator: "https://12.client-channel.google.com", ip: "74.125.24.189", …}
*/
