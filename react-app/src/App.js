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
      answer: 0,
      show_historical_data: false,
      historical_data: null
    }
  }

  onFirstNumChange(event){
    this.setState({firstNumber: event.target.value})
  }

  onSecondNumChange(event){
    this.setState({secondNumber: event.target.value})
  }

  insertCalculation(event, operands){

    event.preventDefault();

    fetch('http://localhost:8080/api/insert_nums', {method: 'POST',
                                                    mode: 'cors',
                                                    headers: {
                                                    'Content-Type' : 'application/json'
                                                    },
                                                    body: JSON.stringify(operands)}
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
    let operands = {firstNum: this.state.firstNumber, secondNum: this.state.secondNumber}

    fetch('http://localhost:8080/api/calculate', {method: 'POST',
                                             mode: 'cors',
                                             headers: {
                                              'Content-Type' : 'application/json'
                                              },
                                             body: JSON.stringify(operands)
                                            }
        ).then((response) => {
          if(response.status === 200){
            response.json().then((ans) => {
              this.setState({answer: ans.answer})
            })

            this.insertCalculation(event, operands)

          } else{
            response.json().then((ans) => {
              this.setState({answer: ans.error})
            })
          }
        }).catch((error) => {
          console.log("Error in fetching answer.", error)
        })
  }

  showHistory(event){
    event.preventDefault()

    this.getHistory(event)

    this.setState({show_historical_data: true})
  }

  closeHistory(event){
    event.preventDefault()

    this.setState({show_historical_data: false, historical_data: null})
  }

  getHistory(event){

    event.preventDefault()

    fetch('http://localhost:8080/api/data', {method: 'POST',
                                             mode: 'cors'
                                          }
    ).then(response => {
      if(response.status === 200){
        (response.json()).then((data) => {
          console.log(data)
          this.setState({historical_data: data['calculations']})
        })
      } else{
        (response.json()).then((data) => {
          this.setState({answer: data['error']})
          this.setState({show_historical_data: false})
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
          <ShowHistory history={this.state.show_historical_data} 
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
  if(props.history){
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
  if(props.data !== null){
//    data = props.getHistory()
//    console.log(data)
//    operands = data["calculations"]
    return props.data.map((nums) => {
        let operands = nums[0].toString() + ' + ' + nums[1].toString() + ' = ' + nums[2].toString()
        return(
            <div>{operands}</div>
        )
    })
  } else{
    return(
      <div>"History of calculations"</div>
    )
  }
}

export default AdditionApp;
