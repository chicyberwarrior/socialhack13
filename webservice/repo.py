import logging
import sqlite3

dbname = "../db/shack.sqlite"

#================================================================================
# SQL
#================================================================================

sql_query_list_users = "SELECT * FROM USERS"
sql_query_list_user = "SELECT * FROM USERS WHERE UNAME = '%s'"

sql_query_list_shares = "SELECT ASIN FROM SHARES WHERE UNAME = '%s'"
sql_query_list_share = "SELECT * FROM SHARES WHERE UNAME = '%s' AND ASIN = '%s'"

sql_query_product_exists = "SELECT COUNT(*) FROM PRODUCTS where asin = '%s'"
sql_insert_product = "INSERT INTO PRODUCTS (asin, url, imgurl, name) VALUES ('%s', '%s', '%s', '%s')"
sql_query_list_product = "SELECT * FROM PRODUCTS WHERE asin = '%s'";

sql_insert_rec = "INSERT INTO RECOMMENDATIONS (RECOMMENDER, REQUESTEDASIN, RECOMMENDEDASIN) VALUES ('%s','%s','%s')"

#================================================================================
# RECOMMENDATIONS
#================================================================================
def add_recommendation(user, fromasin, toasin):
    try:
        logging.info("Adding recomendation %s for %s by %s." %(fromasin, toasin, user))
        sql = sql_insert_rec % (user, toasin, fromasin)
        logging.info("Add recommendation sql: " + sql)
        con = get_db_connection()
        con.execute(sql)
        con.commit()    
        
    except Exception, e:
        print e
        logging.error("Duplicate recommendation: %s, %s, %s" % (user, fromasin, toasin))


#================================================================================
# UTIL
#================================================================================
def get_db_connection():
    return sqlite3.connect(dbname)

# Maps a sqlite row to a dictionary object, each key corresponding to column name
def row_to_dict(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]

    return d

#================================================================================
# PRODUCT
#================================================================================

def get_product(asin):
    if asin is None:
        logging.error("get_product() received null value")
        
    asin = asin.strip()
    
    logging.info("Fetching details of product %s" % asin)
    if len(asin) == 0:
        logging.error("get_product() received empty value")
        return {}
    else:
        if product_exists(asin):
            cursor = get_db_connection().execute(sql_query_list_product % asin)
            row = cursor.fetchone()        
            prod = row_to_dict(cursor, row)
            logging.info("Product details: %s" % prod)
            return prod
        else:
            return {}
        
def product_exists(asin):
    if asin is None:
        logging.error("product_exists() received null value")
        
    asin = asin.strip()
    
    logging.info("Checking if product with asin %s exists" % asin)
    if len(asin) == 0:
        logging.error("product_exists() received empty value")
        return {}
    else:
        cursor = get_db_connection().execute(sql_query_product_exists % asin)
        row = cursor.fetchone()        
        logging.info("Product exists: %s" % row[0])
        return row[0]

def add_product(product):
    
    asin = product['asin']
    url = product['url']
    imgurl = product['imgurl']
    name = product['name']
    
    if product_exists(asin) == 0:
        con = get_db_connection()
        con.execute(sql_insert_product % (asin, url, imgurl, name))
        con.commit()
    else:
        pass

    

#================================================================================
# USER
#================================================================================

def get_user(name):
    if name is None:
        logging.error("get_user() received null value")
        
    name = name.strip().lower()
    
    logging.info("Fetching details of user %s" % name)
    if len(name) == 0:
        logging.error("get_user() received empty value")
        return {}
    else:
        cursor = get_db_connection().execute(sql_query_list_user % name)
        row = cursor.fetchone()        
        user = row_to_dict(cursor, row)
        logging.info("User details: %s" % user)
        return user
        
# Lists all users
def get_all_users():
    logging.info("Listing users")
    
    cursor = get_db_connection().execute(sql_query_list_users)
    users = {}
    
    for row in cursor:
        user = row_to_dict(cursor, row)
        users[user['uname']] = user

    return users    
    
#================================================================================
# SHARES
#================================================================================    

def get_shares(user):
    if user is None:
        logging.error("get_shares() received null value")
        
    user = user.strip().lower()
    
    logging.info("Fetching shares of user %s" % user)
    if len(user) == 0:
        logging.error("get_shares() received empty value")
        return {}
    else:
        cursor = get_db_connection().execute(sql_query_list_shares % user)
        shares = []
        for row in cursor:
            share = row_to_dict(cursor, row)
            shares.append(row[0])
  
        logging.info("Shares for user %s: %s" % (user, str(shares)))
        return shares

def get_share(user, asin):
    if user is None:
        logging.error("get_shares() received null value")
        
    user = user.strip().lower()
    
    logging.info("Fetching shares of user %s" % user)
    if len(user) == 0:
        logging.error("get_shares() received empty value")
        return {}
    else:
        cursor = get_db_connection().execute(sql_query_list_share % (user, asin))
    
        for row in cursor:
            share = row_to_dict(cursor, row)
  
            logging.info("Shares for user %s: %s" % (user, str(share)))
            return share

    
#================================================================================
# other....
#================================================================================    

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    
    add_recommendation('wiktor', 'A', 'B')