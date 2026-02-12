
import passport from 'passport'

// readme.md зайдіть

class AuthController {

  static loginForm(req, res) {
    res.render('login', {
      error: null,
      oldData: {}
    })
  }

  static login(req, res, next) {

    passport.authenticate('local', (err, user, info) => {

      if (err) return next(err)

      if (!user) {
        return res.status(401).render('login', {
          error: info?.message || 'Invalid credentials',
          oldData: { name: req.body.name }
        })
      }

      req.logIn(user, (err) => {
        if (err) return next(err)

        return res.redirect('/')
      })

    })(req, res, next)
  }

  static logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err)

      req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
      })
    })
  }

}

export default AuthController


