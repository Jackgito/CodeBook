import {getCommentUserVote, getQuestionUserVote} from './getVotes.js';

// Set vote button colors when page has loaded
export async function setInitialButtonColors(questionID, userID) {

  // Set question vote colors
  let currentVote = await getQuestionUserVote(questionID, userID);
  setButtonColors(currentVote, likeButton, dislikeButton);

  // Set comment vote colors
  // Get the total number of comments
  const allComments = document.querySelectorAll('.comment').length;

  // Iterate over each comment and apply setButtonColors
  for (let index = 0; index < allComments; index++) {
    // Get the like and dislike buttons for the current comment
    const likeButton = document.querySelector(`.thumbsUp_${index}`);
    const dislikeButton = document.querySelector(`.thumbsDown_${index}`);
    let commentID = document.getElementById(`commentID_${index}`).getAttribute('commentID');

    currentVote = await getCommentUserVote(commentID, userID, questionID);
    
    // Call the setButtonColors function for the current comment
    setButtonColors(currentVote, likeButton, dislikeButton);
  }
};

// Update vote button colors
export function setButtonColors(currentVote, likeButton, dislikeButton) {
  
  if (currentVote === 1) {
    likeButton.classList.add('green');
    dislikeButton.classList.remove('red');
    return;
  }

  if (currentVote === -1) {
    dislikeButton.classList.add('red');
    likeButton.classList.remove('green');
    return;
  }

  dislikeButton.classList.remove('red');
  likeButton.classList.remove('green');
};