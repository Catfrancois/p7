const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    const email = req.body.email;

    if (!email || !password || !email.trim() || !password.trim()) {
        return res.status(400).json({ error: 'Email & password required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        return res.status(400).json({
            error: 'Le mot de passe doit comporter au moins 8 caractères et inclure une majuscule, une minuscule, un chiffre et un caractère spécial'
        });
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    if (error.code === 11000) {
                        res.status(400).json({ error: 'Identifiant existe déjà' });
                    } else {
                        res.status(400).json({ error: error.message });
                    }
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ error: 'Identifiant et Mot de passe requis' });
    }

    User.findOne({ email })
    .then(user => {
        if (!user) {
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error })
            })
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
};