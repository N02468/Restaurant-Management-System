import express from "express";
const router = express.Router();
import { addDish, getDishes, deleteDish, getDishByOrderId,updatedDish } from"../controllers/DishController.js";



// Apply middlewares to secure routes
router.post("/", addDish); // Only allow paid users
router.get("/", getDishes); // ✅ /api/dishes secured
router.put("/order/:orderId", getDishByOrderId);
router.delete("/:id", deleteDish);
router.put('/:id', updatedDish); // Update dish by ID

export default router;
export { router as dishRoutes };
