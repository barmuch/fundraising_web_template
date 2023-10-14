export default (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        next()
    } else {
        req.flash('error_msg', 'You are not Admin')
        return res.redirect('/')
    }
}
