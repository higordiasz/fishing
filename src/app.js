const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.set('trust proxy', true)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Database

//Ativar o HTTPS
/*
app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});
*/

app.use((req, res, next) => {
    res.status(200).send({message: 'oi'})
});

module.exports = app;