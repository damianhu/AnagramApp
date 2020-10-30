from flask import Flask
from model import isAnagram
import psycopg2

app = Flask(__name__)

conn = psycopg2.connect(dbname="postgres", user="postgres",
                        password="123", host="127.0.0.1", port="5432") #link to postgresql database
cur = conn.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS words (" + "\n"
            + "anagram varchar(255) PRIMARY KEY," + "\n"
            + "totalnum INT" + "\n"
                               ");") #if table not exist, create one
conn.commit()


@app.route('/compare/<string1>/<string2>') #compare two anagram
def show_res(string1, string2):
    res = isAnagram(string1, string2)
    anagramword = string1 + '+' + string2

    print(anagramword)
    if res:
        cur.execute(
            "Insert INTO words (anagram, totalnum) values(" + "'" + anagramword + "'" + ", 1) ON CONFLICT(anagram) DO UPDATE SET totalnum = words.totalnum+1;")
        conn.commit()
        return 'isAnagram'

    return 'notAnagram'


@app.route('/topten') #fetch the data of topten anagram
def show_topten():

    cur.execute("SELECT anagram FROM words ORDER BY totalnum DESC limit 10;")
    rows = cur.fetchall()
    res = ""
    for row in rows:
        res += '#' + str(row[0])

    return res


