import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    images: [''],
  });
  const [categories, setCategories] = useState([])
  const fatchCategory = async () => {
    const response = await axios.get("http://localhost:8000/seller/categories", {
      withCredentials: true,
    });
    setCategories(response.data.data);
  }

 const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'images') {
    setFormData({ ...formData, images: Array.from(files) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append("name", formData.name);
  form.append("description", formData.description);
  form.append("price", formData.price);
  form.append("discountPrice", formData.discountPrice);
  form.append("stock", formData.stock);
  form.append("category", formData.category);

  formData.images.forEach((image) => {
    form.append("images", image);
  });

  try {
    const res = await axios.post('http://localhost:8000/product/add', form, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('Product created successfully!');
    console.log(res.data);
  } catch (err) {
    console.error('Error creating product:', err);
    alert('Failed to create product.');
  }
};

  useEffect(() => {
    fatchCategory()
  },
    []
  )
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 shadow-lg rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border"
      />

      <input
        type="number"
        name="discountPrice"
        placeholder="Discounted Price (optional)"
        value={formData.discountPrice}
        onChange={handleChange}
        className="w-full p-2 mb-3 border"
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock Quantity"
        value={formData.stock}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 mb-3 border"
      >
        <option value="">Select Category</option>
        {categories.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>


      <input type="file" name="images" id="images" multiple onChange={handleChange} className='w-full p-2 mb-3 border' />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Create Product
      </button>
    </form>
  );
};

export default AddProduct;
