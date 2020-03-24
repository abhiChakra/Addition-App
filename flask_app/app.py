from flask import Flask, request, jsonify
from flask_app.storage import insert_calculation, get_calculations

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

@app.route('/data', methods=['POST'])
def data():
    calculations_history = []

    try:
        calculations = get_calculations()
        for key, value in calculations.items():
            calculations_history.append(value)
    
        return jsonify({'calculations': calculations_history}), 200
    except:
        return jsonify({'error': 'error fetching calculations history'}), 404

@app.route('/insert_nums', methods=['POST'])
def insert_nums():

    insert_nums = request.get_json()
    firstNum, secondNum = insert_nums['firstNum'], insert_nums['secondNum']

    answer = int(firstNum) + int(secondNum)

    try:
        insert_calculation(firstNum, secondNum, answer)
        return jsonify({'Response': 'Successfully inserted into DB'}), 200
    except:
        return jsonify({'Response': 'Unable to insert into DB'}), 404




        