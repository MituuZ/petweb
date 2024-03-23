import sqlite3
from sqlite3 import Cursor

try:
    from config.config import Config
except ImportError:
    from config.config_example import Config

cursor: Cursor


def setup_database():
    global cursor

    print("Setting up database to: ", Config.DATABASE_NAME)
    try:
        conn = sqlite3.connect(Config.DATABASE_NAME)
        cursor = conn.cursor()
        create_tables()

        res = cursor.execute("SELECT name FROM sqlite_master")
        print(res.fetchone())

        insert_into_pets("buddy", "Dog")
        insert_into_pets("bobby", "Cat")
        insert_into_pets("baulie", "Dog")
    except Exception as e:
        print("Error setting up database: ", e)


def create_tables():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pet_weights (
        name TEXT NOT NULL, 
        weight REAL NOT NULL, 
        date date DEFAULT CURRENT_DATE,
        UNIQUE(name, date))
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pets (
        name TEXT NOT NULL, 
        species TEXT NOT NULL, 
        birth_day date,
        active BOOLEAN DEFAULT TRUE,
        UNIQUE(name))
    """)


def insert_into_pet_weights(name, weight, date):
    conn = sqlite3.connect(Config.DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pet_weights (name, weight, date) VALUES (?, ?, ?)", (name, weight, date))
    res = cursor.execute("SELECT * FROM pet_weights")
    cursor.connection.commit()
    print(res.fetchall())


def insert_into_pets(name, species):
    cursor.execute("INSERT INTO pets (name, species) VALUES (?, ?)", (name, species))
    res = cursor.execute("SELECT * FROM pets")
    cursor.connection.commit()
    print(res.fetchall())
