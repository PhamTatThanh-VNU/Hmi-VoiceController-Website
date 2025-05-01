import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const ROTATION_INTERVAL = 3000; // Thời gian chuyển đổi tab (5 giây)

  const { videosLoading, videos, popularVideos } = useSelector(
    (state) => ({
      videosLoading: state.videos.videosLoading,
      videos: state.videos.videos,
      popularVideos: state.videos.popularVideos,
    }),
    shallowEqual
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Thêm useEffect để tự động luân phiên giữa các tab
  useEffect(() => {
    let rotationTimer;
    rotationTimer = setInterval(() => {
      setActiveTab(prevTab => prevTab === "popular" ? "uploaded" : "popular");
    }, ROTATION_INTERVAL);
    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, []);

  // Hàm xử lý khi người dùng chủ động chọn tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDuration = (duration) => {
    // Simulated for demo
    return "10:30";
  };

  const formatViews = (views) => {
    // Simulated for demo
    return "10K";
  };

  const VideoCard = ({ video, index, isPopular }) => {
    const [hover, setHover] = useState(false);

    return (
      <div
        className={`video-card ${hover ? 'hovered' : ''} ${isPopular ? 'popular' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="video-thumb-container">
          <div className="video-rank">{index + 1}</div>
          <div className="video-views">
            <i className="fa fa-eye"></i> {formatViews(video?.statistics?.viewCount)}
          </div>
          <div className="video-duration">{formatDuration(video?.duration)}</div>
          <img
            src={video?.snippet?.thumbnails?.high?.url || "https://via.placeholder.com/320x180?text=No+Image"}
            alt={truncateText(video?.snippet?.title, 30)}
            className="video-thumb"
          />
          {hover && (
            <div className="video-overlay">
              <div className="play-button">
                <i className="fa fa-play"></i>
              </div>
            </div>
          )}
        </div>
        <div className="video-content">
          <h3 className="video-title">{truncateText(video?.snippet?.title || "Untitled Video", 60)}</h3>
          <p className="video-description">{truncateText(video?.snippet?.description || "No description available", 85)}</p>
          <Link to={`/video/${video?.id?.videoId || "unknown"}`} className="watch-button">
            <span>Xem video</span>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    );
  };

  const VideoSkeleton = () => (
    <div className="video-card skeleton">
      <div className="video-thumb-container skeleton-thumb"></div>
      <div className="video-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-desc"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const renderSkeletons = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => <VideoSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Voice Controller App</h1>
          <p className="hero-desc">Điều khiển video và nội dung bằng giọng nói của bạn</p>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle circle-1"></div>
          <div className="hero-circle circle-2"></div>
          <div className="hero-circle circle-3"></div>
          <div className="hero-wave"></div>
        </div>
      </div>

      <div className="content-section">
        <div className="tabs-container">
          <div
            className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => handleTabClick("popular")}
          >
            <i className="fa fa-fire"></i> Video phổ biến
            {activeTab === 'popular' && <div className="tab-indicator"></div>}
          </div>
          <div
            className={`tab ${activeTab === 'uploaded' ? 'active' : ''}`}
            onClick={() => handleTabClick("uploaded")}
          >
            <i className="fa fa-upload"></i> Video đã tải lên
            {activeTab === 'uploaded' && <div className="tab-indicator"></div>}
          </div>
        </div>

        <div className="videos-grid">
          {videosLoading ? (
            renderSkeletons(activeTab === "popular" ? 3 : 6)
          ) : (
            <>
              {activeTab === "popular" &&
                (Array.isArray(popularVideos) ? popularVideos : [])
                  .slice(0, 6)
                  .map((video, idx) => (
                    <VideoCard
                      key={`popular-${idx}`}
                      video={video}
                      index={idx}
                      isPopular={true}
                    />
                  ))}

              {activeTab === "uploaded" &&
                (Array.isArray(videos) ? videos : [])
                  .slice(0, 9)
                  .map((video, idx) => (
                    <VideoCard
                      key={`uploaded-${idx}`}
                      video={video}
                      index={idx}
                      isPopular={false}
                    />
                  ))}
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Các tính năng nổi bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-microphone"></i>
            </div>
            <h3>Điều khiển bằng giọng nói</h3>
            <p>Ra lệnh bằng giọng nói để tìm kiếm, phát, tạm dừng, và điều chỉnh video</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-bolt"></i>
            </div>
            <h3>Phản hồi tức thì</h3>
            <p>Hệ thống phản hồi nhanh chóng với độ chính xác cao</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fa fa-universal-access"></i>
            </div>
            <h3>Trợ năng cao</h3>
            <p>Thiết kế phù hợp với mọi người dùng, kể cả người khuyết tật</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;