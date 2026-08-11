import { useState, useEffect } from "react";

export default function Home({ navigate }) {
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const api_url = import.meta.env.VITE_API_URL;


    useEffect(() => {
        async function fetchFeaturedVideos() {
            try {
                setLoading(true);

                // Need to set env route for production vs development
                const response = await fetch(`${api_url}/api/videos?category=featured`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFeaturedVideos(data);
            } catch (err) {
                console.error('Error fetching featured videos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedVideos();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">[Title]</h1>
                <p className="hero-subtitle">[Subtitle]</p>
                <button className="btn-primary" onClick={() => navigate('contact')}>
                    [Contact Us Phrase]
                </button>
            </section>

            {/* Featured Showcase */}
            <section className="featured-showcase">
                <h2 className="section-title">Featured Work</h2>
                {loading && <p className="status-message">Loading featured videos...</p>}
                {error && <p className="status-message error">Error: {error}</p>}

                {!loading && !error && featuredVideos.length === 0 && (
                    <p className="status-message">No featured videos available.</p>
                )}

                <div className="video-grid">
                    {featuredVideos.map((video) => (
                        <div key={video.id} className="video-card">
                            <div className="thumbnail-wrapper">
                                {video.thumbnail_url ? (
                                    <img
                                        src={`${api_url}${video.thumbnail_url}`}
                                        alt={`Thumbnail for ${video.title}`}
                                        className="video-thumbnail"
                                    />
                                ) : (
                                    <div className="thumbnail-placeholder">No Thumbnail</div>
                                )}
                            </div>
                            <div className="video-info">
                                <h3 className="video-title">{video.title}</h3>
                                <p className="client-names">{video.client_names}</p>
                                {video.description && <p className="video-description">{video.description}</p>}
                                <a
                                    href={video.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="watch-link"
                                >
                                    Watch Film →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}