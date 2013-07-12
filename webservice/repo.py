import logging
import sqlite3

dbname = "../db/shack.sqlite"

sql_query_list_users = "SELECT * FROM USERS"
sql_query_list_user = "SELECT * FROM USERS WHERE UNAME = '%s'"

sql_query_list_shares = "SELECT ASIN FROM SHARES WHERE UNAME = '%s'"
sql_query_list_share = "SELECT * FROM SHARES WHERE UNAME = '%s' AND ASIN = '%s'"

def get_db_connection():
    return sqlite3.connect(dbname)

# Maps a sqlite row to a dictionary object, each key corresponding to column name
def row_to_dict(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]

    return d

# Get user info
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
    

# Lists friends of a user
def get_friends(user):
    return [get_user(f) for f in ["wiktor", "cesar"]]    


def filter_requests(user):
    try:
        logging.info("Filtering requests for user " + user)
        return shrepo['reqs'][user]
    except Exception:
        logging.error("Failed to find requests for user " + user)
        return None
    

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

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    
    print get_shares('wiktor')