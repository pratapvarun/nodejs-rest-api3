const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));//true supports to rich data. false supports simple body.
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");//Star means access to any origin. or can give access only to (for exp) "http://my-cool-page.com"
	res.header('Access-Control-Allow-Header',"*");//Accepted headers from request. or e.g. "Origion, Accept, Authorization"
	if (req.method == 'OPTIONS'){ // Browser alwasy sends OPTIONS request first with POST/PUT request
		res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE,GET') //Options can be sent from request
		return res.status(200).json({});
}
next(); // If we are not returing anything like from OPTIONS
});


//Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;


