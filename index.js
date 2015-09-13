window.addEventListener('DOMContentLoaded', function() {
  getRequestInfo();
});

function getRequestInfo() {
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
    	document.getElementById("container").innerHTML = "";
    	response.msg.forEach(arrangeRequestInfo);
    });
}

function arrangeRequestInfo(request) {
	var newDiv = document.createElement("div");
	var timestamp = new Date(request.timestamp);
	newDiv.textContent = request.url + " ... " + request.loadtime + " milliseconds";
	document.getElementById("container").appendChild(newDiv);
}