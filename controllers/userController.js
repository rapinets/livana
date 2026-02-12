import UsersDBService from "../models/user/UsersDBService.js"
import TypesDBService from "../models/type/TypesDBService.js"

class UserController {
  static async usersList(req, res) {
    try {
      const filters = {}
      for (const key in req.query) {
        if (req.query[key]) filters[key] = req.query[key]
      }

      const dataList = await UsersDBService.getList(filters)

      res.render('usersList', {
        users: dataList,
        user: req.user,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id
      let user = null
      if (id) {

        user = await UsersDBService.getById(id)
      }

      const emailQuery = req.query.email
      if (emailQuery) {
        req.session.registerEmail = emailQuery
      }

      const email = req.session.registerEmail || ''

      res.render('users/register', {
        errors: {},
        data: user,
        user: req.user,
        email
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async addUser(req, res) {
    try {
      const data = req.validationData
      await UsersDBService.create(data)
      delete req.session.registerEmail
      res.redirect('/auth/login')
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  //   static async registerUser(req, res) {

  //     const data = req.body
  //     const types = await TypesDBService.getList()

  //     try {
  //       const dataObj = req.body
  //       if (req.file) dataObj.img = req.file.filename

  //       if (req.params.id) {

  //         await UsersDBService.update(req.params.id, dataObj)
  //       } else {

  //         await UsersDBService.create(dataObj)
  //       }

  //       res.redirect('/login')
  //     } catch (err) {
  //       res.status(500).render('register', {
  //         errors: [{ msg: err.message }],
  //         data,
  //         types,
  //         user: req.user,
  //       })
  //     }
  //   }

  //   static async deleteUser(req, res) {
  //     try {
  //       await UsersDBService.deleteById(req.body.id)
  //       res.json({ success: true })
  //     } catch (error) {
  //       res.status(500).json({ success: false, message: 'Failed to delete user' })
  //     }
  //   }

}

export default UserController