"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

/**
 * generateStoryMarkup is a bit of a mess
 * added isSelf to the params, not intuitivly named but I needed a way to mark sotries that would have the trash icon for my stories
 * if isSelf is true then they'll have a trash can instead of a star
 * 
 * Checks localstorage to see if a story has been favorited to pre check them
 * 
 * added <ul> so I could more easily stack the elements and give them a border
 */
function generateStoryMarkup(story,isSelf) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // console.log($(story.storyId));
  if(isSelf){
    return $(`
    <li id="${story.storyId}">
    <ul>
    <li>
    <i class="fa fa-star" id="remove" ></i>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
          <small class="story-hostname">(${hostName})</small></li>
      <li><small class="story-author">by ${story.author}</small></li>
      <li><small class="story-user">posted by ${story.username}</small></li>
      </ul>
    </li>
  `);
  }
  else if(localStorage.getItem(story.storyId)==="true"){
    return $(`
    <li id="${story.storyId}">
    <ul>
    <li>
    <i class="fa fa-star checked" id="fav" ></i>
      <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
        <small class="story-hostname">(${hostName})</small></li>
    <li><small class="story-author">by ${story.author}</small></li>
    <li><small class="story-user">posted by ${story.username}</small></li>
    </ul>
  `);
  }
  else{
    return $(`
    <li id="${story.storyId}">
    <ul>
    <li>
    <i class="fa fa-star" id="fav" ></i>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
           <small class="story-hostname">(${hostName})</small></li>
      <li><small class="story-author">by ${story.author}</small></li>
      <li><small class="story-user">posted by ${story.username}</small></li>
      </ul>
    </li>
  `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story,false);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
