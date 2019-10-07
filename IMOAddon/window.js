
var AddonConfiguration;

var checkbox = document.getElementById("tracking_enabled_switch");

checkbox.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "switch_enable_tracking", value: true}, function(response) {
  //  console.log(response.farewell);
  document.getElementById("integer_replace_switch").checked = true;
  document.getElementById("integer_replace_switch").disabled = false;
        document.getElementById("string_replace_switch").checked = true;
        document.getElementById("string_replace_switch").disabled = false;
        document.getElementById("tracking_enabled_data").checked = true;
        document.getElementById("tracking_enabled_data").disabled = false;

        chrome.runtime.sendMessage({action: "integer_replace_switch", value: true}, function(response) {
            //  console.log(response.farewell);
            });
            chrome.runtime.sendMessage({action: "string_replace_switch", value: true}, function(response) {
                //  console.log(response.farewell);
                });
                chrome.runtime.sendMessage({action: "tracking_enabled_data", value: true}, function(response) {
                    //  console.log(response.farewell);
                    });
                    document.getElementById("info-container").innerHTML = `<div class="alert alert-dismissible alert-success">
                    <strong>Dobra robota :D</strong><br>Ochrona przed śledzeniem jest aktywna!</a>
                  </div>`;
  });
    } else {
chrome.runtime.sendMessage({action: "switch_enable_tracking", value: false}, function(response) {
   // console.log(response.farewell);
   document.getElementById("integer_replace_switch").checked = false;
   document.getElementById("integer_replace_switch").disabled = true;
   document.getElementById("string_replace_switch").checked = false;
   document.getElementById("string_replace_switch").disabled = true;
   document.getElementById("tracking_enabled_data").checked = false;
   document.getElementById("tracking_enabled_data").disabled = true;

   chrome.runtime.sendMessage({action: "update_configuration", value: true}, function(response){
    //console.log(response.farewell);
});
document.getElementById("info-container").innerHTML = `<div class="alert alert-dismissible alert-success" style="background-color:red">
                    <strong>Nie jest ciekawie :(</strong><br>Ochrona przed śledzeniem nie jest aktywna!</a>
                  </div>`;
  });
    }
});

var checkbox2 = document.getElementById("integer_replace_switch");

checkbox2.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "integer_replace_switch", value: true}, function(response) {
  //  console.log(response.farewell);
  });
    } else {
chrome.runtime.sendMessage({action: "integer_replace_switch", value: false}, function(response) {
   // console.log(response.farewell);
  });
    }
});

var checkbox3 = document.getElementById("string_replace_switch");

checkbox3.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "string_replace_switch", value: true}, function(response) {
  //  console.log(response.farewell);
  });
    } else {
chrome.runtime.sendMessage({action: "string_replace_switch", value: false}, function(response) {
   // console.log(response.farewell);
  });
    }
});

var checkbox4 = document.getElementById("reporting_switch");

checkbox4.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "reporting_switch", value: true}, function(response) {
  //  console.log(response.farewell);
  });
    } else {
chrome.runtime.sendMessage({action: "reporting_switch", value: false}, function(response) {
   // console.log(response.farewell);
  });
    }
});

var checkbox5 = document.getElementById("alert_switch");

checkbox5.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "alert_switch", value: true}, function(response) {
  //  console.log(response.farewell);
  });
    } else {
chrome.runtime.sendMessage({action: "alert_switch", value: false}, function(response) {
   // console.log(response.farewell);
  });
    }
});

var checkbox6 = document.getElementById("tracking_enabled_data");

checkbox6.addEventListener( 'change', function() {
    if(this.checked) {     
chrome.runtime.sendMessage({action: "tracking_enabled_data", value: true}, function(response) {
  //  console.log(response.farewell);
  });
    } else {
chrome.runtime.sendMessage({action: "tracking_enabled_data", value: false}, function(response) {
   // console.log(response.farewell);
  });
    }
});


chrome.runtime.sendMessage({action: "get_config"}, function(response) {
    // console.log(response.farewell)
    AddonConfiguration = response.addonConfiguration;;
    console.log("Received configuration");
    console.log(AddonConfiguration);


    document.getElementById("tracking_enabled_switch").checked = AddonConfiguration.replacing.enabled;
    if(!AddonConfiguration.replacing.enabled){
        document.getElementById("integer_replace_switch").checked = false;
        document.getElementById("integer_replace_switch").disabled = true;
        document.getElementById("string_replace_switch").checked = false;
        document.getElementById("string_replace_switch").disabled = true;
        document.getElementById("tracking_enabled_data").checked = false;
        document.getElementById("tracking_enabled_data").disabled = true;       

        chrome.runtime.sendMessage({action: "update_configuration", value: false}, function(response){
            //console.log(response.farewell);
        });

        document.getElementById("info-container").innerHTML = `<div class="alert alert-dismissible alert-success" style="background-color:red">
        <strong>Nie jest ciekawie :(</strong><br>Ochrona przed śledzeniem nie jest aktywna!</a>
      </div>`;

    }else{
        document.getElementById("integer_replace_switch").checked = AddonConfiguration.replacing.ints;
        document.getElementById("string_replace_switch").checked = AddonConfiguration.replacing.strings;
        document.getElementById("tracking_enabled_data").checked = AddonConfiguration.replacing.data;
     

                  document.getElementById("info-container").innerHTML = `<div class="alert alert-dismissible alert-success">
                  <strong>Dobra robota :D</strong><br>Ochrona przed śledzeniem jest aktywna!</a>
                </div>`;
    }
    
    document.getElementById("reporting_switch").checked = AddonConfiguration.reporting.enabled;
    document.getElementById("alert_switch").checked = AddonConfiguration.warnings.enabled;
    
    

   });

   /*
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var AddonConfiguration = request.addonConfiguration;
    
    });


    */


   var checkbox7 = document.getElementById("phishing_report_button");

   checkbox7.addEventListener( 'click', function() {
    console.log("Phishing send")
    var opt = {
        type: "basic",
        title: "Zgłoszenie wysłane",
        message: "Zgłoszenie nadużycia zostało wysłane pomyślnie.",
        iconUrl: "logo_imos.png",
        imageUrl: "logo_imos.png",
    }

    chrome.notifications.create("", opt, function() {

    });
   });


function sendPhishing() {
    console.log("Phishing send")
    var opt = {
        type: "basic",
        title: "Zgłoszenie wysłane",
        message: "Zgłoszenie nadużycia zostało wysłane pomyślnie.",
        iconUrl: "logo_imos.png",
        imageUrl: "logo_imos.png",
    }

    chrome.notifications.create("", opt, function() {

    });
}
