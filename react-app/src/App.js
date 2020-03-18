import React from 'react';

class AdditionApp extends React.Component {
/*
  Component renders our main frontend and fetches http requests to our flask 
  server. Requests are proxied to backend api using Nginx.
*/
  constructor(props){
    super(props);
    this.state = {
      firstNumber : 0, 
      secondNumber: 0,
      answer: 0
    }
  }

  onFirstNumChange(event){
    this.setState({firstNumber: event.target.value})
  }

  onSecondNumChange(event){
    this.setState({secondNumber: event.target.value})
  }

  onCalculateValues(event){
    event.preventDefault();
    const operands = {firstNum: this.state.firstNumber, secondNum: this.state.secondNumber}

    fetch('http://localhost:8080/api/calculate', {method: 'POST',
                                             mode: 'cors',
                                             headers: {
                                              'Content-Type' : 'application/json'
                                              },
                                             body: JSON.stringify(operands)
                                            }
        ).then((response) => {
          if(response.status == 200){
            response.json().then((ans) => {
              this.setState({answer: ans.answer})
            })
          } else{
            response.json().then((ans) => {
              this.setState({answer: ans.error})
            })
          }
        })
  }

  render() {
    return(
      <form method='GET'>
        <div>
          <FirstNumber onFirstChange = {(event) => this.onFirstNumChange(event)}/>
        </div>
        <div>
          <p>+</p>
        </div>
        <div>
          <SecondNumber onSecondChange = {(event) => this.onSecondNumChange(event)}/>
        </div>
        <div>
          <Calculate onCalculateClick = {(event) => this.onCalculateValues(event)}/>
        </div>

        <div>
          <Answer answerNumber={this.state.answer}/>
        </div>
      </form>
    )
  }
}

function FirstNumber(props){
  return(
    <input placeholder='0' onChange={props.onFirstChange}></input>
  )
}

function SecondNumber(props){
  return(
    <input placeholder='0' onChange={props.onSecondChange}></input>
  )
}

function Calculate(props){
  return(
    <button onClick={props.onCalculateClick}>Calculate!</button>
  )
}

function Answer(props){
  return(
  <p>{props.answerNumber}</p>
  )
}

export default AdditionApp;
