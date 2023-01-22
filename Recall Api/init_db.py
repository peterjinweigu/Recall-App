import sqlite3

connection = sqlite3.connect('database.db')

cur = connection.cursor()

cur.execute("DROP TABLE IF EXISTS labels")

cur.execute("CREATE TABLE labels(name, img)")

connection.commit()
connection.close()