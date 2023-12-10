document.addEventListener('DOMContentLoaded', function() {
    var voteCount = 0; // Set an initial value or retrieve it from your server
    var isAuthenticated = true/* set your default value here or leave it undefined */;
    var userVoteStatus = 0; // 0: No vote, 1: Upvote, -1: Downvote
  
    // Assuming isAuthenticated is set in the EJS template
    if (typeof window.isAuthenticated !== 'undefined') {
      isAuthenticated = window.isAuthenticated;
    }
  
    function updateVoteCount() {
      document.getElementById('voteCount').innerText = 'Votes: ' + voteCount;
    }
  
    function showLoginMessage() {
      var loginMessage = document.getElementById('loginMessage');
      loginMessage.classList.remove('hidden');
    }
  
    function setButtonColors() {
      var thumbsUpButton = document.getElementById('thumbsUp');
      var thumbsDownButton = document.getElementById('thumbsDown');
  
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
        // userVoteStatus is 0
        thumbsUpButton.classList.remove('green', 'red');
        thumbsUpButton.classList.add('blue');
        thumbsDownButton.classList.remove('green', 'red');
        thumbsDownButton.classList.add('blue');
      }
    }
  
    function toggleVote(button, voteValue) {
      if (userVoteStatus === voteValue) {
        // If the user clicks the same button again, remove the vote
        userVoteStatus = 0;
        voteCount -= voteValue;
        setButtonColors();
      } else if (userVoteStatus === -voteValue) {
        // If the user clicks the other button, toggle the vote
        voteCount += 2 * voteValue;
        userVoteStatus = voteValue;
        setButtonColors();
      } else {
        // If the user hasn't voted yet, toggle the vote
        voteCount += voteValue;
        userVoteStatus = voteValue;
        setButtonColors();
      }
  
      updateVoteCount();
      // You can also send an AJAX request to update the vote count on the server
      // Example: fetch('/updateVote', { method: 'POST', body: JSON.stringify({ voteCount: voteCount }) });
    }
  
    // Thumbs Up Button
    var thumbsUpButton = document.getElementById('thumbsUp');
    thumbsUpButton.addEventListener('click', function() {
      if (isAuthenticated) {
        toggleVote(thumbsUpButton, 1);
      } else {
        showLoginMessage();
      }
    });
  
    // Thumbs Down Button
    var thumbsDownButton = document.getElementById('thumbsDown');
    thumbsDownButton.addEventListener('click', function() {
      if (isAuthenticated) {
        toggleVote(thumbsDownButton, -1);
      } else {
        showLoginMessage();
      }
    });
  
    // Set initial button colors on page load
    setButtonColors();
  });
  