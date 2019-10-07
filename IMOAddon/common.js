

var headElement = (document.head||document.documentElement);

var injectJs = function(fileName) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(fileName);
    headElement.insertBefore(s, headElement.firstElementChild);
};

injectJs("first-names.js");
injectJs("names.js");
injectJs("middle-names.js");

var getPrefix = function() {
    return "OSE$";
};

function isNumeric(num){
    return !isNaN(num)
  }
  

  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

  function generateRandomFixedLength(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if ( n > max ) {
            return generateRandomFixedLength(max) + generateRandomFixedLength(n - max);
    }

    max        = Math.pow(10, n+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add); 
}

const API_SRV_ADDR = "http://localhost:3001";

var Configuration = {
    replacing: {
        enabled: true,
        ints: true,
        strings: true,
        data: true,
        names: {
            male: true,
            female: true
        }
    },
    reporting: {
        enabled: true
    },
    warnings: {
        enabled: false
    }
}

// Get configuration from local storage
//Configuration = browser.storage.sync.get("config");


function showTrackingAlert(sourceUrl) {
    var opt = {
        type: "basic",
        title: "Wykryto ciasteczka śledzące",
        message: "Ciasteczka na witrynie " + sourceUrl + " zostały zafałszowane, kliknij tutaj po więcej informacji.",
        iconUrl: "logo_imos.png",
        imageUrl: "logo_imos.png",
    }

    chrome.notifications.create("", opt, function() {

    });
}



function reportCookie(sourceURL, cookieURL, cookieName, cookieValue, cookieNewValue) {
    var request = new XMLHttpRequest();

    request.open("GET", API_SRV_ADDR+'/reportCookie?sourceURL='+sourceURL+"&cookieName="+cookieName+"&cookieValue="+cookieValue+"&cookieURL="+cookieURL+"&cookieNewValue="+cookieNewValue, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({sourceURL: sourceURL, cookieName: cookieName, cookieValue: cookieValue, cookieURL: cookieURL}));
}



var lastUrl="";

