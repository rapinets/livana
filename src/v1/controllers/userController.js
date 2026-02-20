import UsersDBService from "../models/user/UsersDBService.js"
// import TypesDBService from "../models/type/TypesDBService.js"
import { buildUserFilter } from '../validators/user/userFilter.js'
import { isValidObjectId } from "../validators/helpers.js"
import { sanitizeUserInput } from '../validators/user/userSanitize.js'

class UserController {
  static async usersList(req, res) {
    try {
      // Санітизація і валідація фільтрів
      const filters = buildUserFilter(req.query)
      const dataList = await UsersDBService.getList(filters)
      res.status(200).json({
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
        if (!isValidObjectId(id)) {
          return res.status(400).json({ error: 'Invalid id' })
        }
        user = await UsersDBService.getById(id)
      }
      const emailQuery = req.query.email
      if (emailQuery) {
        req.session.registerEmail = emailQuery
      }

      const email = req.session.registerEmail || ''

      res.status(200).json({
        errors: {},
        data: user,
        email,
        user: req.user,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  static async addUser(req, res) {
    try {
      const data = req.validated
      const sanitizedData = sanitizeUserInput(data)
      await UsersDBService.create(sanitizedData)
      delete req.session.registerEmail
      res.status(200).json({ message: 'User added successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

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