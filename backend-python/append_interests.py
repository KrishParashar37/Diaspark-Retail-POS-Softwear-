
with open('app.py', 'a', encoding='utf-8') as f:
    f.write('\n\n@app.route("/api/interests", methods=["GET"])\n')
    f.write('def get_interests():\n')
    f.write('    conn = get_db_connection()\n')
    f.write('    cursor = conn.cursor()\n')
    f.write('    cursor.execute("SELECT code, name FROM Interests")\n')
    f.write('    rows = rows_to_dicts(cursor)\n')
    f.write('    conn.close()\n')
    f.write('    return jsonify(rows)\n')
