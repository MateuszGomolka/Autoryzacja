const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// instancja expressa
const app = express();

// podłączenie z bazą danych
mongoose.connect(
    'mongodb+srv://shop:'+ process.env.ATLAS_PASS +
    '@cluster0-u6oty.mongodb.net/shop?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
);

// logger
app.use(morgan('combined'));

// bodyParser
app.use(bodyParser.json());

// udostępnienie katalogu uploads
app.use('/uploads', express.static('uploads'));

// import routy
const userRoutes = require('./api/routes/users');

// obsługa routów
app.use('/users', userRoutes);

// obsługa błędów
app.use((req, res ,next)=> {
    const error = new Error('Nie znaleziono');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=> {
    res.status(error.status || 500).json({
        błąd: {
            wiadmosc: error.message,
        },
    });
});

// eksport modułu
module.exports = app;