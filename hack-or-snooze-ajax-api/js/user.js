"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

//Taking the info from the story form, turning it into a story variable and pushing it into the user's own stories
// Reloading the entire stories page as well
async function submitStory(evt){
  console.debug("submitStory", evt);
  evt.preventDefault();

  const aTitle = $("#story-title").val();
  const aUrl = $("#story-url").val();
  const aAuthor = $("#story-author").val();
  const aStory={
    title:aTitle,
    url:aUrl,
    author:aAuthor,
  };

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  let newStory = await storyList.addStory(currentUser,aStory);
  currentUser.ownStories.push(newStory);

  putStoriesOnPage();

  $addStory.trigger("reset");
}
$addStory.on("submit",submitStory);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */
// Since I'm using local storage to set the checked favorite flag on stories, when the user lgos in I add all their favorited stories to local storage.
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
    for(let stories of currentUser.favorites){
      localStorage.setItem(stories.storyId,"true");
    }
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */
//Added in appending the favorites and my stories section when the user logs on
function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story,false);
    $favorites.append($story);
  }
  for (let story of currentUser.ownStories){
    const $story = generateStoryMarkup(story,true);
    $myStory.append($story);
  }

  $allStoriesList.show();

  updateNavOnLogin();
}
// function triggers when the star is clicked on
// if it is already checked then remove it from the user, the api and local storage
// otherwise do the opposite
// then generate the favorites section again
async function favStory(evt){
  console.debug("starFav",evt);
  if(evt.currentTarget.classList.contains("checked")){
    currentUser= await User.removeFav(currentUser.loginToken,evt.currentTarget.parentElement.id,currentUser.username);
    localStorage.removeItem(evt.currentTarget.parentElement.id);
  }
  else{
    currentUser= await User.addFav(currentUser.loginToken,evt.currentTarget.parentElement.id,currentUser.username);
    localStorage.setItem(evt.currentTarget.parentElement.id,true);
  }
  $favorites.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story,false);
    $favorites.append($story);
  }

  $favorites.show();
  $(this).toggleClass("checked");
  //$(this).toggleClass("fa fa-star");
  //evt.class="fa fa-star checked";
}

//this needs to work on both the main page and the favorites page, so both get an event listener
$("#all-stories-list").on("click","#fav", favStory);
$favorites.on("click","#fav", favStory);

// When clicking the trash can in my stories, calls function to remove it from api then set a new list without it on user variable
// finish with removing the element
async function deleteStory(evt){
  console.debug("deleteStory",evt);
  let response= await User.removeStory(currentUser.loginToken,evt.currentTarget.parentElement.id);
  let newSelfStories=[];
  for(let story of currentUser.ownStories){
    if(evt.currentTarget.parentElement.id!=story.id){
      newSelfStories.push(story);
    }
  }
  currentUser.ownStories=newSelfStories;
  evt.currentTarget.parentElement.remove();
}

$myStory.on("click","#remove",deleteStory);
