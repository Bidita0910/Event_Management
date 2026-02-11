import React from "react";

const VendorList = ({ setActiveSection }) => {

  const categories = [
    "Catering",
    "Florist",
    "Decoration",
    "Lighting"
  ];

  return (
    <div>
      <h2>Select Vendor Category</h2>

      <select>
        <option>Select Category</option>
        {categories.map((cat, i) => (
          <option key={i}>{cat}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={() => setActiveSection("products")}>
        View Vendors
      </button>
    </div>
  );
};

export default VendorList;
