import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import AddItemForm from '../components/AddItemForm';
import ItemList from '../components/ItemList';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return fetchItems();
    try {
      const res = await API.get(`/items/search?name=${search}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <AddItemForm onItemAdded={fetchItems} />

        {/* Search Bar */}
        <div className="input-group mb-4">
          <input
            className="form-control"
            placeholder="🔍 Search items by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-outline-secondary" onClick={() => { setSearch(''); fetchItems(); }}>
            Clear
          </button>
        </div>

        <h5 className="mb-3">📦 All Reported Items ({items.length})</h5>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <ItemList items={items} currentUserId={user.id} onRefresh={fetchItems} />
        )}
      </div>
    </>
  );
}