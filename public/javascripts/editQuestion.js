document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('questionForm').addEventListener('submit', async function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Check if the title is unique before submitting the form
    const title = document.getElementById('questionTitle').value.trim();
    const isTitleUnique = await checkTitleUniqueness(title);

    if (isTitleUnique) {
      console.log(isTitleUnique)
      // const questionForm = document.getElementById('questionForm');
      // const encodedTitle = encodeURIComponent(title);
      // questionForm.action = '/questions/edit/' + encodedTitle;
      // questionForm.submit();

      const questionForm = document.getElementById('questionForm');
      const questionIDInput = document.getElementById('questionID');
      const questionID = questionIDInput.value;
     

        
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
          return response.json();
        })
        .then(data => {
          window.location.href = `/questions/${data.updatedQuestionUrl}`;
        })
        .catch(error => {
          console.error('Error updating question:', error);
        });
    } else {
      M.toast({ html: 'Title must be unique.', classes:'red' });
    }
  });

  async function checkTitleUniqueness(title) {
    // Perform an asynchronous request to your server to check title uniqueness
    try {
      const response = await fetch(`/checkTitle?title=${encodeURIComponent(title)}`);
      const data = await response.json();

      return data.isUnique;
    } catch (error) {
      console.error('Error checking title uniqueness:', error);
      return false;
    }
  }
});
  