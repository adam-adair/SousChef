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

	render () {
		const { ingredients, instructions, errorMessage, editingIngredientIndex, editingInstructionIndex, spokenCommand, readAloud, newIngredient, newInstruction } = this.state
		const { updateRecipeURL, enableIngredient, editIngredient, enableInstruction, editInstruction, showSpokenCommand, showReadAloud, editNewIngredient, addNewIngredient, deleteIngredient, editNewInstruction, addNewInstruction, deleteInstruction, moveInstruction } = this
		return (
			<div>
				<h1>Sous Chef</h1>
				<div id="howTo">How To</div>
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
						<Spoken spokenCommand={spokenCommand}/>
						<ReadAloud readAloud={readAloud}/>
					</div>
					:
					<div id="sorry">
						Sorry! Sous Chef is not compatible with your browser 😞
					</div>
				}

				<div id="ingredContainer">
					<h2>Ingredients</h2>
					<div className="singleIngredient" >
						<input type="text" value={newIngredient} onChange={(ev)=>editNewIngredient(ev)}/>
						<button className="addButton" onClick={addNewIngredient}>Add</button>
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
											<button className="doneButton" onClick={()=>enableIngredient(null)}>Done</button> :
											<button className="editButton" onClick={()=>enableIngredient(ix)}>Edit</button>
										}
										<button onClick={()=>deleteIngredient(ingredient)}>Delete</button>
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
						<button className="addButton" onClick={addNewInstruction}>Add</button>
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
											<button onClick={()=>enableInstruction(null)}>Done</button> :
											<button onClick={()=>enableInstruction(ix)}>Edit</button>
										}
										<button onClick={()=>deleteInstruction(instruction)}>Delete</button>
										{ ix !== instructions.length - 1 ? <button onClick={()=>moveInstruction(ix,1)}>Down</button> : null }
										{ ix !== 0 ? <button onClick={()=>moveInstruction(ix,-1)}>Up</button> : null }
									</div>
								)
							}) :
							null
						}
					</div>
			</div>
		)
	}
}
