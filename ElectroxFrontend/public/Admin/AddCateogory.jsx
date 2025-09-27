import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    description: '',
    image: null // will store the File object
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleFileChange = (e) => {
    setCategory({ ...category, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('image', category.image);

    try {
      const res = await axios.post('http://localhost:8000/admin/addCategory', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(res.data.message || 'Category created successfully');
      setCategory({ name: '', description: '', image: null });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto" encType="multipart/form-data">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={category.name}
        onChange={handleChange}
        required
        className="block w-full mb-3 px-4 py-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={category.description}
        onChange={handleChange}
        required
        className="block w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        required
        className="block w-full mb-3 px-4 py-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Category
      </button>
    </form>
  );
};

export default AddCategory;
