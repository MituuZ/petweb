import sqlite3

from db.setup_database import setup_database
from flask import Flask, render_template, jsonify

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
    items = conn.execute('SELECT * FROM pet_weights').fetchall()
    conn.close()

    items = [dict(zip(['name', 'weight', 'date'], item)) for item in items]

    return jsonify(items)


@app.route('/get-pets', methods=['GET'])
def get_pets():
    conn = get_db_con()
    items = conn.execute('SELECT * FROM pets WHERE active = true').fetchall()
    conn.close()

    items = [dict(zip(['name', 'species', 'birth-day'], item)) for item in items]

    return jsonify(items)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


if __name__ == '__main__':
    # setup_database()
    app.run(host='0.0.0.0', port=8080)
