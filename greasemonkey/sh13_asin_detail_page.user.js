// ==UserScript==
// @name                Hello World
// @namespace	        http://www.oreilly.com/catalog/greasemonkeyhacks/
// @description	        example script to alert "Hello world!" on every page
// @include		http://www.amazon.com/gp/product/*
// ==/UserScript==

function popupwindow(url, title, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}
	
if(document.getElementById("ASIN") == null) {
    alert("Cannot find ASIN");
}

var asin = document.getElementById("ASIN").value

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

function sendMsg(msg) {
    alert('Sending message ' + msg)
    
    var theUrl = 'http://ec2-23-22-114-132.compute-1.amazonaws.com:8080/submit/'  + msg
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
		
}

function shareAsin() {
    alert("Sending!")    
    var theUrl = "http://localhost:8080/share/" + username + "/" + asin + "/" + pname
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
		
}

function oc() {
    sendMsg(asin)
}

var elmNewContent = document.createElement('h3');
document.body.appendChild(elmNewContent)

var shareBtn = document.createElement('img');
shareBtn.src = 'https://s3.amazonaws.com/socialhack/sharewithfriends.png';
shareBtn.appendChild(document.createTextNode('click here'));
shareBtn.style.marginTop = 10;

var recBtn = document.createElement('img');
recBtn.src = 'https://s3.amazonaws.com/socialhack/recommendtofriend.png';
recBtn.appendChild(document.createTextNode('click here'));
recBtn.style.marginTop = 10;
//var fakeBtn = document.createElement('input');
//fakeBtn.className = "dpSprite";
//fakeBtn.className += " s_bbBuyNow1Click";
//fakeBtn.type = "image";
//fakeBtn.setAttribute("name", "submit.add-to-cart");
//fakeBtn.setAttribute("alt", "");
//fakeBtn.setAttribute("value", "ZZZ");
//fakeBtn.setAttribute("title", "");
//fakeBtn.setAttribute("src", "http://g-ecx.images-amazon.com/images/G/01/x-locale/common/transparent-pixel._V386942464_.gif");
////var elmNewContent = document.createElement('div')
////elmNewContent.id='WIKTOR';

var frame = document.createElement('iframe');
frame.src='http://localhost:8080/static/shares.html';
frame.style.position = "relative";
frame.style.float="right";
frame.style.top=0;
frame.style.right=0;
frame.style.background="#FFFFFF";
frame.style.border = "";
frame.style.width="500px";

var elmFoo = document.getElementById('bb_atc_button');

if (elmFoo == null) {
    alert("Bad page");
}

elmFoo.parentNode.insertBefore(shareBtn, elmFoo.nextSibling);
elmFoo.parentNode.insertBefore(recBtn, elmFoo.nextSibling);
        
//var elmFoo = document.getElementById('bb_atc_button');
//elmFoo.parentNode.insertBefore(fakeBtn, elmFoo.nextSibling);

shareBtn.addEventListener('click', shareAsin, false);
recBtn.addEventListener('click', function aaa() {
	//loc = document.getElementById("handleBuy");
	//loc.parentNode.insertBefore(frame, loc);
	popupwindow("http://localhost:8080/static/shares.html", "Hello", 400,600);    
    }, false);
var asin = document.getElementById("ASIN").value
var pname = document.getElementById("btAsinTitle").innerHTML
pname = escape(pname)
var username = readCookie("socialhackuser")

if (username == null) {
    username = prompt("Enter your username")
    document.cookie = "socialhackuser=" + response
} else{
}