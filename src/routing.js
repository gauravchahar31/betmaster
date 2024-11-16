const app = require('../server');
const path = require('path');

//Users Routes
const usersRoutes = require('../src/modules/users/routes/users');
app.use('/api/users', usersRoutes);

//Players Routes
const playersRoutes = require('../src/modules/players/routes/players');
app.use('/api/players', playersRoutes);

//Matches Routes
const matchesRoutes = require('../src/modules/matches/routes/matches');
app.use('/api/matches', matchesRoutes);

//React App Rendering
const appDir = path.join(__dirname);
app.get('/*', (req, res) => {
    res.sendFile(path.join(appDir + '/public/index.html'));
});