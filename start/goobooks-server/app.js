if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/index')
const port = process.env.PORT || 3000;
const errorHandler = require('./middlewares/errorHandler')

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)
app.use(errorHandler)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));



module.exports = app;