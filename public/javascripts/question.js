document.addEventListener('DOMContentLoaded', function() {
  const userID = document.getElementById('userID').getAttribute('userID');
  const questionID = document.getElementById("questionID").getAttribute('questionID');
  let userAuthenticated = document.getElementById('isAuthenticated').getAttribute('isAuthenticated');
  let voteCount = parseInt(document.getElementById('voteCount').innerText.split(' ')[1]);
  
  const voteButtonColor = getComputedStyle(document.body).getPropertyValue('--secondary-color');
  // Get current user's vote
  let userVote = 0;

  async function getVote() {
    if (userAuthenticated == "true") {
      try {
        userVote = await getUserVoteValue(userID, questionID);
        console.log("User vote:", userVote);
        setButtonColors();
      } catch (error) {
        console.error("Error getting user vote:", error);
      }
    }
  }
  
  // Call the function
  getVote();
  

  let maxClicks = 10;
  let clickCount = 0;

  // Thumbs Up Button
  let thumbsUpButton = document.getElementById('thumbsUp');
  thumbsUpButton.addEventListener('click', function() {
    if (userAuthenticated == "true") {
      vote(1);
      setButtonColors();
      updateTotalVotesToDB(voteCount, questionID);
      updateUserVoteToDB(userID, userVote, questionID)
    } else {
      showLoginMessage();
    }
  });

  // Thumbs Down Button
  let thumbsDownButton = document.getElementById('thumbsDown');
  thumbsDownButton.addEventListener('click', function() {
    if (userAuthenticated == "true") {
      vote(-1);
      setButtonColors();
      updateTotalVotesToDB(voteCount, questionID);
      updateUserVoteToDB(userID, userVote, questionID)
    } else {
      showLoginMessage();
    }
  });

  function showLoginMessage() {
    let loginMessage = document.getElementById('loginMessage');
    loginMessage.style.display = 'block';
  }

  async function setButtonColors() {
    console.log("uservote: ", userVote)
    let thumbsUpButton = document.getElementById('thumbsUp');
    let thumbsDownButton = document.getElementById('thumbsDown');

    if (userVote === 1) {
      thumbsUpButton.classList.remove(voteButtonColor);
      thumbsUpButton.classList.add('green');
      thumbsDownButton.classList.remove('green', 'red');
      thumbsDownButton.classList.add(voteButtonColor);
    } else if (userVote === -1) {
      thumbsDownButton.classList.remove(voteButtonColor);
      thumbsDownButton.classList.add('red');
      thumbsUpButton.classList.remove('green', 'red');
      thumbsUpButton.classList.add(voteButtonColor);
    } else {
      thumbsUpButton.classList.remove('green', 'red');
      thumbsUpButton.classList.add(voteButtonColor);
      thumbsDownButton.classList.remove('green', 'red');
      thumbsDownButton.classList.add(voteButtonColor);
    }
  }

  function vote(voteValue) {
    if (clickCount >= maxClicks) {
      // User has reached the maximum allowed clicks
      let clickMessage = document.getElementById('clickMessage');
      clickMessage.style.display = 'block';
      return;
    }

    if (userVote === voteValue) {
      // If the user clicks the same button again, remove the vote
      userVote = 0;
      voteCount -= voteValue;
      clickCount++;
    } else if (userVote === -voteValue) {
      // If the user clicks the other button, toggle the vote
      voteCount += 2 * voteValue;
      userVote = voteValue;
      clickCount++;
    } else {
      // If the user hasn't voted yet, toggle the vote
      voteCount += voteValue;
      userVote = voteValue;
      clickCount++;
    }

    document.getElementById('voteCount').innerText = 'Votes: ' + voteCount;
  }

  // Check if user has voted before
  async function getUserVote(username) {
    try {
      const response = await fetch(`/questions/get/userVote?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  // Saves total votes to database
  async function updateTotalVotesToDB(voteCount, questionId) {
    const request = {
      voteCount: voteCount,
      questionId: questionId
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

  async function updateUserVoteToDB(userID, userVote, questionID) {
    try {
      const request = { userID, votes: { questionID: questionID, userVote: userVote } };
  
      // Make a POST request to the server endpoint
      const response = await fetch('/users/update/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
  
      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();
        console.log('Vote updated successfully:', data.message);
      } else {
        // Handle errors for non-successful responses
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error.message);
    }
  }

  // Retrieve the current user's vote value (check what have they voted for)
  async function getUserVoteValue(userID, questionID) {
    try {
  
      // Make a POST request to the server endpoint with data included
      const response = await fetch('/users/get/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionID: questionID,
          userID: userID,
        }),
      });
  
      const data = await response.json();
      console.log('User Vote Value:', data.userVote);
      return data.userVote ?? 0;
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
});
