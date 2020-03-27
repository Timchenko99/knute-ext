window.onload = function(){
    this.navigator.onLine && chrome.browserAction.setPopup({popup: "../html/main.html"});
};

$(document).ready(function(){
    $("body *").fadeIn("slow");
});