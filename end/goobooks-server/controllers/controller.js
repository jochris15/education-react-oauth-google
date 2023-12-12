const axios = require('axios')
const { comparePassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library');

class Controller {
    static async googleLogin(req, res, next) {
        try {
            const { token } = req.headers
            const client = new OAuth2Client();

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            const [user, created] = await User.findOrCreate({
                where: {
                    username: payload.email
                },
                defaults: {
                    username: payload.email,
                    password: "password_google"
                },
                hooks: false
            })

            const access_token = createToken({
                id: user.id,
                username: user.username,
            })

            res.status(200).json({ access_token })
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body

            if (!username || !password) {
                throw { name: "LoginError" }
            }

            const user = await User.findOne({
                where: { username: username }
            });

            if (!user) {
                throw { name: "LoginError" }
            }

            if (!comparePassword(password, user.password)) {
                throw { name: "LoginError" }
            }

            const payload = {
                id: user.id,
                username: user.username,
            }

            const access_token = createToken(payload)

            res.status(200).json({ access_token });
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    static async readBooks(req, res, next) {
        try {
            let { q } = req.query

            if (!q) {
                q = "harry"
            }

            const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`)

            if (!data.items) throw { name: "NotFound" }

            const books = data.items.map((book) => {
                return {
                    id: book.id,
                    title: book.volumeInfo.title,
                    preview: book.volumeInfo.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : 'no preview',
                    author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'unknown',
                    rating: book.volumeInfo.averageRating ? book.volumeInfo.averageRating : 0
                }
            }).slice(0, 9)

            res.status(200).json(books)
        } catch (err) {
            console.log(err);
            next(err)
        }
    }
}

module.exports = Controller