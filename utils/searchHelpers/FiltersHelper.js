import QueryParser from './QueryParser.js'

class FiltersHelper {
  // Метод для побудови MongoDB фільтра з масиву фільтрів
  static buildMongoFilter(filters) {
    const mongoFilter = {}
    
    filters.forEach((filter) => {
      switch (filter.filterType) {
        case 'search':
          // Regex пошук у полі
          mongoFilter[filter.fieldName] = new RegExp(filter.filterContent, 'i')
          break
        case 'range':
          // Діапазон значень з $gte та $lte
          mongoFilter[filter.fieldName] = { ...filter.filterContent }
          break
        case 'minValue':
          // Мінімальне значення
          if (!mongoFilter[filter.fieldName]) {
            mongoFilter[filter.fieldName] = {}
          }
          mongoFilter[filter.fieldName]['$gte'] = filter.filterContent
          break
        case 'maxValue':
          // Максимальне значення
          if (!mongoFilter[filter.fieldName]) {
            mongoFilter[filter.fieldName] = {}
          }
          mongoFilter[filter.fieldName]['$lte'] = filter.filterContent
          break
        case 'in':
          // Значення, що входять у список
          mongoFilter[filter.fieldName] = { '$in': filter.filterContent }
          break
        case 'nin':
          // Значення, що не входять у список
          mongoFilter[filter.fieldName] = { '$nin': filter.filterContent }
          break
        case 'exists':
          // Перевірка існування поля
          mongoFilter[filter.fieldName] = { '$exists': filter.filterContent }
          break
        default:
          console.warn(`Unsupported filter type: ${filter.filterType}`)
      }
    })
    
    return mongoFilter
  }

  // Метод для застосування фільтрів до запиту
  static applyFilters(query, filters) {
    // Будуємо MongoDB фільтер та застосовуємо його до запиту за один раз
    const mongoFilter = this.buildMongoFilter(filters)
    
    // Застосовуємо всі фільтри до запиту використовуючи прямий доступ до _conditions
    if (Object.keys(mongoFilter).length > 0) {
      query._conditions = { ...query._conditions, ...mongoFilter }
    }
    
    return query
  }

  // Метод для застосування дій до запиту
  static applyActions(query, actions) {
    actions.forEach((action) => {
      switch (action.type) {
        case 'sort':
          // Сортування результатів
          query.sort({ [action.field]: action.order })
          break
        case 'skip':
          // Пропуск певної кількості результатів
          query.skip(action.value)
          break
        case 'limit':
          // Обмеження кількості результатів
          query.limit(action.value)
          break

        default:
          console.warn(`Unsupported action type: ${action.type}`)
      }
    })
    return query
  }


  // Метод для застосування лише фільтрів з запиту
  static applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
    const { filters } = QueryParser.parseQuery(
      reqQuery,
      fieldsConfiguration
    )
    
    // Будуємо MongoDB фільтер
    const mongoFilter = this.buildMongoFilter(filters)
    
    // Застосовуємо фільтер до query usando merge або прямим присвоюванням
    // Використовуємо .merge() для додавання умов до існуючого query
    if (Object.keys(mongoFilter).length > 0) {
      query._conditions = { ...query._conditions, ...mongoFilter }
    }
    
    return query
  }

  // Метод для застосування лише дій з запиту
  static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
    const { actions } = QueryParser.parseQuery(
      reqQuery,
      fieldsConfiguration
    )
    if (actions.length) query = this.applyActions(query, actions)
    return query
  }

  // Метод для застосування фільтрів та дій з запиту
  static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
    const { filters, actions } = QueryParser.parseQuery(
      reqQuery,
      fieldsConfiguration
    )
   
    // Побудуємо mongoFilter та застосуємо його
    if (filters.length) {
      const mongoFilter = this.buildMongoFilter(filters)
      if (Object.keys(mongoFilter).length > 0) {
        query._conditions = { ...query._conditions, ...mongoFilter }
      }
    }
    
    if (actions.length) query = this.applyActions(query, actions)
    return query
  }
}

export default FiltersHelper