$(document).ready(function(){
    $("#main").fadeIn('slow');
    $("#main").fadeIn(1000);
    $("#start-btn").click(function(){
        $("#main").fadeOut("slow", function(){
            chrome.browserAction.setPopup({popup:"../html/add.html"});
            location.href = "../html/add.html";
        });
    });
});