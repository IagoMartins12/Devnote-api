var express = require('express');
var router = express.Router();

const User = require('../models/user');

//Usando jwt para gerar o token
const jwt = require('jsonwebtoken');

//Configurando o .env para permitir acesso com o token
require('dotenv').config()
const secret = process.env.JWT_TOKEN;

//Endpoint de registro. Irá criar um novo usuario e salvar no banco, recebendo os parametros atraves da requisição
router.post('/register', async function(req, res) {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    try {
      await user.save()
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({error: "Error registering new user please try again."});
    }
});

//Endpoint de login
router.post('/login', async function(req, res) {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email })
      if (!user) {
          //Se não achar nenhum usuario...
          res.status(401).json({error: 'Incorrect email or password'});
      }else {
          user.isCorrectPassword(password, function(err, same) {
          if (!same) {
              //Se a senha estiver incorreta...
              res.status(401).json({error: 'Incorrect email or password'});
          } else {
              //Liberando o token de acesso
              const token = jwt.sign({email}, secret, { expiresIn: '1d' });
              res.json({user: user, token: token});
          }
      });
      }
    } catch (error) {
      res.status(500).json({error: 'Internal error please try again'});
    }
    
});

module.exports = router;
