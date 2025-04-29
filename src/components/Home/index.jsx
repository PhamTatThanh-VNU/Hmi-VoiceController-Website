import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./Home.css"; // Đảm bảo bạn có file Home.css nhé!

const Home = () => {
  const { videosLoading, videos, popularVideos } = useSelector(
    (state) => ({
      videosLoading: state.videos.videosLoading,
      videos: state.videos.videos,
      popularVideos: state.videos.popularVideos,
    }),
    shallowEqual
  );

  return (
    <div className="home-container">
      <div className="home-row">
        {/* Uploads */}
        <div className="home-column">
          <h1 className="home-heading">Uploads</h1>
          <div className="home-videos">
            {videosLoading ? (
              "Loading..."
            ) : (
              videos.slice(0, 5).map((video, idx) => (
                <div className="video-card" key={idx}>
                  <div className="thumbnail-wrapper">
                    <img
                      className="thumbnail-image"
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                    />
                    {/* Số thứ tự lẻ: 2*idx+1 */}
                    <div className="video-index">{2 * idx + 1}</div>
                  </div>
                  <div className="video-content">
                    <h5 className="video-title">{video.snippet.title}</h5>
                    <p className="video-description">{video.snippet.description}</p>
                  </div>
                  <div className="video-footer">
                    <Link to={`/video/${video.id.videoId}`} className="view-button">
                      <i className="fa fa-eye"></i> See Video
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Uploads */}
        <div className="home-column">
          <h1 className="home-heading">Popular Uploads</h1>
          <div className="home-videos">
            {videosLoading ? (
              "Loading..."
            ) : (
              popularVideos.slice(0, 5).map((video, idx) => (
                <div className="video-card" key={idx}>
                  <div className="thumbnail-wrapper">
                    <img
                      className="thumbnail-image"
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                    />
                    {/* Số thứ tự chẵn: 2*idx+2 */}
                    <div className="video-index">{2 * idx + 2}</div>
                  </div>
                  <div className="video-content">
                    <h5 className="video-title">{video.snippet.title}</h5>
                    <p className="video-description">{video.snippet.description}</p>
                  </div>
                  <div className="video-footer">
                    <Link to={`/video/${video.id.videoId}`} className="view-button">
                      <i className="fa fa-eye"></i> See Video
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
