export default function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('error_msg', 'please login first')
        return res.redirect('/')
    }
}
