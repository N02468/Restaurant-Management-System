import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  servings: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  date: { type: Date, required: true },
  orderId: { type: String, required: true },
});

export default mongoose.model('Dish', dishSchema);
export { default as Dish } from './DishModel.js'; // for named exports
