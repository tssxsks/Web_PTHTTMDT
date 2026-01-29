# BE/Chatbot/app.py
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint to handle chat requests from the frontend.
    """
    data = request.get_json()
    user_message = data.get('message', '')

    # TODO:
    # 1. Classify intent using classifier.py
    # 2. If product query, use productQuery.py to search
    # 3. If general query, use RAG with Gemini
    # 4. Generate a response

    response_message = f"Received your message: '{user_message}'. I am still under development."

    return jsonify({'reply': response_message})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
