/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable complexity */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
import React from "react"
import axios from 'axios'
import {StartListening, StopListening, Spoken, ReadAloud, compatible} from './SpeechRecognition'

export default class SousChef extends React.Component {
	constructor () {
		super()
		this.state = {
			recipeURL: '',
			ingredients: [],
			instructions: [],
			errorMessage: '',
			spokenCommand: '',
			readAloud: [],
			editingIngredientIndex: null,
			editingInstructionIndex: null,
			newIngredient: '',
			newInstruction: '',
			lookyWorky: false
		}
		this.updateRecipeURL = this.updateRecipeURL.bind(this)
		this.enableIngredient = this.enableIngredient.bind(this)
		this.enableInstruction = this.enableInstruction.bind(this)
		this.editIngredient = this.editIngredient.bind(this)
		this.editInstruction = this.editInstruction.bind(this)
		this.showSpokenCommand = this.showSpokenCommand.bind(this)
		this.showReadAloud = this.showReadAloud.bind(this)
		this.editNewIngredient = this.editNewIngredient.bind(this)
		this.addNewIngredient = this.addNewIngredient.bind(this)
		this.deleteIngredient = this.deleteIngredient.bind(this)
		this.editNewInstruction = this.editNewInstruction.bind(this)
		this.addNewInstruction = this.addNewInstruction.bind(this)
		this.deleteInstruction = this.deleteInstruction.bind(this)
		this.moveInstruction = this.moveInstruction.bind(this)
		this.changeLooky = this.changeLooky.bind(this)
	}

	async updateRecipeURL(ev) {
		const recipeURL = ev.target.value
		let errorMessage = ''
		let ingredients = []
		let instructions = []
		try {
			const recipeObject = (await axios.post('/', {recipeURL})).data
			ingredients = recipeObject.ingredients
			instructions = recipeObject.instructions
		} catch (err) {
			errorMessage = 'Something went wrong.'
			if(err.response.data.message) errorMessage = err.response.data.message
		}
		this.setState({...this.state, ingredients, instructions, errorMessage, recipeURL})
	}

	enableIngredient(editingIngredientIndex) {
		this.setState({...this.state, editingIngredientIndex})
	}

	editIngredient(ev, ix) {
		const { ingredients } = this.state
		const ingredient = ev.target.value
		ingredients[ix] = ingredient
		this.setState({...this.state, ingredients})
	}

	enableInstruction(editingInstructionIndex) {
		this.setState({...this.state, editingInstructionIndex})
	}

	editInstruction(ev, ix) {
		const { instructions } = this.state
		const instruction = ev.target.value
		instructions[ix] = instruction
		this.setState({...this.state, instructions})
	}

	showSpokenCommand(spokenCommand) {
		this.setState({...this.state, spokenCommand})
	}

	showReadAloud(readAloud) {
		this.setState({...this.state, readAloud})
	}

	editNewIngredient(ev) {
		const newIngredient = ev.target.value
		this.setState({...this.state, newIngredient })
	}

	addNewIngredient() {
		this.setState({...this.state, ingredients: [this.state.newIngredient, ...this.state.ingredients], newIngredient: ''})
	}

	deleteIngredient(ingredient) {
		this.setState({...this.state, ingredients: this.state.ingredients.filter(ing => ing !== ingredient)})
	}

	editNewInstruction(ev) {
		const newInstruction = ev.target.value
		this.setState({...this.state, newInstruction })
	}

	addNewInstruction() {
		this.setState({...this.state, instructions: [this.state.newInstruction, ...this.state.instructions], newInstruction: ''})
	}

	deleteInstruction(instruction) {
		this.setState({...this.state, instructions: this.state.instructions.filter(inst => inst !== instruction)})
	}

	moveInstruction(ix,amt) {
		const { instructions } = this.state
		const tempInst = instructions[ix]
		instructions[ix] = instructions[ix + amt]
		instructions[ix + amt] = tempInst
		this.setState({...this.state, instructions})
	}

	changeLooky() {
		this.setState({...this.state, lookyWorky: !this.state.lookyWorky})
	}

