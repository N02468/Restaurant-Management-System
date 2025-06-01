import Dish  from "../models/DishModel.js";
import { v4 as uuidv4 } from "uuid"; // for generating unique order IDs


// POST /api/dishes
const addDish = async (req, res) => {
    try {
      const { name, servings, price, quantity, date } = req.body;
  
      if (!quantity || !date) {
        return res.status(400).json({ error: "Quantity and date are required" });
      }
  
      const orderId = uuidv4(); // generate unique ID like 'e4a1...'
  
      const newDish = new Dish({
        orderId,
        name,
        servings,
        price,
        quantity,
        date: new Date(date),
      });
  
      await newDish.save();
      res.status(201).json({ message: "Dish added successfully!", orderId }); // send back orderId
    } catch (error) {
      res.status(500).json({ error: "Failed to add dish" });
    }
  };
  
  
// GET /api/dishes
const getDishes = async (req, res) => {
  const dishes = await Dish.find();
  const totalDishes = dishes.length;
  const totalServings = dishes.reduce((sum, dish) => sum + dish.servings, 0);
  res.json({ dishes, totalDishes, totalServings });
};

// ✅ DELETE /api/dishes/:id
const deleteDish = async (req, res) => {
  const { id } = req.params;
  try {
    await Dish.findByIdAndDelete(id);
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete dish", error });
  }
};

const getDishByOrderId = async (req, res) => {
    const { orderId } = req.params;
    try {
      const dish = await Dish.findOne({ orderId });
  
      if (!dish) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  };

 const updatedDish = async (req, res) => {
  const { id } = req.params;
  const { name, servings, price, quantity, date } = req.body;

  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      { name, servings, price, quantity, date },
      { new: true }
    );

    res.json(updatedDish);
  } catch (err) {
    res.status(500).json({ error: "Failed to update dish" });
  }
};


  export default { addDish, getDishes, deleteDish, getDishByOrderId,updatedDish };
  
export { addDish, getDishes, deleteDish, getDishByOrderId,updatedDish }; // for named exports
export { default as dishController } from "./dishController.js"; // for default export