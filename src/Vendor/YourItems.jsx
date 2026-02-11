import React, { useEffect, useState } from "react";
// import "./YourItems.css";
import { db } from "../firebase";
import { ref, get, remove } from "firebase/database";

const YourItems = ({ vendorId }) => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, [vendorId]);

    const fetchProducts = async () => {
        if (!vendorId) return;

        const productRef = ref(db, `products/${vendorId}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const list = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            setProducts(list);
        } else {
            setProducts([]);
        }
    };

    const handleDelete = async (id) => {
        await remove(ref(db, `products/${vendorId}/${id}`));
        fetchProducts();
    };

    return (
        <div className="youritems-container">

            <div className="table-header">
                <div>Product Image</div>
                <div>Product Name</div>
                <div>Product Price</div>
                <div>Action</div>
            </div>

            {products.map(item => (
                <div className="table-row" key={item.id}>
                    <img src={item.productImage} alt="product" />
                    <div>{item.productName}</div>
                    <div>₹ {item.productPrice}</div>

                    <button onClick={() => handleDelete(item.id)}>
                        Delete
                    </button>
                </div>
            ))}

        </div>
    );
};

export default YourItems;
