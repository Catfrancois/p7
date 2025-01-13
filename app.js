const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const routeBooks = require('./routes/books');
const routeUser = require('./routes/user');

const app = express();
mongoose.connect('mongodb+srv://catinotfrancois:jY6Swx8iEyR98vVC@cluster0.na8im.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin"}
}));
app.use(limiter);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/books', routeBooks);
app.use('/api/auth', routeUser);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;