const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('error'),
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.render('/login');
  }
  const isSuccess = await bcrypt.compare(password, user.password);
  if (!isSuccess) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  return res.redirect('/');
};

exports.postSignup = async (req, res, next) => {
  console.log('new user create request')
  const { email, password, confirmPassword, name} = req.body;
  console.log(email, password, confirmPassword, name)
  const user = await User.findOne({ email });
  console.log('existing user:', user);
  if (user) return res.redirect('/login');
  if (password !== confirmPassword) {
    return res.render('404', {
      pageTitle: 'cannot confirm the password',
      path: '/404',
      isAuthenticated: req.session.isLoggedIn
    });
  } 
  const hashedPw = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPw, cart: { items: [] } });
  await newUser.save();
  console.log('new user is created', newUser);
  return res.redirect('/signup');
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
