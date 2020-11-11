# Sous Chef
Can't remember how many teaspoons of cumin to add to the pot but don't want to touch the computer with your garlic encrusted fingers?

Enter Sous Chef.

## How To Use

Copy and paste your recipe URL into the Sous Chef URL bar (or make your own recipe!) and click the Listen button.

Sous Chef will respond to commands beginning with the phrase "Sous Chef" and in one of two formats:

* "Sous Chef *ingredient*" where *ingredient* is the name of one of the ingredients in your recipe.
  * example inputs: "Sous Chef Carrots" or "Sous Chef Flour"
  * example outputs: "three carrots, diced" or "two cups whole wheat flour"
* "Sous Chef Step *number*" where *number* is the number of one of the steps in the recipe instructions
  * example inputs: "Sous Chef Step One" or "Sous Chef Step Five"
  * example outputs: "Sautee garlic over medium heat" or "Add parsley to garnish"

Sous Chef will respond to these commands by reading the ingredient or recipe step aloud. That's it!

## Installation Instructions

Install and start:  
`npm i`  
`npm start`  

## Credit

Sous Chef really ain't much. It relies on:  
[Annyang](https://github.com/TalAter/annyang/) for speech recognition  
[Recipe-Scraper](https://github.com/jadkins89/Recipe-Scraper) for recipe parsing  
[SpeechUtteranceChunker](https://gist.github.com/woollsta/2d146f13878a301b36d7#file-chunkify-js) to process text-to-speech  

## Limitations

Recipes are limited to those from [supported websites](https://github.com/jadkins89/Recipe-Scraper#supported-websites).  
Speech recognition uses a [library](https://github.com/TalAter/annyang/) that relies on the browser's built-in speech recognition API. It doesn't seem to work on iOS devices at all, and Chrome on Android is a little bit flakey 😞

## Try It, I Guess

[http://souschefspeaks.herokuapp.com/](http://souschefspeaks.herokuapp.com/)
