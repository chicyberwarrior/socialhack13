import web
import re
import json
import repo
import logging

class User(object):
    def GET(self, name):        
        name = name.strip().lower()
        web.header('Content-Type', 'application/json')

        if len(name) == 0:
            logging.info("Listing all users.")
            users = repo.get_all_users( )
            jsonstr = json.dumps(users)
            return jsonstr
        else:            
            logging.info("Request to list user '" + name + "'")
            user = repo.get_user(name)
            jsonstr = json.dumps(user)
            return jsonstr
        
class Friends(object):
    def GET(self, name):        
        name = name.strip().lower()
        web.header('Content-Type', 'application/json')

        if len(name) == 0:
            logging.error("Can't finds relationships if you do not provide username.")
            return "{}"
        else:            
            logging.info("Request to list relationships of user '" + name + "'")
            user = repo.get_friends(name)
            jsonstr = json.dumps(user)
            return jsonstr

class Shares(object):
    def GET(self, name):
        web.header('Content-Type', 'application/json')
        
        parts = name.split('/')
        
        if len(parts) == 4:
            return json.dumps(repo.get_share(parts[0], parts[1]))
            #j = json.dumps({
            #    'uname': name,
            #    'asin': 'A1234',
            #    'asinname': "Something",
            #    'imgurl': 'http://ecx.images-amazon.com/images/I/41XNAMr8JCL._SY300_.jpg',
            #    'url':"http://www.amazon.com/gp/product/B003N9SR00/ref=s9_simh_gw_p422_d0_i3?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-2&pf_rd_r=1TD8CVHMB58B63MAJDXZ&pf_rd_t=101&pf_rd_p=1389517282&pf_rd_i=507846",
            #    'text': "Help me!"
            #    })
            #
            #return j
        else:
#            return json.dumps(["A1234","B1234","C1234"])
            return json.dumps(repo.get_shares(parts[0]))

class Products(object):
    def GET(self, name):
        web.header('Content-Type', 'application/json')
        
        return json.dumps(repo.get_product(name))

class Recommendations(object):
    def GET(self, name):
        web.header('Content-Type', 'application/json')
        
        parts = name.split('/')
        logging.info("Adding recommendation args: " + name)
        if len(parts) == 4:
            if parts[0].lower().strip() == "add":
                self.add(parts[1], parts[2], parts[3])
            else:
                return '{}'
        else:
            return '{}'
    
    def add(self, user, fromasin, toasin):
        repo.add_recommendation(user, fromasin, toasin)
    
urls = (
    '/user/(.*)', 'User',
    '/friends/(.*)', 'Friends',
    '/shares/(.*)', 'Shares',
    '/product/(.*)', 'Products',
    '/rec/(.*)', 'Recommendations'
    )

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)

    web.application(urls, globals()).run()
    