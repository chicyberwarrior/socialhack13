// ==UserScript==
// @name                SocialHack13
// @namespace	        http://www.oreilly.com/catalog/greasemonkeyhacks/
// @description	        example script to alert "Hello world!" on every page
// @include		http://www.amazon.com/gp/product/*
// ==/UserScript==

// Pops up recommendation window
function popupwindow(url, title, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}
	
// Reads cookie?
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Shares a product (asks for recommendation)
function shareAsin() {
    alert("Sending!")    
    var theUrl = "http://localhost:8080/share/" + username + "/" + asin + "/" + pname
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
		
}

// Get ASIN and product name
var pname = document.getElementById("btAsinTitle").innerHTML
pname = escape(pname)

var asin = document.getElementById("ASIN").value
if(document.getElementById("ASIN") == null) {
    alert("Cannot find ASIN");
}

// Create share button
var shareBtn = document.createElement('img');
shareBtn.src = 'https://s3.amazonaws.com/socialhack/sharewithfriends.png';
shareBtn.appendChild(document.createTextNode('click here'));
shareBtn.style.marginTop = 10;

// Create recommend button
var recBtn = document.createElement('img');
recBtn.src = 'https://s3.amazonaws.com/socialhack/recommendtofriend.png';
recBtn.appendChild(document.createTextNode('click here'));
recBtn.style.marginTop = 10;

// Get original button under which we will place out buttons
var elmFoo = document.getElementById('bb_atc_button');


if (elmFoo == null) {
    // problem, button we are looking for does not exists....
    alert("Bad page, can't find 'add to cart' button...");
}

// Place out buttons
elmFoo.parentNode.insertBefore(shareBtn, elmFoo.nextSibling);
elmFoo.parentNode.insertBefore(recBtn, elmFoo.nextSibling);
 
// Add click listeners
shareBtn.addEventListener('click', shareAsin, false);
recBtn.addEventListener('click', function aaa() {
	p = popupwindow("http://localhost:8080/static/shares.html?asinname=" + escape(pname), "Hello", 600,600);
	p.asinName = "Some value";
	
    }, false);

// Get login name for the user, should be the same as FB
var username = readCookie("socialhackuser")
if (username == null) {
    username = prompt("Enter your username")
    document.cookie = "socialhackuser=" + response
} 