const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        console.log("backendissä")
        const user = await User.findOne({ username: body.username })
        const passwordCorrect = user === null ?
            false :
            await bcrypt.compare(body.password, user.passHash)

        if ( !(user && passwordCorrect) ) {
            return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id : user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)


    console.log(token)

    response.status(200).send({ token, username: user.username, name: user.name, id: user._id })
} catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong'})
}
})

module.exports = loginRouter