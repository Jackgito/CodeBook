document.addEventListener('DOMContentLoaded', function() {

  let voteCount = parseInt(document.getElementById('voteCount').innerText.split(' ')[1]);

  //let voteCount = JSON.parse(document.getElementById('questionObject').getAttribute('questionObject')).vote;
  // let userAuthenticated = document.getElementById('isAuthenticated').getAttribute('data-is-authenticated');
  let userAuthenticated = "true"; // TESTING ONLY
  let userVoteStatus = 0; // 0: No vote, 1: Upvote, -1: Downvote
  let maxClicks = 10;
  let clickCount = 0;
  console.log(questionObj)


  function updateVoteCount() {
    document.getElementById('voteCount').innerText = 'Votes: ' + voteCount;
  }

  function showLoginMessage() {
    let loginMessage = document.getElementById('loginMessage');
    loginMessage.style.display = 'block';
  }

  function setButtonColors() {
    let thumbsUpButton = document.getElementById('thumbsUp');
    let thumbsDownButton = document.getElementById('thumbsDown');

    if (userVoteStatus === 1) {
      thumbsUpButton.classList.remove('blue');
      thumbsUpButton.classList.add('green');
      thumbsDownButton.classList.remove('green', 'red');
      thumbsDownButton.classList.add('blue');
    } else if (userVoteStatus === -1) {
      thumbsDownButton.classList.remove('blue');
      thumbsDownButton.classList.add('red');
      thumbsUpButton.classList.remove('green', 'red');
      thumbsUpButton.classList.add('blue');
    } else {
      thumbsUpButton.classList.remove('green', 'red');
      thumbsUpButton.classList.add('blue');
      thumbsDownButton.classList.remove('green', 'red');
      thumbsDownButton.classList.add('blue');
    }
  }

  function vote(voteValue) {
    if (clickCount >= maxClicks) {
      // User has reached the maximum allowed clicks
      let clickMessage = document.getElementById('clickMessage');
      clickMessage.style.display = 'block';
      return;
    }

    if (userVoteStatus === voteValue) {
      // If the user clicks the same button again, remove the vote
      userVoteStatus = 0;
      voteCount -= voteValue;
      clickCount++;
      setButtonColors();
    } else if (userVoteStatus === -voteValue) {
      // If the user clicks the other button, toggle the vote
      voteCount += 2 * voteValue;
      userVoteStatus = voteValue;
      clickCount++;
      setButtonColors();
    } else {
      // If the user hasn't voted yet, toggle the vote
      voteCount += voteValue;
      userVoteStatus = voteValue;
      clickCount++;
      setButtonColors();
    }

    // Save click count to localStorage
    localStorage.setItem('clickCount', clickCount);
    updateVoteCount();
    updateVotesToDatabase(voteValue);
  }

  // Thumbs Up Button
  let thumbsUpButton = document.getElementById('thumbsUp');
  thumbsUpButton.addEventListener('click', function() {
    if (userAuthenticated == "true") {
      vote(thumbsUpButton, 1);
    } else {
      showLoginMessage();
    }
  });

  // Thumbs Down Button
  let thumbsDownButton = document.getElementById('thumbsDown');
  thumbsDownButton.addEventListener('click', function() {
    if (userAuthenticated == "true") {
      vote(thumbsDownButton, -1);
    } else {
      showLoginMessage();
    }
  });

  function updateVotesToDatabase(voteValue) {
    questionId = 1;
    return fetch('/update-votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, voteValue }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Optionally update the UI with the updated question data
          console.log('Vote updated successfully:', data.question);
        } else {
          console.error('Failed to update vote:', data.error);
        }
      })
      .catch(error => {
        console.error('Error updating vote:', error);
      });
  }

  // Set initial button colors on page load
  setButtonColors();
});
