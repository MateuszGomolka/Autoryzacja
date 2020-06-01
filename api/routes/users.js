const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
//model użytkownika
const User = require('../models/user');
 
//założenie konta - dodanie nowego usera
router.post('/signup', (req, res, next) => {
    // sprawdzenie czy użytkownik czasem już nie jest w bazie
    User.findOne({email: req.body.email})
    .exec()
    .then((user) => {
        if(user) {
            res.status(409).json({wiadomosc: 'Email już istnieje' })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({ error: err });
                } else {
                  const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                  });
                  user
                    .save()
                    .then((result) => {
                      res.status(201).json({ wiadomosc: 'Stworzono użytkownika' });
                    })
                    .catch((err) => {
                      res.status(500).json({ error: err });
                    });
                }
              });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
      });
});

// logowanie

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email})
  .exec()
  .then(user => {
    if(!user) {
      res.status(401).json({ 
        wiadomosc: 'Błąd autentykacji',
      });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(err) {
          return res.status(401).json({ 
            wiadomosc: 'Błąd autentykacji',
          });
        }
        if(result) {
          const token = jwt.sign({
            email: user.email,
            userID: user._id
          }, 
          process.env.JWT_PASS,
          {
            expiresIn: '1h',
          } 
          );
          return res.status(200)
          .json({ wiadomosc: 'Zalogowano', token: token});
        } else {
          return res.status(401).json({ 
            wiadomosc: 'Błąd autentykacji',
          });
        }
      })
    }
  })
  .catch((err) => {
      res.status(500).json({ error: err });
  });
});

// usunięcie użytkownika
router.delete('/:userId', (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
    .exec()
    .then((result) => {
        res.status(200).json({wiadomosc: 'Usunięto użytkownika'});
    })
    .catch((err) => {
        res.status(500).json({ error: err });
      });
});
 
module.exports = router;