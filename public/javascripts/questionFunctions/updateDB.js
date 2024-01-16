// Saves question votes to database
export async function updateQuestionVotesToDB(currentVote, userID, questionID) {
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
};

// Saves comment votes to database
export async function updateCommentVotesToDB(currentVote, userID, questionID, commentID) {
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

// Save comment votes to database
export async function saveCommentToDB (comment, commentID) {
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