	render () {
		const { ingredients, instructions, errorMessage, editingIngredientIndex, editingInstructionIndex, spokenCommand, readAloud, newIngredient, newInstruction, lookyWorky } = this.state
		const { updateRecipeURL, enableIngredient, editIngredient, enableInstruction, editInstruction, showSpokenCommand, showReadAloud, editNewIngredient, addNewIngredient, deleteIngredient, editNewInstruction, addNewInstruction, deleteInstruction, moveInstruction, changeLooky } = this
		return (
			<div>
				<h1>Sous Chef</h1>
				<div id="howTo" onClick={changeLooky}>How Does It Work?</div>
				{
					compatible ?
					<div id="urlContainer">
						<input type="text" id="recipeURL" name="recipeURL" placeholder="Paste recipe URL here..." onChange={updateRecipeURL}/>
						{
							ingredients.length || instructions.length ?
							<div id="audioButtons">
								<StartListening
									ingredients={ingredients}
									instructions={instructions}
									showSpokenCommand={showSpokenCommand}
									showReadAloud={showReadAloud}
								/>
								<StopListening/>
							</div> :
							<div id="ownRecipe">Or make your own recipe to get started!</div>
						}
						{
							errorMessage.length ?
							<div id="errors">{errorMessage}</div>
							: null
						}
						{
							spokenCommand.length || readAloud.length ?
							<div id="writtenAudio">
								<Spoken spokenCommand={spokenCommand}/>
								<ReadAloud readAloud={readAloud}/>
							</div> : null
						}
					</div>
					:
					<div id="sorry">
						Sorry! Sous Chef is not compatible with your browser 😞
					</div>
				}
				<div id="recipeContainer">
					<div id="ingredContainer">
						<h2>Ingredients</h2>
						<div className="singleIngredient" >
							<input type="text" value={newIngredient} onChange={(ev)=>editNewIngredient(ev)}/>
							<button className="otherButton" onClick={addNewIngredient}>+</button>
						</div>
						{
						ingredients.length ?
								ingredients.map((ingredient,ix) => {
									return (
										<div className="singleIngredient" key={ix} >
											<input type="text" onChange={(ev)=>editIngredient(ev, ix)} value={ingredient} disabled={
												editingIngredientIndex === ix ? '' : 'disabled'
											}/>
											{
												editingIngredientIndex === ix ?
												<button className="otherButton" onClick={()=>enableIngredient(null)}>&#10003;</button> :
												<button className="otherButton" onClick={()=>enableIngredient(ix)}>&#10000;</button>
											}
											<button className="deleteButton" onClick={()=>deleteIngredient(ingredient)}>X</button>
										</div>
									)
								}) :
								null
							}
					</div>
					<div id="instrContainer">
						<h2>Instructions</h2>
						<div className="singleInstruction" >
							<textarea value={newInstruction} onChange={(ev)=>editNewInstruction(ev)}/>
							<button className="otherButton" onClick={addNewInstruction}>+</button>
						</div>
						{
						instructions.length ?
								instructions.map((instruction,ix) => {
									return (
										<div className="singleInstruction" key={ix} >
											<textarea onChange={(ev)=>editInstruction(ev, ix)}  value={instruction}
											disabled={
												editingInstructionIndex === ix ? '' : 'disabled'
											}/>
											{
												editingInstructionIndex === ix ?
												<button className="otherButton" onClick={()=>enableInstruction(null)}>&#10003;</button> :
												<button className="otherButton" onClick={()=>enableInstruction(ix)}>&#10000;</button>
											}
											<button className="deleteButton" onClick={()=>deleteInstruction(instruction)}>X</button>
											{ ix !== instructions.length - 1 ? <button className="otherButton" onClick={()=>moveInstruction(ix,1)}>&#9660;</button> : null }
											{ ix !== 0 ? <button className="otherButton" onClick={()=>moveInstruction(ix,-1)}>&#9650;</button> : null }
										</div>
									)
								}) :
								null
							}
						</div>
				</div>
				{ lookyWorky?
					<div id="lookyWorky">
						<p onClick={changeLooky} className="close">click to close</p>
						<h3>How To Use</h3>
						<p>
							Copy and paste the recipe URL from a <a href="https://github.com/jadkins89/Recipe-Scraper#supported-websites" target="_blank">supported website</a> into the Sous Chef URL bar (or make your own recipe!) and click the Listen button.
						</p>
						<p>
							Sous Chef will respond to commands beginning with the phrase "Sous Chef" and in one of two formats:
						</p>
						<p>
						1. "Sous Chef *ingredient*" where *ingredient* is the name of one of the ingredients in your recipe.
						</p>
						<p>
							**** example inputs: "Sous Chef Carrots" or "Sous Chef Flour"
						</p>
							**** example outputs: "three carrots, diced" or "two cups whole wheat flour"
						<p>
							2. "Sous Chef Step *number*" where *number* is the number of one of the steps in the recipe instructions
						</p>
						<p>
							**** example inputs: "Sous Chef Step One" or "Sous Chef Step Five"
						</p>
						<p>
							**** example outputs: "Sautee garlic over medium heat" or "Add parsley to garnish"
						</p>
						<p>
							Sous Chef will respond to these commands by reading the ingredient or recipe step aloud. That's it!
						</p>
						<h3>Credit</h3>
						<p>Sous Chef really ain't much. It relies on:</p>
						<p><a href="https://github.com/TalAter/annyang/" target="_blank">Annyang</a> for speech recognition</p>
						<p><a href="https://github.com/jadkins89/Recipe-Scraper" target="_blank">Recipe-Scraper</a> for recipe parsing</p>
						<p><a href="https://gist.github.com/woollsta/2d146f13878a301b36d7#file-chunkify-js" target="_blank">SpeechUtteranceChunker</a> to process text-to-speech</p>
						<p><a href="https://github.com/adam-adair/SousChef">Git repo for Sous Chef</a></p>
					</div> : null }
			</div>
		)
	}
}
