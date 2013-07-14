function get_user_shares(username) {
            $.getJSON(
                'http://localhost:8080/list/d', 
                function(data) {
                    $.each(data, function(key, val) {
                        // noop
                        });
                    }
            );
                        
        }
        
        function add_user(username) {
            $.getJSON(
                'http://localhost:8080/user/' + username, 
                function(userObj) {
                    var users = document.getElementById("users")
                    user_row_id = add_user_row(users, userObj['imgurl'], userObj['uname'], userObj['location']);
                    add_shares(username);
                    }
            );
            
        }

        function add_shares(username) {
            $.getJSON(
                'http://localhost:8080/shares/' + username, 
                function(userObj) {
                    userObj.forEach(function(asin) {
                        add_share(username, asin);
                    });
                }
                );
        }
        function add_share(username, asin) {
            $.getJSON(
                'http://localhost:8080/shares/' + username + "/" + asin, 
                function(shareObj) {
                    var shares = document.getElementById(username + "_shares");
                    add_product_row(shares, shareObj['imgurl'], shareObj['asinname'], shareObj['text'])

                    }
            );
            
        }        
        function add_product_row(shares, image_url, prod_name, share_text) {
            var row=shares.insertRow(0);
            var cell1=row.insertCell(0);
            var cell2=row.insertCell(1);
            var cell3=row.insertCell(2);
            var cell4=row.insertCell(3);
            cell1.innerHTML="";
            cell2.width="50px";
            cell2.innerHTML="<img src=\""+image_url+"\" width=100px/>";
            cell3.style.verticalAlign="top"; 
            
            var votesText = "<div style=\"float: left; font-size: 10px;margin: 0px; padding: 13px 10px;\">13 votes</div>"
            var btnText = "<a onmouseover=\"this.className='button green'\" onmouseout=\"this.className='button gray'\" href=\"#\" class=\"button gray\" style=\"float: left\">Recommend</a>";
            var wrapper = "<div>" + btnText + votesText +  "</dev>";
            
            cell3.innerHTML="<div class=\"product\">"+prod_name+"</div><div class=\"sharetext\">"+share_text+"</div>" + wrapper;
            
            
            cell4.innerHTML="";
        }
        
        function add_user_row(users, image_url, username, userlocation) {
            var row=users.insertRow(2);
            row.id=username+"_data";  
            var cell1=row.insertCell(0);
            var cell2=row.insertCell(1);
            var cell3=row.insertCell(2);
            var cell4=row.insertCell(3);
            cell1.innerHTML="";
            cell2.className= "userimagerow";
            cell2.innerHTML="<img src=\""+image_url+"\"/>";
            cell2.style.width="50px"    
            cell3.innerHTML="<div class=\"username\">"+ username+"</div><div class=\"userlocation\">"+userlocation+"</div><table id=\""+username+"_shares\"></table>";
            cell4.innerHTML="";
            
            return username + "_shares";
        }
        
     function add_detail(username, asin) {
        $.getJSON(
                'http://localhost:8080/shares/' + username + "/" + asin, 
                function(shareObj) {
                    var shares = document.getElementById("detail");
                    add_product_row(shares, shareObj['imgurl'], shareObj['asinname'], shareObj['text'])

                    }
            );
     }
        
        function after_load(args) {
            var QueryString = function () {
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                  var pair = vars[i].split("=");
                  if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                  } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]], pair[1] ];
                    query_string[pair[0]] = arr;
                  } else {
                    query_string[pair[0]].push(pair[1]);
                  }
                } 
                  return query_string;
              } ();

            var asinname = unescape(QueryString.asinname);
            
            var header = document.getElementById("divHeader");
            header.innerHTML="You are recommending: " + unescape(asinname);
            var users = document.getElementById("users")
            //add_user("cesar")
            //add_user("wiktor")
            add_detail("cesar","B0072O5UXE" )
          
        }