var processCookieStr = function(cookiesStr, cookieUrl) {
    
    var prefix = getPrefix();
    var cookieStrList = cookiesStr.split('; ');
    console.log("List before changes");
    console.log(cookieStrList);
    var newStrList = [];

    var trackingCookiesUrls = [];

    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {


    cookieStrList.forEach(function(cookieStr){
      
            // and use that tab to fill in out title and url
            var tab = tabs[0];
         //   console.log(tab.url);

            var arr1 = cookieStr.split("=");
            var wartosc = arr1[1];
            var cookieValue = arr1[1];



        /*
        if (cookieStr.indexOf(prefix)==0) {
            console.log("Prefix=0")
           // newStrList.push(cookieStr.substring(prefix.length, cookieStr.length));
           newStrList.push(cookieStr+prefix);
        }
        */
        //if (cookieStr.indexOf(prefix)==0) {
            console.log("Prefix=-1")
           // newStrList.push(cookieStr.substring(prefix.length, cookieStr.length));
         
           // sprawdzamy rodzaj wartosci
            if (isNumeric(wartosc)) {
                if (Configuration.replacing.enabled && Configuration.replacing.ints) {
                    arr1[1] = changeIntValue(wartosc);
                }
            } else {
                    if (IMIONA_DB.indexOf(wartosc)!=-1 && Configuration.replacing.names) {
                        arr1[1] = IMIONA_DB[Math.floor(Math.random()*IMIONA_DB.length)];
                    } else if (IMIONA_DB_FEMALE.indexOf(wartosc)!=-1 && Configuration.replacing.names) {
                        arr1[1] = IMIONA_DB_FEMALE[Math.floor(Math.random()*IMIONA_DB_FEMALE.length)];
                    } else if (IMIONA_DB_MALE.indexOf(wartosc)!=-1 && Configuration.replacing.names) {
                        arr1[1] = IMIONA_DB_MALE[Math.floor(Math.random()*IMIONA_DB_MALE.length)];
                    } else {
                        if (Configuration.replacing.enabled && Configuration.replacing.strings) {
                            arr1[1] = changeStringValue(wartosc);
                        }
                    }
            }
            cookieStr=arr1.join("=");
            if (cookieStr.indexOf(prefix)==0) {
                console.log("Prefix=0")
               newStrList.push(cookieStr.substring(prefix.length, cookieStr.length));
               //newStrList.push(cookieStr+prefix);
            }else{
                newStrList.push(cookieStr);
            }      

           
            

            /// Reporting to server
            var sourceURL = tab.url;
            var cookieURL = cookieUrl;
            var cookieName = arr1[0];
            var cookieNewValue = arr1[1];

            trackingCookiesUrls.push(sourceURL);

            
            
           
            reportCookie(sourceURL, cookieURL, cookieName, cookieValue, cookieNewValue);

    });

   
    
    console.log(trackingCookiesUrls);
    var uniqueTrackingCookiesUrls = [...new Set(trackingCookiesUrls)]
    //var uniqueTrackingCookiesUrls = trackingCookiesUrls.filter( onlyUnique ); // returns ['a', 1, 2, '1']
console.log(uniqueTrackingCookiesUrls);
    uniqueTrackingCookiesUrls.forEach(trackingCookieUrl => {
        console.log("Tracking: "+trackingCookieUrl);
        console.log("Tracking sub: "+trackingCookieUrl.substring(0,5));
        if(trackingCookieUrl.substring(0,5) != "about"){// && trackingCookieUrl != "about:home") {
            if (Configuration.warnings.enabled && lastUrl!=trackingCookieUrl) {   
                lastUrl=trackingCookieUrl;
                console.log("Last url: " + lastUrl);
                showTrackingAlert(trackingCookieUrl);
            }
        }
       
    });
        console.log("List after changes");
        console.log(newStrList);
        return newStrList.join("; ");
    });
};

var processSetCookieStr = function(str, cookieUrl) {
    return str; //getPrefix()+
};

var changeIntValue = function(currentValue){
    var dlugosc = currentValue.length;
    return generateRandomFixedLength(dlugosc);
}

var changeStringValue = function(currentValue){
    var dlugosc = currentValue.length;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < dlugosc; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    if(request.action == "update_configuration"){
        Configuration.replacing.ints = request.value;
        Configuration.replacing.strings = request.value;
        Configuration.replacing.data = request.value;
        sendResponse({addonConfiguration: Configuration});
    }

    if (request.action == "switch_enable_tracking") {
        Configuration.replacing.enabled = request.value;
        console.log("Switch changed to "+Configuration.replacing.enabled)

    }

    if (request.action == "integer_replace_switch") {
        Configuration.replacing.ints = request.value;
        console.log("Second Switch changed to "+Configuration.replacing.ints)
    }

    if (request.action == "string_replace_switch") {
        Configuration.replacing.strings = request.value;
        console.log("Third Switch changed to "+Configuration.replacing.strings)
        
    }

    if (request.action == "reporting_switch") {
        Configuration.reporting.enabled = request.value;
        console.log("Fourth Switch changed to "+ Configuration.reporting.enabled)
    }

    if (request.action == "alert_switch") {
        Configuration.warnings.enabled = request.value;
        console.log("Fifthd Switch changed to "+Configuration.warnings.enabled)
    }

    if (request.action == "tracking_enabled_data") {
        Configuration.replacing.data = request.value;
        console.log("Sixth Switch changed to "+Configuration.replacing.data)
    }

    if (request.action == "get_config") {
        sendResponse({addonConfiguration: Configuration});
        console.log("Requested configuration ")
    }

    /*
    browser.storage.sync.set({
        config: Configuration
    });
    */
      //  sendResponse({farewell: "goodbye"});
    });