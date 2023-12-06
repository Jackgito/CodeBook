function loadQuestion(url, question, votes, views, author, tags, comments) {
  // Parse comments as an array
  comments = comments.split(',');

  // Make an AJAX GET request to the backend
  const xhr = new XMLHttpRequest();
  const fullUrl = `/questions/${url}`;
  xhr.open('GET', "/", true);

  // Set up error handling
  xhr.onerror = function () {
    console.error('An error occurred while making the request.');
  };

  // Set up state change event
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Request was successful
        console.log('Response from backend:', xhr.responseText);
        // Redirect to the new page
        window.location.href = fullUrl;
      } else {
        // Request failed
        console.error('Request failed with status:', xhr.status);
        console.error('Response from backend:', xhr.responseText);
      }
    }
  };

  // Send the request
  xhr.send();
}