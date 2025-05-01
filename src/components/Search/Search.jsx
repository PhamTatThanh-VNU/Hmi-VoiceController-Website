import { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { speak } from "../../api/voiceRecognition";
import { setSearchResults } from "../../redux/actionCreators/searchResultAction";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Fade,
  Paper,
  useTheme,
  alpha,
  Skeleton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import ClearIcon from "@mui/icons-material/Clear";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewsIcon from "@mui/icons-material/Visibility";
import "./Search.css";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const searchResults = useSelector((state) => state.searchResult.searchResults);

  // Hàm gọi API tìm kiếm video
  const searchVideos = async (query) => {
    if (!query.trim()) return;

    try {
      setTyping(false);
      setLoading(true);
      setNoResults(false);

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
      dispatch(setSearchResults(videosFound)); // ➔ Lưu vào Redux

      if (videosFound.length === 0) {
        setNoResults(true);
        await speak("Không tìm thấy kết quả phù hợp. Vui lòng thử từ khóa khác.");
      } else {
        await speak(`Đã tìm thấy ${videosFound.length} kết quả.`);
      }
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
      // Update URL state
      history.replace({ pathname: '/search', state: { text: searchText } });
      searchVideos(searchText);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    dispatch(setSearchResults([]));
    setNoResults(false);
    history.replace({ pathname: '/search', state: { text: "" } });
  };

  const activateVoiceSearch = () => {
    speak("Vui lòng nói từ khóa tìm kiếm bắt đầu bằng từ 'tìm kiếm'");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Skeleton loader for search results
  const SearchSkeleton = () => (
    <Card sx={{ display: 'flex', mb: 2, overflow: 'hidden', borderRadius: '12px' }}>
      <Skeleton variant="rectangular" width={280} height={157} animation="wave" />
      <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, py: 1, width: '100%' }}>
        <Skeleton animation="wave" height={30} width="90%" sx={{ mb: 1 }} />
        <Skeleton animation="wave" height={20} width="70%" sx={{ mb: 1 }} />
        <Skeleton animation="wave" height={20} width="50%" sx={{ mb: 1 }} />
        <Skeleton animation="wave" height={20} width="40%" sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', mt: 'auto' }}>
          <Skeleton animation="wave" height={30} width={100} sx={{ mr: 1 }} />
          <Skeleton animation="wave" height={30} width={100} />
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box
      className="search-page"
      sx={{
        py: 4,
        minHeight: 'calc(100vh - 80px)',
        background: `
          radial-gradient(at 10% 10%, ${alpha(theme.palette.primary.light, 0.05)}, transparent 50%),
          radial-gradient(at 90% 90%, ${alpha(theme.palette.secondary.light, 0.07)}, transparent 50%)
        `,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
            {searchText && !typing && !loading ? (
              `Kết quả tìm kiếm (${searchResults.length})`
            ) : (
              "Tìm kiếm video bằng giọng nói"
            )}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập từ khóa tìm kiếm hoặc ra lệnh bằng giọng nói..."
              value={searchText}
              onChange={(e) => {
                setTyping(true);
                setSearchText(e.target.value);
              }}
              onBlur={() => setTyping(false)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchText && (
                      <IconButton onClick={clearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={activateVoiceSearch}
                      sx={{
                        ml: 1,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.secondary.main, 0.2),
                        }
                      }}
                    >
                      <MicIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  py: 0.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Thử tìm kiếm:
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Âm nhạc thư giãn', 'Học tiếng Anh', 'Nấu ăn'].map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      onClick={() => {
                        setSearchText(suggestion);
                        searchVideos(suggestion);
                        history.replace({ pathname: '/search', state: { text: suggestion } });
                      }}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!searchText.trim() || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{
                  px: 3,
                  height: 'fit-content',
                  alignSelf: 'flex-end',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </Box>
          </form>
        </Paper>

        {loading ? (
          <Box sx={{ mt: 4 }}>
            {[1, 2, 3, 4].map((i) => <SearchSkeleton key={i} />)}
          </Box>
        ) : noResults ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Không tìm thấy kết quả cho "{searchText}"
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng thử lại với từ khóa khác hoặc kiểm tra lỗi chính tả
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={clearSearch}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Tìm kiếm mới
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {searchResults.map((video, index) => (
              <Grid item xs={12} key={`${video.id.videoId}-${index}`}>
                <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      overflow: 'hidden',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', width: { xs: '100%', sm: 280 } }}>
                      <CardMedia
                        component="img"
                        sx={{ height: 157, objectFit: 'cover' }}
                        image={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                          bgcolor: 'rgba(0,0,0,0.3)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            opacity: 1,
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                          }}
                        >
                          <PlayArrowIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
                        </Box>
                      </Box>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          bgcolor: theme.palette.primary.main,
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {video.snippet.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {video.snippet.description || "Không có mô tả"}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            size="small"
                            icon={<VideocamIcon sx={{ fontSize: '1rem !important' }} />}
                            label={video.snippet.channelTitle}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />}
                            label={formatDate(video.snippet.publishedAt)}
                            sx={{ fontSize: '0.75rem' }}
                          />
                          <Chip
                            size="small"
                            icon={<ViewsIcon sx={{ fontSize: '1rem !important' }} />}
                            label="10K lượt xem"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>

                        <Button
                          component={Link}
                          to={`/video/${video.id.videoId}`}
                          variant="contained"
                          color="primary"
                          startIcon={<PlayArrowIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          }}
                        >
                          Xem video
                        </Button>
                      </CardContent>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Search;
