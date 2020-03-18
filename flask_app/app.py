from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "My Addition App", 200

@app.route('/calculate', methods=['POST'])
def calculate():
    '''
        This http endpoint recieves the data (specifically operands) from our
        frontend react webserver proxied to it and returns either the answer or
        in the case that the operands are not numbers, returns an error message. 
    '''
    nums = request.get_json()
    firstNum = nums['firstNum']
    secondNum = nums['secondNum']

    try:
        firstNum, secondNum = int(firstNum), int(secondNum)
        answer = firstNum + secondNum
        return jsonify({'answer':answer}), 200

    except ValueError:
        return jsonify({'error': 'Must enter valid integers'}), 404
        