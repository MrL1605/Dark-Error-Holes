/**
 * Created By : Lalit
 * Created On : 12/1/19
 */

const deh_util = (function () {

    function setupErrorPage(doc) {
        return new Promise((res) => {
            setErrorMessage(doc);
            setOnClickListener(doc);
            createNewDiv(doc);
            res();
        });
    }

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

    return {
        setupErrorPage,
        createErrorPageURL
    };
})();
