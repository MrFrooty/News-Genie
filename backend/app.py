from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/news', methods=['GET'])
def get_news():
    news = [
        {"title": "Sample News 1", "description": "Description 1", "url": "http://example.com/1"},
        {"title": "Sample News 2", "description": "Description 2", "url": "http://example.com/2"},
    ]
    return jsonify(news)

if __name__ == '__main__':
    app.run(debug=True)