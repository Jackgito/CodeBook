document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('questionForm').addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
    
        // Get the values entered in the title and question input fields
        const titleValue = document.getElementById('title').value;
        const questionValue = document.getElementById('question').value;
    
        // Log the values being submitted
        console.log('Title:', titleValue);
        console.log('Question:', questionValue);
    
        // Check if title and question exist
        if (titleValue.trim() === '' || questionValue.trim() === '') {
          console.error('Title and question are required!');
          return; // Don't proceed with form submission if title or question is empty
        }
    
        // Encode the title using encodeURIComponent
        const encodedTitle = encodeURIComponent(titleValue);
    
    
        // Set the form action dynamically
        this.action = '/questions/' + encodedTitle;
    
        // Now submit the form
        this.submit();
      });
});
