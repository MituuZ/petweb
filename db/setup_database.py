import sqlite3

try:
    from config.config import Config
except ImportError:
    from config.config_example import Config


def setup_database():
    print("Setting up database to: ", Config.DATABASE_PATH)
    try:
        conn = sqlite3.connect(Config.DATABASE_PATH + 'petweb.db')
        cursor = conn.cursor()
        create_tables(cursor)

        res = cursor.execute("SELECT name FROM sqlite_master")
        print(res.fetchone())
    except Exception as e:
        print("Error setting up database: ", e)


def create_tables(cursor):
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pet_weights (
        name TEXT NOT NULL, 
        weight REAL NOT NULL, 
        date date DEFAULT CURRENT_DATE)
    """)
