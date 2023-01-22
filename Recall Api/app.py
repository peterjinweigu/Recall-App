from flask import Flask, render_template, request, url_for, flash, redirect, jsonify
import face_detection, sqlite3
from flask_cors import CORS
import json

app = Flask(__name__)

CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/insert/', methods=['POST'])
def insert():
    if request.method == 'POST':
        a = json.loads(request.data)['1']
        b = json.loads(request.data)['2']
        conn = get_db_connection()
        conn.execute('INSERT INTO labels VALUES (?, ?)',
                         (a, b))
        conn.commit()
        conn.close()
        return jsonify({True : "Complete"})

@app.route('/grab/', methods=['POST'])
def grab():
     if request.method == 'POST':
        a = json.loads(request.data)['1']
        ret = face_detection.main(a)
        if type(ret) == str:
            return jsonify({1 : True, 2 : ret})
        else:
            return jsonify({1 : False})


