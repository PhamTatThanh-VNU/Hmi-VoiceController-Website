import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import "./Videos.css";

const Videos = ({ start, end, nextPage, prevPage, countPages }) => {
  const { videosLoading, videos } = useSelector(
    (state) => ({
      videosLoading: state.videos.videosLoading,
      videos: state.videos.videos,
    }),
    shallowEqual
  );

  const totalPages = Math.ceil(videos.length / 12);

  return (
    <div className="videos">
      <h1 className="videos__heading">
        Videos – Page {countPages} of {totalPages}
      </h1>

      {videosLoading ? (
        <p className="videos__loading">Loading videos…</p>
      ) : (
        <div className="videos__grid">
          {videos.slice(start, end).map((video, idx) => {
            const globalIndex = start + idx + 1;                 // số thứ tự
            return (
              <div className="video-card" key={video.id.videoId}>
                <div className="video-card__thumb-wrap">
                  <img
                    className="video-card__thumb"
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                  />
                  <span className="video-card__index">{globalIndex}</span>
                </div>

                <div className="video-card__body">
                  <h5 className="video-card__title">{video.snippet.title}</h5>
                  <p className="video-card__desc">
                    {video.snippet.description}
                  </p>
                </div>

                <Link
                  to={`/video/${video.id.videoId}`}
                  className="video-card__button"
                >
                  <i className="fa fa-eye" /> See Video
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className="videos__pagination">
        <button
          className="videos__btn"
          disabled={start === 0}
          onClick={prevPage}
        >
          <i className="fas fa-angle-left" /> Prev
        </button>

        <button
          className="videos__btn"
          disabled={videos.length <= end}
          onClick={nextPage}
        >
          Next <i className="fas fa-angle-right" />
        </button>
      </div>
    </div>
  );
};

export default Videos;
