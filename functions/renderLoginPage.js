const { renderHomePage } = require('./renderHomePage');

async function renderLoginPage(req, res) {
    const isAuthenticated = req.isAuthenticated()
    

}

module.exports = {
    renderLoginPage
};