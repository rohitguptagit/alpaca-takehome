from tinydb import TinyDB, Query
import uuid

# Initialize TinyDB instance
db = TinyDB('db.json')

def get_session(id):
    table = db.table('sessions')
    query = Query()
    if query:
        return table.search(query.id == id)
    return table.all()

def get_sessions_by_user(user):
    table = db.table('sessions')
    query = Query()
    return table.search(query.user == user)

def write_session(session, session_id=None):
    table = db.table('sessions')
    if session_id:
        table.update(session, Query().id == session_id)
        return session_id
    else:
        session['id'] = str(uuid.uuid4())
        table.insert(session)
        return session['id']
    
def delete_session(session_id):
    table = db.table('sessions')
    query = Query()
    table.remove(query.id == session_id)
