/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import React from "react"
import annyang from 'annyang'
import textNumbers from '../../textNumbers'
import textToSpeech from './TextToSpeech'

export const compatible = !!annyang

export const StartListening = ({ ingredients, instructions, showSpokenCommand, showReadAloud }) => {
  const startListening = () => {
    const sousChef = inp => {
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

    const commands = {'sous chef *item': sousChef}
    annyang.debug();
    annyang.addCommands(commands);
    annyang.setLanguage('en');
    annyang.start();
  }

  return <button id="listen" onClick={startListening}>Start Listening</button>
}

const stopListening = () => annyang.abort()

export const StopListening = () => {
  return <button id="stop" onClick={stopListening}>Stop Listening</button>
}


export const Spoken = ({spokenCommand}) => <div id="spoken">{spokenCommand.length ? `Sous Chef: ${spokenCommand}` : null}</div>

export const ReadAloud = ({readAloud}) => <div id="spoken">{readAloud.length ? `${readAloud}` : null}</div>
