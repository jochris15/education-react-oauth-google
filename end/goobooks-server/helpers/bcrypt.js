const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const hashPassword = (rawPassword) => {
    return bcrypt.hashSync(rawPassword, salt);
};

const comparePassword = (rawPassword, hashPassword) => {
    return bcrypt.compareSync(rawPassword, hashPassword);
};

module.exports = { hashPassword, comparePassword };
