function reportUnencryptedWebsites(sourceURL) {
    var request = new XMLHttpRequest();

    request.open("GET", API_SRV_ADDR+'/reportUnecryptedWebsite?siteUrl='+sourceURL, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({}));
}

var lastUnencryptedDomain = "";

function showUnencryptedWebsiteAlert(sourceUrl) {
    var opt = {
        type: "basic",
        title: "Strona którą odwiedzasz nie jest szyfrowana",
        message: "Witryna " + sourceUrl + " nie korzysta z szyfrowania protokołem SSL",
        iconUrl: "logo_imos.png",
        imageUrl: "logo_imos.png",
    }

    if(sourceUrl.indexOf("localhost")==-1){

    chrome.notifications.create("", opt, function() {

    });
    
    let domain =sourceUrl.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    if (lastUnencryptedDomain != domain) {
        reportUnencryptedWebsites(domain);
        lastUnencryptedDomain = domain;
    }
    
}
}

self.addEventListener('notificationclick', function(event) {
    let url = 'https://example.com/some-path/';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        
        if (details.url.indexOf("http://") !== -1) {
                showUnencryptedWebsiteAlert(details.url);
               
            }
            
        details.requestHeaders.forEach(function(requestHeader){
            if (requestHeader.name.toLowerCase() === "cookie") {
                console.log("Sending cookie:");
                console.log(requestHeader);
                //console.log(requestHeader.value);
                requestHeader.value = processCookieStr(requestHeader.value, details.url);
            }
        });
        return {
            requestHeaders: details.requestHeaders
        };
    }, {
        urls: [ "*://*/*" ]
    }, ['blocking', 'requestHeaders']
);

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        details.responseHeaders.forEach(function(responseHeader){
            if (responseHeader.name.toLowerCase() === "set-cookie") {
                console.log("Cookie received")
                console.log(responseHeader);
                responseHeader.value = processSetCookieStr(responseHeader.value, details.url);
            }
        });
        return {
            responseHeaders: details.responseHeaders
        };
    }, {
        urls: ["*://*/*"]
    }, ['blocking','responseHeaders']
);