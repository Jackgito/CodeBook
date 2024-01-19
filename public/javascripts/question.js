import { setInitialButtonColors, setButtonColors } from './questionFunctions/voteButtonColors.js';
import { getCommentUserVote, getQuestionUserVote, checkMaxVotes, getTotalCommentVotes, getTotalQuestionVotes } from './questionFunctions/getVotes.js';
import { updateQuestionVotesToDB, updateCommentVotesToDB, saveCommentToDB } from './questionFunctions/updateDB.js';

document.addEventListener('DOMContentLoaded', function() {

  const userID = document.getElementById('userID').getAttribute('userID');
  const questionID = document.getElementById("questionID").getAttribute('questionID');
  const question = document.getElementById('question');

  let userAuthenticated = document.getElementById('isAuthenticated').getAttribute('isAuthenticated');
  let maxClicks = 50;
  let clickCount = 0;

  if (userAuthenticated == "true") {setInitialButtonColors(questionID, userID)};

  // This is used to fix frontend bug when voting
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  window.voteQuestion = async function (button) {
    // Check if user has logged in
    if (userAuthenticated == "false") {
      M.toast({ html: 'You must be logged in to vote.', classes:'red' });
      return;
    }
  
    // Check if user has voted too many times
    if (checkMaxVotes(clickCount, maxClicks)) {
      return;
    }
  
    let likeButton = document.querySelector(`.thumbsUp_-1`);
    let dislikeButton = document.querySelector(`.thumbsDown_-1`);
  
    let currentVote = await getQuestionUserVote(questionID, userID);
    let updatedVote = getUpdatedVote(button, currentVote);

    setButtonColors(updatedVote, likeButton, dislikeButton);
    await updateQuestionVotesToDB(updatedVote, userID, questionID);
  
    // Update frontend totals
    await delay(100); // This is used to fix the async bug
    let totalVotes = await getTotalQuestionVotes(questionID);
    console.log(totalVotes);
    // Update frontend totals
    document.getElementById("votes").innerText = totalVotes + " votes"
  };
  
  window.voteComment = async function (button) {
    // Check if user has logged in
    if (userAuthenticated == "false") {
      M.toast({ html: 'You must be logged in to vote.', classes:'red' });
      return;
    }

    // Check if user has voted too many times
    if (checkMaxVotes(clickCount, maxClicks)) {
      return;
    }

    // Get the comment index from the button's data attribute
    let commentIndex = button.dataset.commentIndex;
  
    // Select the vote up and vote down buttons for the specific comment
    let likeButton = document.querySelector(`.thumbsUp_${commentIndex}`);
    let dislikeButton = document.querySelector(`.thumbsDown_${commentIndex}`);
    let commentID = document.getElementById(`commentID_${commentIndex}`).getAttribute('commentID');
    
    let currentVote = await getCommentUserVote(commentID, userID, questionID);
    let updatedVote = getUpdatedVote(button, currentVote)

    setButtonColors(updatedVote, likeButton, dislikeButton);
    await updateCommentVotesToDB(updatedVote, userID, questionID, commentID);

    await delay(100); // This is used to fix the async bug
    let totalVotes = await getTotalCommentVotes(commentID, questionID);
    console.log(totalVotes);
    // Update frontend totals
    document.getElementById(`voteCountComment_${commentIndex}`).innerText = totalVotes + " votes"
  };

  window.editComment = async function (index) {
    const commentTextElement = document.querySelector(`#commentText_${index}`);
    const editCommentInputElement = document.querySelector(`#editComment_${index}`);

    commentTextElement.style.display = 'none'; // Hide comment text
    editCommentInputElement.style.display = 'block'; // Show edit comment input

    document.getElementById(`commentText_${index}`).style.display = 'none';
    document.getElementById(`editComment_${index}`).style.display = 'inline-block';

    document.getElementById("editCommentButton_" + index).style.display = 'none';
    document.getElementById("saveCommentButton_" + index).style.display = 'inline-block'; 
  }

  window.saveEditedComment = async function (index, comment, commentID) {
    // Update comment text and hide the input field
    const editedComment = document.getElementById(`editComment_${index}`).value;
    document.getElementById(`commentText_${index}`).innerHTML = editedComment;

    document.getElementById(`commentText_${index}`).style.display = 'inline-block';
    document.getElementById(`editComment_${index}`).style.display = 'none';

    document.getElementById("editCommentButton_" + index).style.display = 'inline-block';
    document.getElementById("saveCommentButton_" + index).style.display = 'none'; 
    saveCommentToDB(editedComment, commentID)
  }

  // Functionality for authenticated users (edit, delete)
  if (userAuthenticated == "true") {
    document.getElementById("commentForm").addEventListener("submit", function (event) {
      event.preventDefault();
    
      // Get values from HTML elements
      const commentValue = document.getElementById("comment").value;
      const usernameValue = document.getElementById("username").getAttribute("username");
    
      // Perform POST request
      fetch(`/questions/add/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentValue,
          username: usernameValue,
          questionID: questionID
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Handle the response if needed
          location.reload();
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });

    // Question editing and deletion
    if (userAuthenticated.username == question.author) {
      const deleteBtn = document.getElementById('deleteBtn');

      deleteBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to delete this question?')) {
          // User confirmed deletion, send delete request
          fetch(`/questions/delete/${questionID}`, {
            method: 'DELETE'
          })
          .then(response => {
            window.location.href = '/'; 
          })
          .catch(err => {
            console.error(err);
          });      
        }
      });

      const editBtn = document.getElementById('editBtn');
      editBtn.addEventListener('click', () => {
        window.location.href = `/questions/edit/${questionID}`;
      }); 
    }

    // Comment deletion 
    // Select all elements with the class 'deleteBtnComment'
    const deleteButtons = document.querySelectorAll('.deleteBtnComment');

    // Iterate through each delete button and attach the click event listener
    deleteButtons.forEach(deleteBtn => {
      deleteBtn.addEventListener('click', () => {
        // Extract the comment ID from the data attribute
        const commentID = deleteBtn.getAttribute('data-comment-id');

        if (confirm('Are you sure you want to delete this comment?')) {
          fetch(`/comments/delete/${questionID}/${commentID}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              window.location.reload();
            } else {
              console.error('Failed to delete comment');
            }
          })
          .catch(err => {
            console.error(err);
          });
        }
      });
    });
  }

  // Get vote value for the comment or question when voting
  function getUpdatedVote(button, currentVote) {

    // Check if the button has the "thumbsUp" class
    let hasThumbsUpClass = button.classList.contains("thumbsUp");
    
    // Check if the button has the "thumbsDown" class
    let hasThumbsDownClass = button.classList.contains("thumbsDown");
    clickCount++;

    if (hasThumbsUpClass) {
      if (currentVote === 1) {
        currentVote = 0;
      } else {
        currentVote = 1;
      }
    } else if (hasThumbsDownClass) {
      if (currentVote === -1) {
        currentVote = 0;
      } else {
        currentVote = -1;
      }
    }
    return currentVote;
  };
});