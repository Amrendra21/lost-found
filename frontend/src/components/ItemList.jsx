import { useState } from 'react';
import API from '../api/axios';

export default function ItemList({ items, currentUserId, onRefresh }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      itemName: item.itemName, description: item.description,
      type: item.type, location: item.location,
      date: item.date?.slice(0, 10), contactInfo: item.contactInfo
    });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdate = async (id) => {
    try {
      await API.put(`/items/${id}`, editForm);
      setEditId(null);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (items.length === 0)
    return <p className="text-muted text-center mt-4">No items found.</p>;

  return (
    <div className="row g-3">
      {items.map(item => (
        <div className="col-md-6" key={item._id}>
          <div className={`card h-100 shadow-sm border-${item.type === 'Lost' ? 'danger' : 'success'}`}>
            <div className="card-body">
              {editId === item._id ? (
                // Edit Mode
                <>
                  <input className="form-control mb-2" name="itemName"
                    value={editForm.itemName} onChange={handleEditChange} />
                  <textarea className="form-control mb-2" name="description"
                    value={editForm.description} onChange={handleEditChange} />
                  <select className="form-select mb-2" name="type"
                    value={editForm.type} onChange={handleEditChange}>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                  <input className="form-control mb-2" name="location"
                    value={editForm.location} onChange={handleEditChange} />
                  <input className="form-control mb-2" type="date" name="date"
                    value={editForm.date} onChange={handleEditChange} />
                  <input className="form-control mb-2" name="contactInfo"
                    value={editForm.contactInfo} onChange={handleEditChange} />
                  <button className="btn btn-primary btn-sm me-2"
                    onClick={() => handleUpdate(item._id)}>Save</button>
                  <button className="btn btn-secondary btn-sm"
                    onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                // View Mode
                <>
                  <span className={`badge bg-${item.type === 'Lost' ? 'danger' : 'success'} mb-2`}>
                    {item.type}
                  </span>
                  <h5 className="card-title">{item.itemName}</h5>
                  <p className="card-text text-muted mb-1">{item.description}</p>
                  <p className="mb-1">📍 {item.location}</p>
                  <p className="mb-1">📅 {new Date(item.date).toLocaleDateString()}</p>
                  <p className="mb-1">📞 {item.contactInfo}</p>
                  <p className="mb-2 text-muted small">
                    Posted by: {item.postedBy?.name}
                  </p>
                  {item.postedBy?._id === currentUserId && (
                    <div className="mt-2">
                      <button className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(item)}>Edit</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}