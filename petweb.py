from db.setup_database import setup_database
from flask import Flask, render_template


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


if __name__ == '__main__':
    setup_database()
    app.run(host='0.0.0.0', port=8080)
