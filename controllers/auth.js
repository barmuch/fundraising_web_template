import User from '../models/user.js';

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success_msg', 'You are now registered and logged in');
            res.redirect('/places');
        })
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/register');
    }
}

const loginForm = (req, res) => {
    res.render('auth/login');
}

const login = (req, res) => {
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/places');
}

const logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are now logged out');
        res.redirect('/places');
    });
}

export {register, loginForm, login, logout}