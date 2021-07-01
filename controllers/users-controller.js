const { v4 } = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_USER = [
    {
        id: 'u1',
        name: "John Deno",
        email: 'test@test.com',
        password: 'testers'
    }
];

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USER});
}

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const identifiedUser = DUMMY_USER.find((u) => u.email === email);
    if(identifiedUser) {
        throw new HttpError("Email already exists", 422);
    }
    const newUser = {
        id: v4(),
        name,
        email,
        password
    }

    DUMMY_USER.push(newUser);

    res.status(201).json(newUser);
}

const login = (req, res, next) => {
    const { email, password }= req.body;

    const identifiedUser = DUMMY_USER.find((u) => u.email === email && u.password === password);
    if(!identifiedUser) {
        throw new HttpError('Could not identify user, Credential seems wrong', 401);
    }

    res.json({message: 'Logged in'});
}


module.exports = {
    getUsers,
    signup,
    login
}