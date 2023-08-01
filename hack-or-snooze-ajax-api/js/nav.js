"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


// show add story on click
function navAddClick(evt){
  console.debug("navAddClick",evt);
  hidePageComponents();
  $addStory.show();
}
$navAdd.on("click",navAddClick);

function navFavClick(evt){
  console.debug("navFavClick",evt);
  hidePageComponents();
  $favorites.show();
}
$navFav.on("click",navFavClick);

function navMineClick(evt){
  console.debug("navMineClick",evt);
  hidePageComponents();
  $myStory.show();
}
$navMine.on("click",navMineClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  hidePageComponents();
  putStoriesOnPage();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
