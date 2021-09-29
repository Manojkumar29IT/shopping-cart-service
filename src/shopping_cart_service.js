const serverless = require('serverless-http');
const mongoose = require('mongoose');
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const cors = require('cors');

const User = require('../model/user');
const Item = require('../model/item');

const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'DELETE',
        'OPTION'
    ]
};
app.use(cors(corsOpts));
app.use(cors());

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://admin:admin@cluster0.pb1bq.mongodb.net/shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserModel = mongoose.model('User', User);
const ItemModel = mongoose.model('Item', Item);
const response = {
    status: '',
    message: ''
};

app.get('/item', function (req, res) {
    ItemModel.find({}, function (err, item) {
        if (err) {
            response.status = 'Error';
            response.message = 'Error occurred while fetching items';
        }
        else {
            response.status = 'Success';
            response.message = item;
        }
        sendResponse(res, response);
    });
})

app.options('/item', function (req, res) {
    response.status = 'Success';
    sendResponse(res, response);
})

app.post('/item', function (req, res) {
    const item = new ItemModel(req.body);
    item.save(function (err, item) {
        if (err) {
            response.status = 'Error';
            response.message = 'Error occurred while saving item';
        } else {
            response.status = 'Success';
            response.message = 'Item insertion successful';
            response.item_id = item._id;
        }
        sendResponse(res, response);
    })
})

app.options('/item/:item_id', function (req, res) {
    response.status = 'Success';
    sendResponse(res, response);
})

app.delete('/item/:item_id', function (req, res) {
    let item_id = req.params.item_id;
    ItemModel.deleteOne({ _id: item_id }, function (err) {
        if (err) {
            response.status = 'Error';
            response.message = 'Error occurred while deleting item';
        }
        else {
            response.status = 'Success';
            response.message = 'Item deletion successful';
        }
        sendResponse(res, response);
    });
})

app.post('/user', function (req, res) {
    const user = new UserModel(req.body);
    user.save(function (err) {
        if (err) {
            response.status = 'Error';
            response.message = 'Error occurred while saving user';
        } else {
            response.status = 'Success';
            response.message = 'User added successfully';
        }
        sendResponse(res, response);
    })
})

app.post('/login', function (req, res) {
    UserModel.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err) {
            response.status = 'Error';
            response.message = 'Error occurred while fetching user';
        }
        else {
            response.status = 'Success';
            response.message = user;
        }
        sendResponse(res, response);
    });
})

app.options('/user', function (req, res) {
    response.status = 'Success';
    sendResponse(res, response);
})

app.options('/login', function (req, res) {
    response.status = 'Success';
    sendResponse(res, response);
})

const sendResponse = (res, response) => {
    res.status(200);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(response));
};

const port = 4000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// module.exports.handler = serverless(app);