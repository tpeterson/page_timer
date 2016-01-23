var network_info_before = [];
var network_info_after = [];
var network_info_during  = [];

chrome.webRequest.onBeforeRequest.addListener(
  function collectRequestInfo(info) {
    var request_info = {
      url: "",
      timestamp: "",
      id: ""
    };

    request_info.url = info.url;
    request_info.timestamp = info.timeStamp;
    request_info.id = info.requestId;
    
    network_info_before.push(request_info);
  },
  {
    urls: [
      "http://*/*", "https://*/*"
    ]
  }
);

chrome.webRequest.onCompleted.addListener(
  function collectRequestLoadedInfo(info) {
    var request_info = {
      url: "",
      timestamp: "",
      loadtime: "",
      id: "",
      headers: "", 
      domain: ""
    };

    request_info.url = info.url;
    request_info.timestamp = info.timeStamp;
    request_info.id = info.requestId;
    //request_info.headers = itemizeResponseHeaders(info.responseHeaders);
    request_info.headers = checkRequestHeaders(info);
    request_info.loadtime = calculateLoadTime(request_info);
    request_info.domain = getDomain(info.url);

    network_info_after.push(request_info);
  },
  {
    urls: [
      "http://*/*", "https://*/*"
    ]
  },
  ["responseHeaders"]
);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "hello") {
      sendResponse({
        msg: network_info_after
      });
      // CLEAR REQUEST ARRAYS BUT MAKES IT SO REQUEST INFO CAN ONLY BE VIEWED ONCE BEFORE NEEDING TO RELOAD
      network_info_before = [];
      network_info_after = [];
      network_info_during  = [];
    }
  }
);

function calculateLoadTime(new_request) {
  var load_time = "";
  network_info_before.forEach(function(old_request) {
    if (old_request.id === new_request.id) {
      load_time = new_request.timestamp - old_request.timestamp;
    } 
  });
  return Math.round(load_time);
}

function itemizeResponseHeaders(response_headers) {
  var headers = [];
  response_headers.forEach(function(x) {
    /* IF LOOKING FOR SPECIFIC HEADER INFO
    if (x.name == "server" || x.name == "Server") {
      headers.push(x.value);
    }
    */
    //headers.push(x.name); IF LOOKING FOR LIST OF HEADERS
    headers.push(x);
  });
  return headers;
}

chrome.webRequest.onSendHeaders.addListener(
  function collectRequestLoadedInfo(info) {
    var request_info = {
      id: "",
      headers: ""
    };

    request_info.id = info.requestId;
    request_info.headers = itemizeResponseHeaders(info.requestHeaders);

    network_info_during.push(request_info);
  },
  {
    urls: [
      "http://*/*", "https://*/*"
    ]
  },
  ["requestHeaders"]
);

function checkRequestHeaders(new_request) {
  var headers = [];
  network_info_during.forEach(function(old_request) {
    if (old_request.id === new_request.requestId) {
      var request_headers = old_request.headers;
      request_headers.forEach(function(x) {
        /* IF LOOKING FOR SPECIFIC HEADER INFO
        if (x.name == "Accept") {
          // HEADER NAMES: Accept,Upgrade-Insecure-Requests,User-Agent,Referer,Accept-Encoding,Accept-Language,Cookie
          headers.push(x.value);
        }
        */
        headers.push(x.value);
      });
    } 
  });
  return headers;
}

function getDomain(link) {
  var url_arr = link.split("");
  var non_http_arr = [];
  
  if (url_arr[4] === "s") {
    var exp_arr = ["h","t","t","p","s",":","/","/"];

    url_arr.forEach(function(x) {
      if (x === exp_arr[0]) {
        exp_arr.splice(0,1);
       } else {
        non_http_arr.push(x);
       } 
    });

    return non_http_arr.join("").split("/")[0];
  } else {
    var exp_arr = ["h","t","t","p",":","/","/"];

    url_arr.forEach(function(x) {
     if (x === exp_arr[0]) {
       exp_arr.splice(0,1);
      } else {
       non_http_arr.push(x);
       } 
    });

    return non_http_arr.join("").split("/")[0];
  }  
}
