document.addEventListener('DOMContentLoaded', function() {
  const userID = document.getElementById('userID').getAttribute('userID');
  const questionID = document.getElementById("questionID").getAttribute('questionID');
  const likeButton = document.getElementById('likeButton')
  const dislikeButton = document.getElementById('dislikeButton')
  const question = document.getElementById('question');

  let userAuthenticated = document.getElementById('isAuthenticated').getAttribute('isAuthenticated');
  let maxClicks = 10;
  let clickCount = 0;

  // Set initial button colors
  const setInitialButtonColors = async () => {

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

  if (userAuthenticated == "true") { setInitialButtonColors(questionID, userID, likeButton, dislikeButton)};

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
    let totalVotes = parseInt(document.getElementById('votes').innerText);

    setButtonColors(updatedVote, likeButton, dislikeButton);
    updateQuestionVotesToDB(updatedVote, userID, questionID);
  

    // Update frontend totals
    if (currentVote == 0) {
      document.getElementById('votes').innerText = totalVotes + updatedVote + ' votes';
    } else if (currentVote == -1) {
      document.getElementById('votes').innerText = totalVotes + 1 + updatedVote + ' votes';
    } else {
      document.getElementById('votes').innerText = totalVotes - 1 - updatedVote + ' votes';
    }
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
    let totalVotes = parseInt(document.getElementById(`voteCountComment_${commentIndex}`).innerText);

    setButtonColors(updatedVote, likeButton, dislikeButton);
    updateCommentVotesToDB(updatedVote, userID, questionID, commentID);

    // Update frontend totals
    if (currentVote == 0) {
      document.getElementById(`voteCountComment_${commentIndex}`).innerText = totalVotes + updatedVote + ' votes';
    } else if (currentVote == -1) {
      document.getElementById(`voteCountComment_${commentIndex}`).innerText = totalVotes + 1 + updatedVote + ' votes';
    } else {
      document.getElementById(`voteCountComment_${commentIndex}`).innerText = totalVotes - 1 - updatedVote + ' votes';
    }
  };
  
  // Saves question votes to database
  async function updateQuestionVotesToDB(currentVote, userID, questionID) {
    const request = {
      currentVote: currentVote,
      questionID: questionID,
      userID: userID,
    }
    fetch("/questions/update/votes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }

  // Saves comment votes to database
  async function updateCommentVotesToDB(currentVote, userID, questionID, commentID) {
    const request = {
      currentVote: currentVote,
      questionID: questionID,
      userID: userID,
      commentID: commentID,
    }
    fetch("/comments/update/votes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
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

  // Update vote button colors
  function setButtonColors(currentVote, likeButton, dislikeButton) {
    
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


  // Get the user vote value for a question
  async function getQuestionUserVote(questionID, userID) {
    try {
      const response = await fetch('/questions/get/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionID, userID }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        return 0;
      } else {
        return data.userVoteValue || 0;
      }
    } catch (error) {
      return 0;
    }
  }

  // Get the user vote value for a comment
  async function getCommentUserVote(commentID, userID, questionID) {
    try {
      const response = await fetch('/comments/get/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID, userID, questionID }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        return 0;
      } else {
        return data.voteValue || 0;
      }
    } catch (error) {
      return 0;
    }
  }

  function checkMaxVotes(clickCount, maxClicks) {
    if (clickCount >= maxClicks) {
      // User has reached the maximum allowed clicks
      M.toast({ html: 'You have exceeded the vote limit.', classes: 'red' });
      return true;
    }
  }

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

  // Save comment votes to database
  async function saveCommentToDB (comment, commentID) {
    const request = {
      comment: comment,
      questionID: questionID,
      commentID: commentID,
    }
    console.log(request)
    fetch("/comments/update/comment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }
});