/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import React from "react"
import annyang from 'annyang'
import textNumbers from '../../textNumbers'
import textToSpeech from './TextToSpeech'

export const compatible = !!annyang

export default class SpeechRecognition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isListening: false
    }
    this.startListening = this.startListening.bind(this)
    this.stopListening = this.stopListening.bind(this)
    this.sousChef = this.sousChef.bind(this)
  }

  sousChef(inp) {
    const { showReadAloud, showSpokenCommand, ingredients, instructions } = this.props
    let readAloud = ["Sorry, I don't find that ingredient."]
    showSpokenCommand(inp)
    inp = inp.toLowerCase()
    const spokenIngredients = ingredients.filter(ing => ing.toLowerCase().includes(inp))
    if(spokenIngredients.length > 0) {
      console.log('ingredients:', spokenIngredients)
      readAloud = spokenIngredients
    } else if(inp.includes('step')) {
      const possibleTextNumber = inp.slice(5).trim()
      const requestedStep = textNumbers[possibleTextNumber] ?
      textNumbers[possibleTextNumber] :
      inp.replace(/[^0-9]/g, "")
      console.log('step:', requestedStep)
      if(instructions[requestedStep - 1]) {
        readAloud = instructions[requestedStep - 1]
      } else readAloud = ["Sorry, I don't find that step."]
    }
    showReadAloud(readAloud)
    textToSpeech(readAloud, annyang)
  }

  startListening () {
    const commands = {'sous chef *item': this.sousChef}
    annyang.debug();
    annyang.addCommands(commands);
    annyang.setLanguage('en');
    annyang.start();
    this.setState({...this.state, isListening: true})
  }

  stopListening () {
    annyang.abort()
    this.setState({...this.state, isListening: false})
  }

  render() {
    return (
      <div id="audioButtons">
        { !this.state.isListening ? <button id="listen" onClick={this.startListening}>Start Listening</button> :
        <button id="stop" onClick={this.stopListening}>Stop Listening</button> }
      </div>
    )
  }
}

export const Spoken = ({spokenCommand}) => <div id="spoken">{spokenCommand.length ? `Sous Chef: ${spokenCommand}` : null}</div>

export const ReadAloud = ({readAloud}) => <div id="read">{readAloud.length ? `${readAloud}` : null}</div>
