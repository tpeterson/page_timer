var network_info_before = [];
var network_info_after = [];

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
  });

chrome.webRequest.onCompleted.addListener(
  function collectRequestLoadedInfo(info) {
    var request_info = {
      url: "",
      timestamp: "",
      loadtime: "",
      id: ""
    };

    request_info.url = info.url;
    request_info.timestamp = info.timeStamp;
    request_info.id = info.requestId;
    request_info.loadtime = calculateLoadTime(request_info);

    network_info_after.push(request_info);
  },
  {
    urls: [
      "http://*/*", "https://*/*"
    ]
  });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "hello") {
      sendResponse({
        msg: network_info_after
      });
      // CLEAR VARS HOLDING REQUEST ARRAYS
      //network_info_before = [];
      //network_info_after = [];
    }
  });

function calculateLoadTime(new_request) {
  var load_time = "";
  network_info_before.forEach(function(old_request) {
    if (old_request.id === new_request.id) {
      load_time = new_request.timestamp - old_request.timestamp;
    } 
  });
  return Math.round(load_time);
}