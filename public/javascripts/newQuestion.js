document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('questionForm').addEventListener('submit', async function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Check if the title is unique before submitting the form
    const title = document.getElementById('questionTitle').value.trim();
    const isTitleUnique = await checkTitleUniqueness(title);

    if (isTitleUnique) {
      const questionForm = document.getElementById('questionForm');
      const encodedTitle = encodeURIComponent(title);
      questionForm.action = '/questions/' + encodedTitle;
      questionForm.submit();
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
