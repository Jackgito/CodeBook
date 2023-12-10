// Check if user has logged in
const isAuthenticated = (req) => {
    if (req.isAuthenticated()) {

      return true
        // userId: req.user._id, // Change this based on your user model
        // userEmail: req.user.email, // Change this based on your user model


    } else {
      return false;
    }
  };
  
module.exports = {
  isAuthenticated,
};