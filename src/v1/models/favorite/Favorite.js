import mongoose from 'mongoose';
const { Schema } = mongoose;

//------  Схема для товару у списку бажаних ------
const favoriteProductSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId, // Поле для збереження посилання на товар
    ref: 'Product', // Вказує, що це посилання на модель 'Product'
    required: true, // Поле обов'язкове для заповнення
  },
});

//========  Схема для користувача  ========
const favoriteSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId, // Поле для збереження посилання на користувача
    ref: 'User', // Вказує, що це посилання на модель 'User'
    required: true, // Поле обов'язкове для заповнення
  },
  products: [favoriteProductSchema], // Поле для збереження списку товарів у списку бажаних
});

// Створення моделі 'Favorite' на основі схеми 'favoriteSchema'
const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite; // Експорт моделі 'Favorite' для використання в інших файлах