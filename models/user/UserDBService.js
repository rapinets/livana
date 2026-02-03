import User from './User.js'
import MongooseCRUDManager from '../MongooseCRUDManger.js'

class UserDBService extends MongooseCRUDManager {
  async getOne(email) {
    try {
      const res = await User.findOne(email)
      return res
    } catch (error) {
      return []
    }
  }
}

export default new UserDBService(User)