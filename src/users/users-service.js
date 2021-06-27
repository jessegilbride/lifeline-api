const bcrypt = require('bcryptjs');
const xss = require('xss');

/* const REGEX_UPPER_LOWER_NUMBER_SPECIAL =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/; */

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then((user) => !!user); // double exclamation coerces the result to true if the operand exists
  },
  getUserByUserName(db, user_name) { // this is not yet working
    return db('users')
      .where({ user_name })
      .first()
    // return db.raw('SELECT * FROM users WHERE user_name = ?', user_name)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (password.length > 48) {
      return 'Password cannot be more than 48 characters.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with an empty space.';
    }
    /* if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, one lower case, one number, and one special character.'
    } */
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      nickname: xss(user.nick_name),
      date_created: new Date(user.date_created)
    };
  }
};

module.exports = UsersService;
