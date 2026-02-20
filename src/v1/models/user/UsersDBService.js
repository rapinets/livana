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

  async findUserById(id) {
    return await this.getById(id, ['type'])
  }

  async findUser(filter) {
    return await this.findOne(filter, {}, ['type'])
  }

  async createUser(data) {
    const user = await this.create(data)
    return await user.populate('type')
  }

  getUserAuthInfo(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.type?.title || 'user',
    }
  }
}

export default new UserDBService(User)