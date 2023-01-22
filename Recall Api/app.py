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
        print(json.loads(request.data)['1'])
        # conn = get_db_connection()
        # conn.execute('INSERT INTO labels VALUES (?, ?)',
        #                 (a, a))
        # conn.commit()
        # conn.close()
        return jsonify({True : "Complete"})

@app.route('/grab/', methods=['GET'])
def grab():
     if request.method == 'GET':
        ret = face_detection.main(a)
        if type(ret) == str:
            return jsonify({True : ret})
        else:
            return jsonify({False : ""})


