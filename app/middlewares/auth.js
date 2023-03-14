require('dotenv').config();
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Middleware para verificar token
const withAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    //Se o token não estiver presente...
    if (!token) {
        res.status(401).json({error: 'Unauthorized: No token provided'});
    } else {
        //Verificação de token valido...
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                //Achando email que está no token e injetando o usuario nas autorizações
                req.email = decoded.email;
                User.findOne({email: decoded.email })
                .then(user => {
                    req.user = user
                    next();
                }).catch(err => {
                    res.status(401).send(err);
                })
            }
        });
    }
};

module.exports = withAuth;