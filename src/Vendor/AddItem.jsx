import React, { useState } from "react";
import "./AddItem.css";
import { storage, db } from "../firebase";
import { ref as dbRef, push, set } from "firebase/database";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

const AddItem = ({ vendorId }) => {

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");
    // const [vendorId, setVendorId] = useState(null);


    // ✅ Image Select
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.includes("jpeg") && !file.type.includes("png")) {
            alert("Only JPG or PNG allowed");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // ✅ Add Product
    const handleAddItem = async () => {

        // IMPORTANT CHECK
        if (!vendorId) {
            alert("Vendor not loaded yet. Please wait.");
            return;
        }

        if (!productName || !productPrice || !imageFile) {
            alert("Fill all fields");
            return;
        }

        try {

            // unique filename (prevents overwrite)
            const fileName = `${Date.now()}_${imageFile.name}`;

            // ✅ Upload image to storage
            const imgRef = storageRef(
                storage,
                `products/${vendorId}/${fileName}`
            );

            await uploadBytes(imgRef, imageFile);

            const imageURL = await getDownloadURL(imgRef);

            // ✅ Save in realtime database
            const newRef = push(dbRef(db, `products/${vendorId}`));

            await set(newRef, {
                productName,
                productPrice,
                productImage: imageURL,
                vendorId,
                createdAt: Date.now()
            });

            alert("Product Added Successfully");

            // reset form
            setProductName("");
            setProductPrice("");
            setImageFile(null);
            setPreview("");

        } catch (error) {
            console.error("Add Item Error:", error);
            alert(error.message);
        }
    };

    return (
        <div className="additem-container">

            <div className="additem-form">
                <h2>Add New Item</h2>

                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />

                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                />

                {preview && (
                    <img
                        src={preview}
                        alt="preview"
                        style={{ width: "200px", marginTop: "10px" }}
                    />
                )}

                <button onClick={handleAddItem}>
                    Add The Product
                </button>
            </div>

        </div>
    );
};

export default AddItem;
