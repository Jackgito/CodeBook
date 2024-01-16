document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('questionForm').addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
    
        // Get the values entered in the title and question input fields
        const title = document.getElementById('questionTitle').value;
        const question = document.getElementById('question').value;
    
        // Check if title and question exist
        if (title.trim() === '' || question.trim() === '') {
          console.error('Title and question are required!');
          return;
        }
    
        // Encode the title using encodeURIComponent
        const encodedTitle = encodeURIComponent(title);
        console.log("Title: ", title, "Encoded: ", encodedTitle);
    
        // Set the form action dynamically
        this.action = '/questions/' + encodedTitle;
    
        // Now submit the form
        this.submit();
      });
});
