import FiltersHelper from '../../../utils/searchHelpers/FiltersHelper.js'
import QueryParser from '../../../utils/searchHelpers/QueryParser.js'

class MongooseCRUDManager {
  constructor(model) {
    this.model = model
  }

 async findOneWithSearchOptionsFromQuery(
    reqQuery, // Запит клієнта з параметрами пошуку
    fieldsConfiguration, // Конфігурація доступних полів для пошуку
    projection = null, // Поля, які слід включити/виключити у результаті
    populateFields = [] // Поля, які слід заповнити зв'язаними даними
  ) {
    try {
      // Створення базового запиту для пошуку одного документу
      let query = this.model.findOne({}, projection)

      // Застосування фільтрів пошуку з reqQuery за допомогою FiltersHelper
      query = FiltersHelper.applyFindOptionsFromQuery(
        reqQuery,
        fieldsConfiguration,
        query
      )

      // Додавання опцій populate для зв'язків
      this.addPopulationOptions(query, populateFields)

      // Виконання запиту та повернення знайденого документу
      const document = await query.exec()
      return document
    } catch (error) {
      throw new Error('Error retrieving data: ' + error.message)
    }
  }

  async findManyWithSearchOptions(
    reqQuery, // Запит клієнта
    fieldsConfiguration, // Конфігурація доступних полів для пошуку
    projection = null, // Поля для включення/виключення
    populateFields = [] // Поля для заповнення
  ) {
    try {
      // Спочатку будуємо MongoDB фільтер
      const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration)
      const mongoFilter = FiltersHelper.buildMongoFilter(filters)
      
      // Використовуємо baixо-рівневий MongoDB driver для уникнення Mongoose schema validation
      // Це необхідно тому що Mongoose 9 намагається кастувати query operators як значення документу
      const collection = this.model.collection
      
      // Отримуємо документи
      let cursor = collection.find(mongoFilter)
      
      // Застосовуємо дії (сортування, пагінація)
      if (actions.length) {
        actions.forEach(action => {
          switch (action.type) {
            case 'sort':
              cursor = cursor.sort({ [action.field]: action.order })
              break
            case 'skip':
              cursor = cursor.skip(action.value)
              break
            case 'limit':
              cursor = cursor.limit(action.value)
              break
          }
        })
      }
      
      // Отримуємо документи як plain objects
      const documents = await cursor.toArray()
      
      // Для кожного документу створюємо Mongoose документ якщо потрібно populate
      let finalDocuments = documents
      if (populateFields && populateFields.length > 0) {
        // Якщо потрібен populate, конвертуємо в Mongoose документи
        finalDocuments = await Promise.all(
          documents.map(doc => 
            this.model.findById(doc._id).populate(populateFields)
          )
        )
      }
      
      // Отримуємо загальну кількість
      const count = await collection.countDocuments(mongoFilter)
      
      return { documents: finalDocuments, count }
    } catch (error) {
      throw new Error('Error retrieving data: ' + error.message)
    }
  }

  //---- Додавання опцій populate для зв'язків
  addPopulationOptions(query, populateFields) {
    populateFields.forEach((field) => {
      query.populate(field)
    //   if (typeof field === 'string') {
    //     // Якщо поле передано як рядок
    //     query = query.populate(field)
    //   } else if (typeof field === 'object' && field.fieldForPopulation) {
    //     // Якщо передано об'єкт з полем для заповнення та запитуваними полями

    //     if (typeof field.fieldForPopulation === 'object')
    //       query = query.populate(field.fieldForPopulation)
    //     else
    //       query = query.populate(
    //         field.fieldForPopulation,
    //         field.requiredFieldsFromTargetObject
    //       )
    //   }
    })
  }
  // Вибірка всього списку з бази з фільтрами, projection і populateFields
  async getList(filters = {}, projection = null, populateFields = []) {
    try {
      let query = this.model.find(filters, projection)
      this.addPopulationOptions(query, populateFields)
      const results = await query.exec()
      return results.map((doc) => doc.toObject())
    } catch (error) {
      throw new Error('Error retrieving data: ' + error.message)
    }
  }

  // Створення об'єкта і збереження у базі
  async create(data) {
    try {
      const newItem = new this.model(data)
      return await newItem.save()
    } catch (error) {
      throw new Error('Error creating data: ' + error.message)
    }
  }

  // Пошук за id з використанням populateFields
  async getById(id, populateFields = [], projection = null) {
    try {
      let query = this.model.findById(id, projection)
      populateFields.forEach((field) => {
        query = query.populate(field)
      })
      return await query.exec()
    } catch (error) {
      throw new Error('Error finding data by id: ' + error.message)
    }
  }

  // Пошук одного за фільтром
  async findOne(filters = {}, projection = null, populateFields = []) {
    try {
      let query = this.model.findOne(filters, projection)
      populateFields.forEach((field) => {
        if (typeof field === 'string') {
          // Якщо поле передано як рядок
          query = query.populate(field)
        } else if (
          typeof field === 'object' &&
          field.fieldForPopulation &&
          field.requiredFieldsFromTargetObject
        ) {
          // Якщо передано об'єкт з полем для заповнення та запитуваними полями
          query = query.populate(
            field.fieldForPopulation,
            field.requiredFieldsFromTargetObject
          )
        }
      })
      return await query.exec()
    } catch (error) {
      throw new Error('Error finding data by id: ' + error.message)
    }
  }
  // Оновлення за id
  async update(id, data) {
    try {
      return await this.model
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec()
    } catch (error) {
      throw new Error('Error updating data: ' + error.message)
    }
  }

  // Видалення за id
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id).exec()
    } catch (error) {
      throw new Error('Error deleting data: ' + error.message)
    }
  }
}

export default MongooseCRUDManager