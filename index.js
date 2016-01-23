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

  var domain_line = document.createElement("div");
  var url_line = document.createElement("div");
  var loadtime_line = document.createElement("div");
  //var headers_line = document.createElement("div");

  domain_line.textContent = request.domain;
  url_line.textContent = request.url;
  loadtime_line.textContent = request.loadtime + " milliseconds";
  //headers_line.textContent = request.headers;

  newDiv.appendChild(domain_line);
  newDiv.appendChild(url_line);
  newDiv.appendChild(loadtime_line);
  //newDiv.appendChild(headers_line);
  newDiv.appendChild(document.createElement("br"));

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


