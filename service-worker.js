const api = typeof browser !== 'undefined' ? browser : chrome;
api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("HELLO o/")
    if (request.action === "getSetting") {
        api.storage.local.get(request.key)
            .then((result) => {
                console.log(result[request.key])
                sendResponse({ success: true, value: result[request.key] });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

