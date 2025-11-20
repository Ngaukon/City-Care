import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', community: '', image: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/posts', form);
      navigate('/');
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Issue Title"
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Describe the issue..."
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        ></textarea>
        <input
          type="text"
          placeholder="Community (e.g. Downtown)"
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, community: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Post Issue</button>
      </form>
    </div>
  );
}
