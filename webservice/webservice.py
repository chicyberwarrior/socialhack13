import web
import re
import json
import repo
import logging
import urllib

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
        
        print name
        parts = name.split('/')
        
        if len(parts) == 3:
            if parts[0] == "add":
                repo.add_product({'asin':parts[2], 'url':web.input()['url'], 'imgurl':web.input()['imgurl'], 'name':urllib.unquote(web.input()['product'])})
                repo.add_share(parts[1], parts[2], web.input()['sharetext'])
                return '{}'
            else:
                return json.dumps(repo.get_share(parts[1], parts[2]))
                
        else:
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
    