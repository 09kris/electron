import React, { useState } from 'react';
import axios from 'axios';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gstNo: '',
    Logo: null,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'Logo') {
      setFormData({ ...formData, Logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = new FormData();
      data.append('storeName', formData.storeName);
      data.append('ownerName', formData.ownerName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('gstNo', formData.gstNo);
      if (formData.Logo) data.append('logo', formData.Logo);

      const res = await axios.post('http://localhost:8000/seller/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      alert(res.data.message);

      setFormData({
        storeName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        gstNo: '',
        Logo: null,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Seller Registration</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="text"
        name="storeName"
        placeholder="Store Name"
        value={formData.storeName}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="text"
        name="ownerName"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="text"
        name="gstNo"
        placeholder="GST Number"
        value={formData.gstNo}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded"
      />

      <input
        type="file"
        name="Logo"
        accept="image/*"
        onChange={handleChange}
        className="w-full mb-3"
      />

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default SellerRegister;
