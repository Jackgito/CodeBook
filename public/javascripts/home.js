function loadQuestion(url) {
  try {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        window.location.href = `/questions/${encodedTitle}`;
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
