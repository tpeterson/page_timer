window.addEventListener('DOMContentLoaded', function() {
  getRequestInfo();
});

function getRequestInfo() {
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
    	document.getElementById("container").innerHTML = "";
      var sorted_arr = response.msg.sort(sortArr);
      sorted_arr.forEach(arrangeRequestInfo);
    });
}

function arrangeRequestInfo(request) {
	var newDiv = document.createElement("div");
	var timestamp = new Date(request.timestamp);
	newDiv.textContent = request.url + " ... " + request.loadtime + " milliseconds";
	document.getElementById("container").appendChild(newDiv);
}

function sortArr(a, b) {
  if (a.loadtime < b.loadtime) {
    return 1;
  }
  if (a.loadtime > b.loadtime) {
    return -1;
  }
  return 0;
}


