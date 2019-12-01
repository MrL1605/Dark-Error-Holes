/**
 * Created By : Lalit
 * Created On : 12/1/19
 */

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {

    console.log("Is being called with change", change);
    if (change.url) {
        console.log("Tab's url for", tabId, change.url);
        chrome.storage.sync.set({changedTo: change.url}, () => {
            console.log("Saved data");
        });
    }
});

