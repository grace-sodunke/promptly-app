from flask import Flask, request, jsonify
import search
from flask_cors import CORS
import sheet_api

app = Flask(__name__)
# allow requests from any origin to any endpoint by adding CORS headers to responses
CORS(app)

sheet_id = ''

sheet = sheet_api.init_sheet()

@app.route('/')
def index():
    return 'Welcome to the Promptly backend'

@app.route('/api/getBestPrompts', methods=['POST','OPTIONS'])
def get_data():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['mode'] = 'no-cors'
        return response
    else:
        incoming_data = request.json
        print("Received data:", incoming_data)
    data = search.query(incoming_data, sheet_api.sheet_to_dataframe(sheet, sheet_id))
    print(f"data from search query: {data.to_json(orient='records')}")
    return data.to_json(orient="records")

@app.after_request
def add_CORS_headers(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.status_code = 200

    return response

@app.route('/api/postPromptFeedback', methods=['POST'])
def add_data():
    data = request.json
    prompt = data.get('prompt')
    promptRating = data.get('promptRating')
    embedding = str(search.get_embedding(prompt))
    popularity = 0
    age_range = 0
    location = "Earth"
    writtenFeedback = data.get('writtenFeedback')

    # if "" in [prompt, satisfaction, embedding, popularity, age_range, location, comment]:
    #     return jsonify({"error": "Missing data"}), 400
    # print(f"{prompt}, {promptRating}, {embedding}, {popularity}, {age_range}, {location}, {writtenFeedback}")
    result = sheet_api.append_to_sheet(sheet, sheet_id, [prompt, promptRating, embedding, popularity, age_range, location, writtenFeedback], sheet_name='Sheet2')
    return jsonify({"success": True})



# Simple POST request
@app.route('/api/setData', methods=['POST'])
def set_data():
    incoming_data = request.json
    print("Received data:", incoming_data)
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    #print(sheet_api.add_embeddings(sheet, sheet_id))
    app.run(host='0.0.0.0')
