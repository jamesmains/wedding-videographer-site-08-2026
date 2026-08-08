// client/src/pages/Admin.jsx
import { useState, useEffect } from 'react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Dashboard Data
  const [inquiries, setInquiries] = useState([]);
  const [videos, setVideos] = useState([]);
  
  // Upload Form State
  const [videoForm, setVideoForm] = useState({
    title: '',
    client_names: '',
    video_url: '',
    description: '',
    category: 'gallery'
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Check existing session on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/admin/check', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchDashboardData();
        }
      });
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [inqRes, vidRes] = await Promise.all([
        fetch('http://localhost:3000/api/inquiries', { credentials: 'include' }),
        fetch('http://localhost:3000/api/videos')
      ]);

      if (inqRes.ok) setInquiries(await inqRes.json());
      if (vidRes.ok) setVideos(await vidRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Sends session cookie
        body: JSON.stringify({ password })
      });

      if (!res.ok) throw new Error('Invalid Password');

      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploadStatus('Uploading...');

    const formData = new FormData();
    Object.keys(videoForm).forEach(key => formData.append(key, videoForm[key]));
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    try {
      const res = await fetch('http://localhost:3000/api/videos', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      setUploadStatus('✨ Video added successfully!');
      setVideoForm({ title: '', client_names: '', video_url: '', description: '', category: 'gallery' });
      setThumbnailFile(null);
      fetchDashboardData();
    } catch (err) {
      setUploadStatus(`❌ ${err.message}`);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    await fetch(`http://localhost:3000/api/videos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    fetchDashboardData();
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await fetch(`http://localhost:3000/api/inquiries/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    fetchDashboardData();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        {loginError && <p className="alert alert-error">{loginError}</p>}
        <form onSubmit={handleLogin} className="inquiry-form">
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter admin password"
              required 
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Upload Video Section */}
      <section className="form-section admin-section">
        <h2>Add New Video</h2>
        {uploadStatus && <p className="status-message">{uploadStatus}</p>}
        <form onSubmit={handleUploadVideo} className="inquiry-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input 
                type="text" 
                required 
                value={videoForm.title} 
                onChange={e => setVideoForm({...videoForm, title: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Client Names *</label>
              <input 
                type="text" 
                required 
                value={videoForm.client_names} 
                onChange={e => setVideoForm({...videoForm, client_names: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Video URL (Vimeo/YouTube) *</label>
              <input 
                type="url" 
                required 
                value={videoForm.video_url} 
                onChange={e => setVideoForm({...videoForm, video_url: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={videoForm.category} 
                onChange={e => setVideoForm({...videoForm, category: e.target.value})}
                style={{ padding: '0.75rem', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}
              >
                <option value="gallery">Gallery</option>
                <option value="featured">Featured (Home Page)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setThumbnailFile(e.target.files[0])} 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              rows="2" 
              value={videoForm.description} 
              onChange={e => setVideoForm({...videoForm, description: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-primary">Upload Video</button>
        </form>
      </section>

      {/* Inquiries Section */}
      <section className="admin-section">
        <h2>Client Inquiries ({inquiries.length})</h2>
        {inquiries.length === 0 ? <p>No inquiries yet.</p> : (
          <div className="inquiry-list">
            {inquiries.map(inq => (
              <div key={inq.id} className="video-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <h3>{inq.name} ({inq.email})</h3>
                <p><strong>Date:</strong> {inq.event_date || 'N/A'} | <strong>Venue:</strong> {inq.venue || 'N/A'}</p>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{inq.message}</p>
                <button 
                  onClick={() => handleDeleteInquiry(inq.id)} 
                  style={{ marginTop: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Manage Videos Section */}
      <section className="admin-section">
        <h2>Manage Existing Videos ({videos.length})</h2>
        <div className="video-grid">
          {videos.map(vid => (
            <div key={vid.id} className="video-card">
              <div className="video-info">
                <h3>{vid.title} ({vid.category})</h3>
                <p className="client-names">{vid.client_names}</p>
                <button 
                  onClick={() => handleDeleteVideo(vid.id)} 
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  Delete Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}