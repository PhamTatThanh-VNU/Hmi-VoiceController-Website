import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { speak } from "../../api/voiceRecognition";
import { setSearchResults } from "../../redux/actionCreators/searchResultAction";
import "./Search.css";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const searchResults = useSelector((state) => state.searchResult.searchResults);

  // Hàm gọi API tìm kiếm video
  const searchVideos = async (query) => {
    if (!query.trim()) return;

    try {
      setTyping(false);
      setLoading(true);

      const response = await axios.get(import.meta.env.VITE_APP_Youtube_API, {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 25,
          q: query.trim(),
          key: import.meta.env.VITE_APP_Youtube_API_Key,
        },
      });

      const videosFound = response.data.items || [];
      dispatch(setSearchResults(videosFound));    // ➔ Lưu vào Redux
      await speak("Đã tìm xong video, đây là kết quả.");
    } catch (error) {
      console.error(error);
      await speak("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe khi người dùng đến trang /search
  useEffect(() => {
    const text = location.state?.text || "";
    setSearchText(text);
    dispatch(setSearchResults([])); // Clear kết quả cũ

    if (text) {
      searchVideos(text);
    }
  }, [location, dispatch]);

  // Xử lý khi submit form tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      searchVideos(searchText);
    }
  };

  return (
    <div className="search">
      {searchText && !typing ? (
        loading ? (
          <h2 className="search__status">Đang tìm kiếm “{searchText}”...</h2>
        ) : (
          <>
            <h2 className="search__status">
              Kết quả cho “{searchText}” ({searchResults.length})
            </h2>

            <div className="search__list">
              {searchResults.map((video, index) => (
                <Link
                  key={`${video.id.videoId}-${index}`}
                  to={`/video/${video.id.videoId}`}
                  className="search-card"
                >
                  <div className="search-card__thumb-wrap">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="search-card__thumb"
                      loading="lazy"
                    />
                    {/* Số thứ tự video */}
                    <span className="search-card__index">{index + 1}</span>
                  </div>

                  <div className="search-card__body">
                    <h4 className="search-card__title">{video.snippet.title}</h4>
                    <p className="search-card__desc">
                      {video.snippet.description}
                    </p>
                    <span className="search-card__channel">
                      {video.snippet.channelTitle}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <h1 className="search__heading">Bạn muốn tìm gì?</h1>

          <form className="search__form" onSubmit={handleSubmit}>
            <input
              className="search__input"
              placeholder="Nhập từ khóa..."
              value={searchText}
              onChange={(e) => {
                setTyping(true);
                setSearchText(e.target.value);
              }}
              onBlur={() => setTyping(false)}
            />
          </form>
        </>
      )}
    </div>
  );
};

export default Search;
