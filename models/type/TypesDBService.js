import Type from './Type.js'
import MongooseCRUDManager from '../MongooseCRUDManager.js'

class TypesDBService extends MongooseCRUDManager {
  static async getList({ filters }) {
    try {
      const res = await Type.find(filters, { title: 1 })
      return res
    } catch (error) {
      return []
    }
  }

  async getOne(title) {
    try {
      const res = await Type.findOne({ title: title }).exec()
      return res
    } catch (error) {
      return []
    }
  }
}

export default new TypesDBService(Type)
