import React from 'react';

class AdditionApp extends React.Component {
/*
  Component renders our main frontend and fetches http requests to our flask 
  server. Requests are reverse proxied to backend api using Nginx.
*/
  constructor(props){
    super(props);
    this.state = {
      firstNumber : 0, 
      secondNumber: 0,
      answer: 0,
      historical_data: null,
    }
  }

  onFirstNumChange(event){
    this.setState({firstNumber: event.target.value})
  }

  onSecondNumChange(event){
    this.setState({secondNumber: event.target.value})
  }

  insertCalculation(event, calculation){
  /*
    Making a POST request via a fetch call to Flask API with numbers of a
    calculation we want to insert into DB. Making fetch call to web server
    IP with /api/insert_nums which will be reverse proxied via Nginx to the
    Application (Flask) server.
  */
    event.preventDefault();

    fetch('http://34.66.13.114:8080/api/insert_nums', {method: 'POST',
                                                    mode: 'cors',
                                                    headers: {
                                                    'Content-Type' : 'application/json'
                                                    },
                                                    body: JSON.stringify(calculation)}
     ).then((response) => {
       if(response.status === 200){
         response.json().then(
            data => console.log(data['Response'])
         )
       } else{
          response.json().then(
            data => console.log(data['Response'])
         )
       }
     }).catch((error) => {
       console.log('Error in inserting nums', error)
     })
  }

  onCalculateValues(event){
    event.preventDefault();
    let operands = {firstNum: this.state.firstNumber, secondNum: this.state.secondNumber, answer: null}

    if(isNaN(parseInt(operands.firstNum)) || isNaN(parseInt(operands.secondNum))){
      this.setState({answer: "Must enter valid number"})
    } else{
      let calculationAnswer = parseInt(operands.firstNum) + parseInt(operands.secondNum)

      this.setState({answer: calculationAnswer})

      operands.answer = calculationAnswer

      this.insertCalculation(event, operands)
    }
  }

  showHistory(event){
    event.preventDefault()

    this.setState({historical_data: "loading data"})
    
    this.getHistory(event)
  }

  closeHistory(event){
    event.preventDefault()

    this.setState({historical_data: null})
  }

  getHistory(event){
    /*
        Making a GET request via a fetch call to Flask API to retrieve calculations history.
    */

    event.preventDefault()

    fetch('http://34.66.13.114:8080/api/data', {method: 'GET',
                                             mode: 'cors'
                                          }
    ).then(response => {
      if(response.status === 200){
        (response.json()).then((data) => {
          this.setState({historical_data: data['calculations']})
        })
      } else{
        (response.json()).then((data) => {
          this.setState({answer: data['error']})
          return null
        })
      }
    }).catch((error) => {
        console.log("Error in fetching calculations history.", error)
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
        <div>
          <ShowHistory
          data={this.state.historical_data}
          closeHistory={(event)=> this.closeHistory(event)}
          showHistory={(event) => this.showHistory(event)}
          getHistory = {(event) => this.getHistory(event)}/>
        </div>
        <div>
          <History data={this.state.historical_data}/>
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

function ShowHistory(props){
  if(props.data !== null){
    return(
      <button onClick={props.closeHistory}>Close history</button>
    )
  } else{
    return(
      <button onClick={props.showHistory}>Show history</button>
    )
  }
}

function History(props){
  if(props.data !== null && props.data !== "loading data"){
    return props.data.map((nums) => {
        let operands = nums[0].toString() + ' + ' + nums[1].toString() + ' = ' + nums[2].toString()
        return(
            <div>{operands}</div>
        )
    })
  } else if(props.data === "loading data"){
    return(
      <div>loading history...</div>
    )
  }else{
    return(
      <div>History of calculations</div>
    )
  }
}

export default AdditionApp;
