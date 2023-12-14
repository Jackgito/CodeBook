document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('questionForm').addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
    
        // Get the values entered in the title and question input fields
        const title = document.getElementById('title').value;
        const question = document.getElementById('question').value;
        const author = document.getElementById('username').innerText
    
        // Check if title and question exist
        if (title.trim() === '' || question.trim() === '') {
          console.error('Title and question are required!');
          return; // Don't proceed with form submission if title or question is empty
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
