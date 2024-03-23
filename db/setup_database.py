import sqlite3
try:
    from config.config import Config
except ImportError:
    from config.config_example import Config


def setup_database():
    print("Setting up database to: ", Config.DATABASE_PATH)
    conn = sqlite3.connect(Config.DATABASE_PATH + 'petweb.db')
