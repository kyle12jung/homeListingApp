const express = require('express')
const mongoose = require('mongoose')
const houses = require('./routes/houses')
const app = express();

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Welcome to the house listing API')
})

app.use('/api/houses', houses)

require('dotenv').config();
const port = process.env.PORT || 3000;
const ID_MONGODB = process.env.ID_MONGODB;
const PASSWORD_MONGODB = process.env.PASSWORD_MONGODB;

mongoose.connect(`mongodb+srv://${ID_MONGODB}:${PASSWORD_MONGODB}@cluster0.3ugyod5.mongodb.net/?retryWrites=true&w=majority`)
    .then(result => {
        app.listen(port, () => console.log(`listening on ${port}`))
    })
    .catch(err => console.log(err))