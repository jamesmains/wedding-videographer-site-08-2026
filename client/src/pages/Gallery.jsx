import {useState, useEffect} from 'react';

export default function Gallery({ navigate }) {
    const [galleryVideos, setGalleryVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGalleryVideos() {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/videos?category=gallery');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setGalleryVideos(data);
            } catch (err) {
                console.error('Error fetching gallery videos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchGalleryVideos();
    }, []);

    return (
    <div className="gallery-page">
      <header className="page-header">
        <h1 className="page-title">Films Gallery</h1>
        <p className="page-subtitle">A collection of love stories brought to life.</p>
      </header>

      {loading && <p className="status-message">Loading film collection...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && galleryVideos.length === 0 && (
        <div className="empty-gallery">
          <p className="status-message">No gallery films available yet.</p>
          <button className="btn-primary" onClick={() => navigate('contact')}>
            Inquire About Your Date
          </button>
        </div>
      )}

      <div className="video-grid">
        {galleryVideos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="thumbnail-wrapper">
              {video.thumbnail_url ? (
                <img 
                  src={`http://localhost:3000${video.thumbnail_url}`} 
                  alt={video.title} 
                  className="video-thumbnail"
                />
              ) : (
                <div className="thumbnail-placeholder">No Thumbnail</div>
              )}
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="client-names">{video.client_names}</p>
              {video.description && <p className="video-desc">{video.description}</p>}
              <a 
                href={video.video_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="watch-link"
              >
                Watch Full Film →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}