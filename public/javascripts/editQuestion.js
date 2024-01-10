document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('questionForm');
    const questionIDInput = document.getElementById('questionID');
    const questionID = questionIDInput.value;
    const questionURL = document.getElementById('questionURL').value;
    console.log(questionURL)
     
    questionForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Prepare the data to send to the server for updating the question
      const formData = new FormData(questionForm);
      const updatedQuestion = {
        title: formData.get('questionTitle'),
        content: formData.get('question'),
      };
      
      // Make a fetch request to update the question
      console.log(updatedQuestion)
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
        // Redirect to the updated question page or handle the response as needed
        window.location.href = `/questions/${questionURL}`;
      })
      .catch(error => {
        console.error('Error updating question:', error);
      });
    });
  });
  