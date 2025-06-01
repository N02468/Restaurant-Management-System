import { useEffect, useState } from "react";
import axios from "axios";

function crud()  {
    const [editingDishId, setEditingDishId] = useState(null);
    const [editForm, setEditForm] = useState({
      name: "",
      servings: "",
      price: "",
      quantityValue: "",
      quantityUnit: "kg",
      date: ""
    });
    
    
      const [dishes, setDishes] = useState([]);
      const [totals, setTotals] = useState({ totalDishes: 0 });
      const [searchOrderId, setSearchOrderId] = useState("");
      const [form, setForm] = useState({
        name: "",
        price: "",
        quantityValue: "",
        quantityUnit: "kg",
        date: "", // <-- added date field
      });
    
      const [successMessage, setSuccessMessage] = useState("");
    
      useEffect(() => {
        fetchDishes();
      }, []);
    
      const fetchDishes = async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/dishes", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setDishes(res.data.dishes);
          setTotals({
            totalDishes: res.data.totalDishes,
            totalServings: res.data.totalServings,
          });
        } catch (err) {
          if (err.response && err.response.status === 403) {
            alert("❌ Access denied. Please make your payment to continue.");
            setDishes([]);
            setTotals({ totalDishes: 0, totalServings: 0 });
          } else {
            console.error("Error fetching dishes:", err);
          }
        }
      };
    
    const startEditing = (dish) => {
      const [quantityValue, quantityUnit] = dish.quantity.split(" ");
      setEditingDishId(dish._id);
      setEditForm({
        name: dish.name,
        servings: dish.servings,
        price: dish.price,
        quantityValue: quantityValue,
        quantityUnit: quantityUnit,
        date: dish.date?.split("T")[0] || "" // format for input type="date"
      });
    };
    const saveEdit = async (id) => {
      const quantity = `${editForm.quantityValue} ${editForm.quantityUnit}`;
      try {
        await axios.put(
          `http://localhost:3000/api/dishes/${id}`,
          {
            name: editForm.name,
            servings: parseInt(editForm.servings),
            price: parseFloat(editForm.price),
            quantity,
            date: editForm.date
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
    
        setEditingDishId(null);
        fetchDishes();
        setSuccessMessage("✅ Dish updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error updating dish:", err);
      }
    };
    



    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const quantity = form.quantityValue + " " + form.quantityUnit;
    
        try {
          await axios.post(
            "http://localhost:3000/api/dishes",
            {
              name: form.name,
              servings: parseInt(form.servings),
              price: parseFloat(form.price),
              quantity,
              date: form.date,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          setForm({
            name: "",
            servings: "",
            price: "",
            quantityValue: "",
            quantityUnit: "kg",
            date: "",
          });
    
          fetchDishes();
          setSuccessMessage("✅ Dish added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
          console.log(error);
        }
      };
     
    
      const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:3000/api/dishes/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
    
          fetchDishes();
          setSuccessMessage("❌ Dish deleted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
          
            console.error("Error deleting dish:", err);
          
        }
      };
    
    
      const printReceipt = () => {
        const receiptWindow = window.open("", "PRINT", "height=600,width=800");
    
        receiptWindow.document.write(`<html><head><title>Receipt</title>`);
        receiptWindow.document.write(
          `<style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #2F855A; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px;}
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left;}
            th { background-color: #48BB78; color: white; }
          </style>`
        );
        receiptWindow.document.write(`</head><body>`);
        receiptWindow.document.write(`<h2>Restaurant Receipt</h2>`);
        receiptWindow.document.write(`<table>`);
        receiptWindow.document.write(`
          <thead>
            <tr>
              <th>Dish Name</th>
              <th>Servings</th>
              <th>Price ($)</th>
              <th>Quantity</th>
              <th>Subtotal ($)</th>
            </tr>
          </thead>
          <tbody>
        `);
    
        let totalPrice = 0;
        dishes.forEach((dish) => {
          // Extract numeric price & quantity for calculation
          const subtotal = dish.price * parseFloat(dish.quantity); // Quantity might be like "2 kg" so parseFloat extracts number
          totalPrice += subtotal;
          receiptWindow.document.write(`
            <tr>
              <td>${dish.name}</td>
               <td>${dish.servings}</td>
              <td>${dish.price.toFixed(2)}</td>
              <td>${dish.quantity}</td>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
          `);
        });
    
        receiptWindow.document.write(`
          </tbody>
          <tfoot>
            <tr>
              <th colspan="4" style="text-align:right;">Total Price:</th>
              <th>$${totalPrice.toFixed(2)}</th>
            </tr>
          </tfoot>
        `);
        receiptWindow.document.write(`</table>`);
        receiptWindow.document.write(`</body></html>`);
    
        receiptWindow.document.close();
        receiptWindow.focus();
        receiptWindow.print();
        receiptWindow.close();
      };
  return (
    <div>
       <div
        className="min-h-screen bg-cover bg-center p-6 relative"
        style={{ backgroundImage: "url('/raman-sqcH2q7lkvo-unsplash.jpg')" }}
      >
        {successMessage && (
          <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50 transition duration-300 ease-in-out">
            {successMessage}
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
            🍽️ Harmain Food Center
          </h1>
     
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 mb-6 justify-center flex-wrap"
          >
            <select
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-300 p-2 rounded-md flex-1 min-w-[150px]"
              required
            >
              <option value="">Select Dish</option>
              <option value="Chicken Nihari">Chicken Nihari</option>
              <option value="Chicken Karahi">Chicken Karahi</option>
              <option value="Chicken Korma">Chicken Korma</option>
              <option value="Daal Chana">Daal Chana</option>
              <option value="Daal Mash">Daal Mash</option>
              <option value="Anda Chola">Anda Chola</option>
              <option value="Kadhi Pakora">Kadhi Pakora</option>
            </select>

            <input
              type="number"
              placeholder="Servings"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-24"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-24"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantityValue}
              onChange={(e) => setForm({ ...form, quantityValue: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-24"
              required
              min="0"
              step="any"
            />
            <select
              value={form.quantityUnit}
              onChange={(e) => setForm({ ...form, quantityUnit: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-24"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="pcs">pcs</option>
              <option value="ltr">ltr</option>
            </select>
            <input
              type="date"
              value={form.date || ""}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-300 p-2 rounded-md w-40"
              required
            />

            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-80"
            />

           

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              ➕ Add Dish
            </button>
          
          </form>

          {/* Print Receipt Button */}
          <div className="text-center mb-6">
            <button
              onClick={printReceipt}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              🧾 Print Receipt
            </button>
           
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold">
              Total Dishes:{" "}
              <span className="text-green-700">{totals.totalDishes}

              </span>
            </h2>
            <h2 className="text-lg font-semibold">
              Total Servings:{" "}
              <span className="text-green-700">{totals.totalServings}</span>

            </h2>

          </div>
            {dishes.map((dish) => (
  <div key={dish._id} className="mb-4">
    {editingDishId === dish._id ? (
      <div>
        <input
          type="text"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="border p-1 rounded mr-2"
        />
        <input
          type="number"
          value={editForm.servings}
          onChange={(e) => setEditForm({ ...editForm, servings: e.target.value })}
          className="border p-1 rounded mr-2 w-20"
        />
        <input
          type="number"
          value={editForm.price}
          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          className="border p-1 rounded mr-2 w-20"
        />
        <input
          type="number"
          value={editForm.quantityValue}
          onChange={(e) => setEditForm({ ...editForm, quantityValue: e.target.value })}
          className="border p-1 rounded mr-2 w-20"
        />
        <select
          value={editForm.quantityUnit}
          onChange={(e) => setEditForm({ ...editForm, quantityUnit: e.target.value })}
          className="border p-1 rounded mr-2"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="pcs">pcs</option>
          <option value="ltr">ltr</option>
        </select>
        <input
          type="date"
          value={editForm.date}
          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          className="border p-1 rounded mr-2"
        />
        <button
          onClick={() => saveEdit(dish._id)}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded mr-2"
        >
          💾 Save
        </button>
        <button
          onClick={() => setEditingDishId(null)}
          className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded"
        >
          ❌ Cancel
        </button>
      </div>
    ) : (
      <div>
        <span className="text-gray-800 font-medium">{dish.name}</span>{" "}
        <span className="text-sm text-gray-600">
          ({dish.servings} servings) -{" "}
          <span className="text-green-600 font-semibold">
            pkr{dish.price?.toFixed(2)}
          </span>{" "}
          | Quantity: <span className="font-semibold">{dish.quantity}</span><br />
          Order ID: <span className="text-blue-600">{dish.orderId}</span> |{" "}
          Date: <span>{new Date(dish.date).toLocaleDateString()}</span>
        </span>
       
      </div>
    )}
  </div>
))}
          <ul className="divide-y divide-gray-200">
            {dishes
              .filter((dish) =>
                dish.orderId?.toLowerCase().includes(searchOrderId.toLowerCase())
              )
              .map((dish) => (
                <li
                  key={dish._id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <span className="text-gray-800 font-medium">{dish.name}</span>{" "}
                    <span className="text-sm text-gray-600">
                      ({dish.servings} servings) -{" "}
                      <span className="text-green-600 font-semibold">
                        pkr{dish.price?.toFixed(2)}
                      </span>{" "}
                      | Quantity: <span className="font-semibold">{dish.quantity}</span><br />
                      Order ID: <span className="text-blue-600">{dish.orderId}</span> |{" "}
                      Date: <span>{new Date(dish.date).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(dish._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                  <button
  onClick={() => startEditing(dish)}
  className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded mr-2"
>
  ✏️ Edit
</button>

                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default crud
