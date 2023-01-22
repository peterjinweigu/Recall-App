import face_detection
import sqlite3
from io import BytesIO
import base64

cur = sqlite3.connect("database.db")

print(cur.execute("SELECT name, img FROM labels").fetchall())

# cur.execute('INSERT INTO labels VALUES (?, ?)',
#                         ("Peter", base64.encodebytes(open("4.jpg", "rb").read())))

# cur.commit()

# cur.close()   

# print(face_detection.main(base64.encodebytes(open("7.jpg", "rb").read())))

