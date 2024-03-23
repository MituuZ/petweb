import sqlite3

from db.setup_database import setup_database, insert_into_pet_weights
from flask import Flask, render_template, jsonify, request

try:
    from config.config import Config
except ImportError:
    from config.config_example import Config

app = Flask(__name__)


def get_db_con():
    return sqlite3.connect(Config.DATABASE_NAME)


@app.route('/get-weights', methods=['GET'])
def get_weights():
    conn = get_db_con()
    items = conn.execute("""
        SELECT pw.name, pw.weight, pw.date, p.species FROM pet_weights pw, pets p where pw.name = p.name
    """).fetchall()
    conn.close()

    items = [dict(zip(['name', 'weight', 'date', 'species'], item)) for item in items]

    return jsonify(items)


@app.route('/get-pets', methods=['GET'])
def get_pets():
    conn = get_db_con()
    items = conn.execute('SELECT * FROM pets WHERE active = true').fetchall()
    conn.close()

    items = [dict(zip(['name', 'species', 'birth-day'], item)) for item in items]

    return jsonify(items)


@app.route('/get-colors', methods=['GET'])
def get_pet_colors():
    conn = get_db_con()
    pet_colors = conn.execute('SELECT color, name FROM pets').fetchall()
    conn.close()
    items = [dict(zip(['color', 'name'], col)) for col in pet_colors]
    return jsonify(items)


@app.route('/get-pet-names', methods=['GET'])
def get_pet_weights():
    conn = get_db_con()
    pets = conn.execute('SELECT distinct name FROM pets WHERE active = true').fetchall()
    conn.close()

    pets = [dict(zip(['name'], pet)) for pet in pets]

    return jsonify(pets)


@app.route('/insert-weights', methods=['POST'])
def insert_weights():
    for pet in request.json:
        conn = get_db_con()
        conn.execute('INSERT INTO pet_weights (name, weight) VALUES (?, ?)',
                     [pet['name'], pet['weight']])
        print(f"Inserted weight {pet['weight']} for {pet['name']}")
        conn.commit()
        conn.close()

    return jsonify({'status': 'ok'})


@app.route('/')
def home():
    conn = get_db_con()
    pets = conn.execute('SELECT distinct name FROM pets WHERE active = true').fetchall()

    pets = [item[0] for item in pets]
    return render_template('index.html', pets=pets)


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


if __name__ == '__main__':
    setup_database()
    app.run(host='0.0.0.0', port=8080)
