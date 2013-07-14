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
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=1, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
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
    var shareText = prompt("Enter message for your friends!");
    
    shareText = escape(shareText);
    product = escape(pname);
    imageurl = escape(imgurl)
    produrl = escape(window.location)
    var theUrl = "http://localhost:8080/shares/" + username + "/" + asin + "?product=" + product + "&sharetext=" + shareText + "&imgurl=" + imageurl + "&url=" + produrl;
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
		
}

if (window.top != window.self) {
    // preventing GM script from running in na iframe...
} else {
    isNewLayout = false;
    
    var username = prompt("Enter your username")
    
    // Get ASIN and product name
    var nameel= document.getElementById("btAsinTitle")
    if (nameel == null) {
	nameel = document.getElementById('title');

	if (nameel == null) {
	    alert('Could not find product name!');
	} else {
	    isNewLayout = true;
	}	
    }
    var pname = nameel.innerHTML
    pname = escape(pname)
    
    // Get original button under which we will place out buttons
    var elmFoo = document.getElementById('bb_atc_button');
    
    
    if (elmFoo == null) {
	var elmFoo = document.getElementById('add-to-cart-button');
	if (elmFoo == null) {
	
	    // problem, button we are looking for does not exists....
	    alert("Bad page, can't find 'add to cart' button...");
	} else {
	    isNewLayout = true;
	}
    }

    var imgurl = document.getElementById("main-image").src
    
    var asin = document.getElementById("ASIN").value
    if(document.getElementById("ASIN") == null) {
	alert("Cannot find ASIN");
    }

    
    if (isNewLayout) {
	t1 = "<a href=\"http://google.com\" id=\"recommend-button\" class=\"a-button a-button-icon a-button-primary a-mt5 a-mb5\" >"
	t2 = "<span class=\"a-button-gradient\"><i class=\"a-icon a-icon-cart\"></i><span class=\"a-button-text\">Recommend</span></span></a>";
	t1 = t1 + t2;
    
	t2 = "<div onclick=\"javascript:alert('aaa')\" id=\"share-button\" class=\"a-button a-button-icon a-button-primary a-mt5 a-mb5\" >"
	t3 = "<span class=\"a-button-gradient\"><i class=\"a-icon a-icon-cart\"></i><span class=\"a-button-text\">Share</span></span></div>";
	t2 = t2 + t3;
	
	// Create share button
	var shareBtn = document.createElement('div');
	shareBtn.innerHTML = t1; 
	elmFoo.parentNode.insertBefore(shareBtn, elmFoo.nextSibling);

	// Create recommend button
	var recBtn = document.createElement('img');
	recBtn.innerHTML = t2;
	elmFoo.parentNode.insertBefore(recBtn, elmFoo.nextSibling);
	
    } else {
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
	    
	// Place out buttons
	elmFoo.parentNode.insertBefore(shareBtn, elmFoo.nextSibling);
	elmFoo.parentNode.insertBefore(recBtn, elmFoo.nextSibling);
	 
	// Add click listeners
	shareBtn.addEventListener('click', shareAsin, false);
	recBtn.addEventListener('click', function aaa() {
		p = popupwindow("http://localhost:8080/static/shares.html?user="+username+"&asin=" +asin+ "&asinname=" + escape(pname), "Hello", 600,600);
		p.asinName = "Some value";
		
	    }, false);
    }    
}