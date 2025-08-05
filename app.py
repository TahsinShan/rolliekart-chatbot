from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

API_TOKEN = os.environ.get("API_TOKEN", "afllm_lQK0LNDGyrzKa2fCDDBMsiDVVsiwt5iA")

API_URL = "https://apifreellm.com/api/chat"
headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
    "X-Request-Source": "external-api"
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({'reply': 'No message received'}), 400

    payload = {
        "message": user_message
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        reply = result.get('response', 'Sorry, I could not understand.')

        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
