import React from "react";

const Cart = ({ setActiveSection }) => {

  return (
    <div>
      <h2>Shopping Cart</h2>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Image</td>
            <td>Product Name</td>
            <td>100</td>
            <td>2</td>
            <td>200</td>
            <td>Remove</td>
          </tr>
        </tbody>
      </table>

      <h3>Grand Total: ₹200</h3>

      <button onClick={() => setActiveSection("checkout")}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
