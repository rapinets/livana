import mongoose from "mongoose";
const { Schema } = mongoose

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name must be filled in!'],
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;