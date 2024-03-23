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
        print(res.fetchall())

        # setup_real_data()
        # setup_test_data()
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
        color TEXT NOT NULL,
        UNIQUE(name),
        UNIQUE(species, color)
        )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS species (
        species TEXT NOT NULL,
        min REAL NOT NULL,
        max REAL NOT NULL
        )
    """)


def insert_into_pet_weights(name, weight, date):
    conn = sqlite3.connect(Config.DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pet_weights (name, weight, date) VALUES (?, ?, ?)", (name, weight, date))
    res = cursor.execute("SELECT * FROM pet_weights")
    cursor.connection.commit()
    print(res.fetchall())


def insert_into_pets(name, species, color):
    cursor.execute("INSERT INTO pets (name, species, color) VALUES (?, ?, ?)",
                   (name, species, color))
    res = cursor.execute("SELECT * FROM pets")
    cursor.connection.commit()
    print(res.fetchall())

def insert_into_species(species, min, max):
    cursor.execute("INSERT INTO species (species, min, max) VALUES (?, ?, ?)",
                   (species, min, max))
    res = cursor.execute("SELECT * FROM species")
    cursor.connection.commit()
    print(res.fetchall())


def setup_test_data():
    cursor.execute("DELETE FROM pet_weights")
    cursor.execute("DELETE FROM pets")
    cursor.execute("DELETE FROM species")

    insert_into_species('dog', 2, 10)
    insert_into_species('cat', 1, 5)

    insert_into_pets("buddy", "dog", "black")
    insert_into_pets("bobby", "cat", "yellow")
    insert_into_pets("baulie", "dog", "red")

    insert_into_pet_weights('buddy', 2.5, '2024-02-10')
    insert_into_pet_weights('bobby', 3, '2024-02-10')
    insert_into_pet_weights('baulie', 7, '2024-02-10')

    insert_into_pet_weights('buddy', 2, '2024-02-15')
    insert_into_pet_weights('bobby', 3.5, '2024-02-15')
    insert_into_pet_weights('baulie', 9, '2024-02-15')

    insert_into_pet_weights('buddy', 4, '2024-03-05')
    insert_into_pet_weights('bobby', 5, '2024-03-05')
    insert_into_pet_weights('baulie', 3, '2024-03-05')

    insert_into_pet_weights('buddy', 4, '2024-03-08')
    insert_into_pet_weights('bobby', 5, '2024-03-08')

    insert_into_pet_weights('buddy', 4, '2024-03-14')
    insert_into_pet_weights('baulie', 3, '2024-03-14')

    insert_into_pet_weights('bobby', 5, '2024-03-19')
    insert_into_pet_weights('baulie', 3, '2024-03-19')

    insert_into_pet_weights('buddy', 4, '2024-03-21')
    insert_into_pet_weights('bobby', 5, '2024-03-21')
    insert_into_pet_weights('baulie', 3, '2024-03-21')
