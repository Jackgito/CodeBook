document.addEventListener('DOMContentLoaded', () => {
  const questionForm = document.getElementById('questionForm');
  const questionIDInput = document.getElementById('questionID');
  const questionID = questionIDInput.value;
  const questionURL = document.getElementById('questionURL').value;
    
  questionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Prepare the data to send to the server for updating the question
    const formData = new FormData(questionForm);
    const updatedQuestion = {
      title: formData.get('questionTitle'),
      question: formData.get('question'),
      questionID: questionID,
      url: encodeURIComponent(formData.get('questionTitle')),
    };
    
    // Update the question
    fetch(`/questions/edit/${questionID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedQuestion),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update question: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => {
      // Redirect to the updated question page or handle the response as needed
      window.location.href = `/questions/${data.updatedQuestionUrl}`;
    })
    .catch(error => {
      console.error('Error updating question:', error);
    });


  });
});
  