import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { addVideoDetail } from '../../redux/actionCreators/videoDetailActionCreator';

import './CurrentVideo.css';

const CurrentVideo = ({ setVideoRef }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { videoDeatilLoading, videoDetail, videosAll, videosLoading } =
    useSelector((state) => ({
      videoDeatilLoading: state.videoDetail.videoDetailLoading,
      videoDetail: state.videoDetail.video,
      videosAll: state.videos.videos,
      videosLoading: state.videos.videosLoading,
    }));

  const relatedVideos = videosAll.filter((video) => video.id.videoId !== id);
  
  // Auto scroll lên đầu trang + fetch detail mỗi khi id thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // cuộn mượt; bỏ behavior nếu muốn ngay lập tức
    dispatch(addVideoDetail(id));
  }, [dispatch, id]);

  const opts = {
    height: '580',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="current-video-container">
      <div className="main-video-section">
        {videoDeatilLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="main-video-card">
            <YouTube
              videoId={id}
              opts={opts}
              onReady={(event) => setVideoRef(event.target)}
            />
            <div className="video-details">
              <div className="stats">
                <p>{videoDetail.items[0].statistics.viewCount} Views</p>
                <div className="likes-dislikes">
                  <p>
                    <i className="fa fa-thumbs-up"></i>{' '}
                    {videoDetail.items[0].statistics.likeCount}
                  </p>
                  <p>
                    <i className="fa fa-thumbs-down"></i>{' '}
                    {videoDetail.items[0].statistics.dislikeCount}
                  </p>
                </div>
              </div>
              <h2>{videoDetail.items[0].snippet.title}</h2>
              <p>{videoDetail.items[0].snippet.description}</p>
              <p className="comments-count">
                {videoDetail.items[0].statistics.commentCount} Comments
              </p>
            </div>
            <div className="video-tags">
              {videoDetail.items[0].snippet.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="related-title">Related Videos</h3>

      <div className="related-videos-grid">
        {videosLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          relatedVideos.map((video, idx) => (
            <div className="related-video-card" key={idx}>
              <div className="thumbnail-wrapper">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="related-thumbnail"
                />
                <div className="video-index">{idx + 1}</div>{' '}
                {/* 🎯 Số thứ tự nằm trên ảnh */}
              </div>

              <div className="related-info">
                <h4 className="related-title">{video.snippet.title}</h4>
                <p className="related-description">
                  {video.snippet.description}
                </p>
              </div>
              <div className="related-footer">
                <Link to={`/video/${video.id.videoId}`} className="view-button">
                  <i className="fa fa-eye"></i> Watch Video
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CurrentVideo;
