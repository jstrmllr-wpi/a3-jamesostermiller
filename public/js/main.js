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
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
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

// 
const post_deleteRecipe = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
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
  const newRecipeCard = document.createElement('article')
  newRecipeCard.id = `recipe${newRecipe.index}`
  newRecipeCard.classList.add('recipe-card')
  newRecipeCard.classList.add('border')

  // Add title to recipe card
  const newTitle = document.createElement('h3')
  let text = document.createTextNode(`${newRecipe.name}`)
  newTitle.appendChild(text)
  newRecipeCard.appendChild(newTitle)

  // Add time info to recipe card
  const newTimeInfo = document.createElement('time-info')
  {
    // Add prep time
    let newTime = document.createElement('time-item');
    let text = document.createTextNode('Prep time');
    newTime.appendChild(text);
    let span = document.createElement('span');
    if(newRecipe.preptime){
      text = document.createTextNode(`${newRecipe.preptime} minutes`);
      span.appendChild(text);
    }
    newTime.appendChild(span);
    newTimeInfo.appendChild(newTime);
    
    // Add cook time
    newTime = document.createElement('time-item');
    text = document.createTextNode('Cook time');
    newTime.appendChild(text);
    span = document.createElement('span');
    if(newRecipe.cooktime){
      text = document.createTextNode(`${newRecipe.cooktime} minutes`);
      span.appendChild(text);
    }
    newTime.appendChild(span);
    newTimeInfo.appendChild(newTime);

    // Add total time
    newTime = document.createElement('time-item');
    text = document.createTextNode('Total time');
    newTime.appendChild(text);
    span = document.createElement('span');
    if(newRecipe.totaltime){
      text = document.createTextNode(`${newRecipe.totaltime} minutes`);
      span.appendChild(text);
    }
    newTime.appendChild(span);
    newTimeInfo.appendChild(newTime);
  }
  newRecipeCard.appendChild(newTimeInfo);
  
  // Add ingredients
  const newIngredients = document.createElement('ingredient-card');
  newIngredients.classList.add('border');
  text = document.createTextNode(`${newRecipe.ingredients}`);
  newIngredients.appendChild(text);
  newRecipeCard.appendChild(newIngredients);

  // Add steps
  const newSteps = document.createElement('step-card');
  newSteps.classList.add('border');
  text = document.createTextNode(`${newRecipe.steps}`);
  newSteps.appendChild(text);
  newRecipeCard.appendChild(newSteps);

  const deleteButtonWrapper = document.createElement('delete-wrapper')
  const deleteButton = document.createElement('input');
  deleteButton.setAttribute('type','button')
  deleteButton.setAttribute('value','Delete')
  deleteButtonWrapper.appendChild(deleteButton)
  newRecipeCard.appendChild(deleteButtonWrapper)
  deleteButton.onclick = post_deleteRecipe

  return newRecipeCard;
}

// function newTElement(type, text){
//   const element = document.createElement(type)
//   const textNode = document.createTextNode(text)
//   element.appendChild(textNode)
//   return element
// }