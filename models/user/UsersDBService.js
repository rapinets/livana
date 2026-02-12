import User from './User.js'
import MongooseCRUDManager from '../MongooseCRUDManager.js'

class UserDBService extends MongooseCRUDManager {

  async getList(filters) {
    try {
      const res = await super.getList(filters, { password: 0 }, ['type'])
      return res
    } catch (error) {
      return []
    }
  }
}

export default new UserDBService(User)