import React from "react";

const Checkout = () => {

  return (
    <div>
      <h2>Checkout</h2>

      <input placeholder="Name" />
      <input placeholder="Email" />
      <input placeholder="Phone Number" />
      <input placeholder="Address" />
      <input placeholder="City" />
      <input placeholder="State" />
      <input placeholder="Pin Code" />

      <select>
        <option>Payment Method</option>
        <option>Cash</option>
        <option>UPI</option>
      </select>

      <br /><br />

      <button>Order Now</button>
    </div>
  );
};

export default Checkout;
