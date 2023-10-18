import User from '../models/user.js'

const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        // TODO: Send verification email
        req.login(registerUser, (err) => {
            if (err) return next(err)
            req.flash('success_msg', 'You are now registered and logged in')
            res.redirect('/')
        })
    } catch (error) {
        req.flash('error_msg', error.message)
        res.redirect('/auth/register')
    }
}

const loginForm = (req, res) => {
    res.render('auth/login')
}

const login = (req, res) => {
    req.flash('success_msg', 'You are now logged in')
    res.redirect('/')
}

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success_msg', 'You are now logged out')
        res.redirect('/')
    })
}

export { register, loginForm, login, logout }
