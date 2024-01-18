// Get the user vote value for a question
export async function getQuestionUserVote(questionID, userID) {
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
};

// Get the user vote value for a comment
export async function getCommentUserVote(commentID, userID, questionID) {
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
};

export function checkMaxVotes(clickCount, maxClicks) {
  if (clickCount >= maxClicks) {
    // User has reached the maximum allowed clicks
    M.toast({ html: 'You have exceeded the vote limit.', classes: 'red' });
    return true;
  }
}

// Get total votes for a comment
export async function getTotalCommentVotes(commentID, questionID) {
  try {
    const response = await fetch('/comments/get/totalVotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentID, questionID }),
    });

    const data = await response.json();

    if (data.error) {
      return 0;
    } else {
      return data.totalVotes || 0;
    }
  } catch (error) {
    return 0;
  }
};

// Get total votes for a question
export async function getTotalQuestionVotes(questionID) {
  try {
    const response = await fetch('/questions/get/totalVotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        questionID }),
    });

    const data = await response.json();

    if (data.error) {
      return 0;
    } else {
      return data.totalVotes || 0;
    }
  } catch (error) {
    return 0;
  }
};

