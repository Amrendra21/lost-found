import { useState } from 'react';
import API from '../api/axios';

export default function AddItemForm({ onItemAdded }) {
  const [form, setForm] = useState({
    itemName: '', description: '', type: 'Lost',
    location: '', date: '', contactInfo: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/items', form);
      setMsg('✅ Item reported successfully!');
      setForm({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
      onItemAdded(); // refresh list
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error adding item'));
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h5 className="mb-3">📋 Report Lost / Found Item</h5>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <input className="form-control" name="itemName" placeholder="Item Name"
              value={form.itemName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <select className="form-select" name="type" value={form.type} onChange={handleChange}>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>
          <div className="col-12">
            <textarea className="form-control" name="description" placeholder="Description"
              rows="2" value={form.description} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input className="form-control" name="location" placeholder="Location"
              value={form.location} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input className="form-control" name="date" type="date"
              value={form.date} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <input className="form-control" name="contactInfo" placeholder="Contact Info (phone/email)"
              value={form.contactInfo} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100" type="submit">Submit Report</button>
          </div>
        </div>
      </form>
    </div>
  );
}