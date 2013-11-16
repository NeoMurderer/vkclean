chrome.storage.sync.get('first', function(data) {
    if (data.first == undefined || data.first === true) {
        chrome.storage.sync.set({
            first: false,
            add: true,
            apps: true,
            link: true,
            vkclean: true,
            update: true,
            short_link: true,
            repost: false,
        })
    }
});
var i = 1;
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.setPopup({
        popup: "popup.html"
    })
});

function checkForValidUrl(tabId, changeInfo, tab) {
    if (changeInfo.status === "loading") {
        if ((tab.url.indexOf('vk.com') > -1)) {

            chrome.tabs.executeScript(tabId, {
                file: "js/jquery.js"
            });
            chrome.tabs.executeScript(tabId, {
                file: "js/content_script.js"
            })
            console.log("vk")
        } else {
            console.log("novk")
        }
    }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if ((tab.url.indexOf('vk.com') > -1)) {
            chrome.contextMenus.create({
                "id": "block",
                "title": "Добавить список фильтров",
                "contexts": ["selection"],
                "onclick": block
            });
        } else {
            chrome.contextMenus.remove("block")
        }
    })
})

function block(info, tab) {
    var list = [];
    chrome.storage.sync.get(function(items) {
        if (items.text) {
            list = JSON.parse(items.text);
            list[list.length] = info.selectionText
        } else {
            list[0] = info.selectionText
        }
        list.sort();
        var text = JSON.stringify(list);
        chrome.storage.sync.set({
            text: text,
            update: true
        })
    })
}
