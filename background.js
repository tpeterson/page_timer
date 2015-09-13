var network_info_before = [];
var network_info_after = [];

chrome.webRequest.onBeforeRequest.addListener(
  function collectRequestInfo(info) {
    var request_info = {
      url: "",
      timestamp: ""
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
      timestamp: ""
    };
    request_info.url = info.url;
    request_info.timestamp = info.timeStamp;
    request_info.id = info.requestId;
    network_info_after.push(request_info);
  },
  {
    urls: [
      "http://*/*", "https://*/*"
    ]
  });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting === "hello")
      sendResponse({
        msg: network_info_after
      });
  });