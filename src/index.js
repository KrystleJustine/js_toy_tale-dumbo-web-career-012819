const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
let addToy = false;

// YOUR CODE HERE

//global variable that will look for the div of the toy collection
//helper method for like button.. find button for specific toy
const findToyCollectionDiv = document.querySelector('div#toy-collection');


// once the dom content is loaded run getToysFromServer method
document.addEventListener('DOMContentLoaded', () => {
  getToysFromServer()
})


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = 'block'
    toyForm.addEventListener('click', (e) => {
      if (e.target.value === "Create New Toy") {
        // if someone clicks on the ceate new toy button, assign information they pass
        // in as the value of name and image of the form
        const nameInput = document.getElementsByClassName('add-toy-form')[0].name.value
        const imageInput = document.getElementsByClassName('add-toy-form')[0].image.value
        addNewToy(nameInput, imageInput);
      }
      })
  } else {
    toyForm.style.display = 'none'
  }
});


// OR HERE!
// helper method that fetches the toys from the server
const getToysFromServer = () => {
  //get request from the server
  fetch ('http://localhost:3000/toys')
      // parses response to json function
      .then(response => response.json())
      // pass that toysOb into json function
      .then (function (toysObj){
        //iterate through array of toyobjects
          toysObj.forEach (function (toy){
            // call helper method and pass in the toy as object name it something
           const toyCard = createToyCard(toy)
              // find the div to pass in the new card with the toy information already
              // filled out
              findToyCollectionDiv.append(toyCard)
          })
          // run in console to check everything shows up..... do this before you make
          // DOMContentLoaded event listener so you dont have to refresh page everytime
      })
}

findToyCollectionDiv.addEventListener('click', function(e){
    // set up a listener for when someone clicks like
  if (e.target.innerText === "Like <3"){
      // look for target to equal like
     const toyCardDiv = e.target.parentElement
      // set toyCardDiv to the parent element
      const pTagToyCardDiv = toyCardDiv.querySelector('p')
      // select the p tag of THAT parent element... get the dataset from it
      let updatedLikeCount = parseInt(pTagToyCardDiv.dataset.likes) + 1;
     // increase the number of likes on that dataset
     //  pTagToyCardDiv.likes = updatedLikeCount;
      updateLikeCount(toyCardDiv.dataset.toyId, updatedLikeCount )
          .then(function(updatedToy) {
              pTagToyCardDiv.dataset.likes = updatedToy.likes
              pTagToyCardDiv.innerText = `${updatedToy.likes} Likes`
          })
      // pTagToyCardDiv.innerText = `${updatedLikeCount} Likes`
      // run helper function pass in parent element  of toyID and likes from pTag... what is shown that will be updated
  }
})

function updateLikeCount (toyId, toyLikes){
   return fetch(`http://localhost:3000/toys/${toyId}`, objPassedIntoFetch('PATCH', {likes:toyLikes}))
        .then (response => response.json())

}


// stick helper methods down here


// Setting up each toy card
function createToyCard(toyObj){
  // create the div the card will live in (stored in a variable)
  const toyCardDiv = document.createElement('div')
    // adds class name to Div... calls it 'card'.. reference readme step 3
    toyCardDiv.className = 'card'
    //storing the id as toyid
    toyCardDiv.dataset.toyId = toyObj.id
    // create all the elements inside the div
    // create h2 tag for the toy name
    const h2Tag = document.createElement('h2')
    // apply info we need to pass into h2 tag
    h2Tag.innerText = toyObj.name;
    // create img tag for the picture of each toy... we need the name of the object
    const imgTag = document.createElement('img')
    // apply url for picture of toy.. image has src attribute ... we need the image of the object
    imgTag.src = toyObj.image
    // add class to image tag.. refer to readme step 3
    imgTag.className = 'toy-avatar'
    // create ptage for paragraph
    const pTag = document.createElement('p')
    // apply text to the p tag use back ticks since the likes will change
    pTag.innerText = `${toyObj.likes} Likes`
    // applies dataset to ptag to keep count of likes
    pTag.dataset.likes = toyObj.likes
    // creates button for like
    const buttonTag = document.createElement('button')
    // add class name to button refer to readme step 3
    buttonTag.className = 'like-btn'
    // add inner text
    buttonTag.innerText = 'Like <3'

    // append all the elements we just made into div parent
    toyCardDiv.append(h2Tag,imgTag, pTag,buttonTag)

    return toyCardDiv;

}

function addNewToy(nameInput, imageInput){
  fetch('http://localhost:3000/toys', objPassedIntoFetch('post', toyAttirbutes(nameInput, imageInput)))
      .then(response => response.json())
      .then(function (parsedToy) {
        console.log(parsedToy)
      })


}
// set up helper method that will be part of an object passed into fetch method
// need to be overridded thats why we need a helper method instead of hard coding this part
function objPassedIntoFetch(method, body) {
  let requestToServerAttribute = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  }
   return requestToServerAttribute
}

function toyAttirbutes(nameInput, imageInput, likes = 0) {
  // save as a variable... return whole varable after setup
  // set likes to default 0;
    let objAtt = {
      'name': nameInput,
      'image': imageInput,
      'likes': likes
    }
    return objAtt;
}






