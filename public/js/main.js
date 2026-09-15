window.onload = function() {
  fetch_allRecipes()

  const createform = document.querySelector('#create-recipe')
  createform.onsubmit = post_newRecipe
}

// Requests all of the preexisting recipe data
const fetch_allRecipes = async function( event ) {
  const response = await fetch( '/allrecipes', {
    method:'GET' 
  })

  const returnedtext = await response.text()

  allrecipes = JSON.parse( returnedtext )
  console.log( 'all recipes', allrecipes )

  const recipeList = document.getElementById('recipe-list')

  for(let recipe of allrecipes) {
    recipeList.appendChild(createHTMLRecipeCard(recipe));
  }
}

// Submits a new recipe to the server
const post_newRecipe = async function( event ) {
  // stop form submission from trying to load new page
  event.preventDefault()

  const name = document.querySelector( '#recipename' ),
        preptime = document.querySelector( '#preptime' ),
        cooktime = document.querySelector( '#cooktime' ),
        ingredients = document.querySelector( '#ingredients' ),
        steps = document.querySelector( '#steps' ),
        json = {name: name.value,
                preptime:preptime.valueAsNumber,
                cooktime:cooktime.valueAsNumber,
                ingredients:ingredients.value,
                steps:steps.value
              },
        body = JSON.stringify( json )

  const response = await fetch( '/newrecipe', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: body
  })

  const returnedtext = await response.text()
  // console.log( 'response:', returnedtext )

  newRecipe = JSON.parse( returnedtext )
  console.log( 'new recipe', newRecipe )
  console.log(`Recipe recieved: ${ newRecipe.name } ${ newRecipe.ingredients }`)

  const recipeList = document.getElementById('recipe-list')

  recipeList.appendChild(createHTMLRecipeCard(newRecipe))
}

// Asks the server to delete the recipe with the given ID
const post_deleteRecipe = async function( event ) {
  // stop form submission from trying to load new page
  event.preventDefault()

  recipeCard = event.target.parentElement.parentElement

  recipeId = recipeCard.id
  console.log('id: ', recipeId)
  index = parseInt(recipeId.charAt(recipeId.length - 1))
  console.log('index: ', index)

  body = JSON.stringify({index: index})

  const response = await fetch( '/deleterecipe', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: body
  })

  recipeCard.remove()
}

// Generates the HTML to hold a recipe
function createHTMLRecipeCard(newRecipe){
  // Create recipe card
  const newRecipeCard = newElem({
    type:'article',
    id:`recipe${newRecipe.index}`,
    classes:['recipe-card','border']
  })

  // Add title to recipe card
  newRecipeCard.appendChild(newElem({type:'h3', text:`${newRecipe.name}`}))

  // Add time info to recipe card
  const newTimeInfo = document.createElement('time-info')
  newTimeInfo.appendChild(newTimeElem('Prep time', newRecipe.preptime))
  newTimeInfo.appendChild(newTimeElem('Cook time', newRecipe.cooktime))
  newTimeInfo.appendChild(newTimeElem('Total time', newRecipe.totaltime))
  newRecipeCard.appendChild(newTimeInfo);
  
  // Add ingredients
  newRecipeCard.appendChild(newElem({
    type:'ingredient-card',
    text:`${newRecipe.ingredients}`,
    classes:['border']
  }))

  // Add steps
  newRecipeCard.appendChild(newElem({
    type:'step-card',
    text:`${newRecipe.steps}`,
    classes:['border']
  }))

  // Creates the delete button in a 100%-width wrapper
  const buttonWrapper = newElem({type:'button-wrapper'})
  const deleteButton = newElem({type:'input'});
  deleteButton.setAttribute('type','button')
  deleteButton.setAttribute('value','Delete')
  buttonWrapper.appendChild(deleteButton)
  newRecipeCard.appendChild(buttonWrapper)
  deleteButton.onclick = post_deleteRecipe

  return newRecipeCard;
}

// Returns a new html element with the given type, text, id, and classes (array)
function newElem({type, text, id, classes}){
  const element = document.createElement(type)
  if(text){
    const textNode = document.createTextNode(text)
    element.appendChild(textNode)
  }
  if(id){
    element.id=id
  }
  if(classes){
    for (let c of classes){
      element.classList.add(c)
    }
  }
  return element
}

// Creates a time-item with with the given label and "[time] minutes" in a span
function newTimeElem(label, time){
  let newTime = newElem({type:'time-item', text:label})
  let span = null
  if(time){
    span = newElem({type:'span', text:`${time} minutes`})
  }
  else {
    span = document.createElement('span')
  }
  newTime.appendChild(span)
  return newTime
}