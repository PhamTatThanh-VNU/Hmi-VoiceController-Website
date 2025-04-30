import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
  Chip,
  Fade,
  useTheme,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import "./Home.css";

const Home = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
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

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDuration = (duration) => {
    // Simulated for demo since actual duration might not be available
    return "10:30";
  };

  const VideoCard = ({ video, index, isPopular }) => {
    const [hover, setHover] = useState(false);

    return (
      <Fade in={loaded} style={{ transitionDelay: `${index * 100}ms` }}>
        <Card
          className="video-card-modern"
          elevation={hover ? 8 : 2}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'all 0.3s ease',
            transform: hover ? "translateY(-8px)" : "none",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Fixed aspect ratio container for thumbnails */}
          <Box sx={{
            position: "relative",
            paddingTop: "56.25%", // 16:9 aspect ratio
            overflow: "hidden"
          }}>
            <CardMedia
              component="img"
              image={video?.snippet?.thumbnails?.high?.url || "https://via.placeholder.com/320x180?text=No+Image"}
              alt={video?.snippet?.title || "Video thumbnail"}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                transform: hover ? "scale(1.05)" : "scale(1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: hover
                  ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)"
                  : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)",
                transition: "all 0.3s ease",
              }}
            />
            <Chip
              label={`#${index + 1}`}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: isPopular ? theme.palette.error.main : theme.palette.primary.main,
                color: "#fff",
                fontWeight: "bold",
                zIndex: 2,
              }}
            />
            <Chip
              icon={<VisibilityIcon sx={{ fontSize: "16px !important", color: "#fff !important" }} />}
              label="10K views"
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                zIndex: 2,
                "& .MuiChip-label": {
                  fontSize: "0.7rem",
                }
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                zIndex: 2,
              }}
            >
              {formatDuration(video?.duration)}
            </Box>
            {hover && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <PlayArrowIcon
                    sx={{
                      color: isPopular ? theme.palette.error.main : theme.palette.primary.main,
                      fontSize: 35,
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Fixed height content area */}
          <CardContent sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            height: { xs: 'auto', sm: '180px' } // Responsive height
          }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '2.8rem',
              }}
            >
              {truncateText(video?.snippet?.title || "Untitled Video", 60)}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.825rem",
                lineHeight: 1.5,
                mb: 2,
                flexGrow: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {truncateText(video?.snippet?.description || "No description available", 85)}
            </Typography>

            <Button
              component={Link}
              to={`/video/${video?.id?.videoId || "unknown"}`}
              fullWidth
              variant="contained"
              size="small"
              startIcon={<VisibilityIcon />}
              sx={{
                background: isPopular
                  ? `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                  : `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: hover ? 4 : 1,
                transition: "all 0.3s ease",
                height: '36px',
                mt: 'auto' // Push to bottom
              }}
            >
              Xem video
            </Button>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const VideoSkeleton = () => (
    <Card sx={{ height: "100%", borderRadius: "16px" }}>
      <Skeleton variant="rectangular" sx={{ paddingTop: "56.25%" }} animation="wave" />
      <CardContent sx={{ height: { xs: 'auto', sm: '180px' } }}>
        <Skeleton animation="wave" height={25} sx={{ mt: 1, mb: 2 }} />
        <Skeleton animation="wave" height={60} />
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Skeleton animation="wave" height={36} width="100%" />
        </Box>
      </CardContent>
    </Card>
  );

  const renderSkeletons = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={`skeleton-${index}`}>
          <VideoSkeleton />
        </Grid>
      ));
  };

  return (
    <Box className="home-page">
      {/* Center-aligned container with a max width */}
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
            position: "relative",
            width: '100%',
            maxWidth: '1200px'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Voice Controller App
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "700px",
              mx: "auto",
              mb: 3,
            }}
          >
            Điều khiển video và nội dung bằng giọng nói của bạn
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/instruction"
              startIcon={<SchoolIcon />}
              sx={{
                borderRadius: "30px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: 3,
              }}
            >
              Xem hướng dẫn
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              to="/videos"
              startIcon={<VisibilityIcon />}
              sx={{
                borderRadius: "30px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              Xem tất cả video
            </Button>
          </Box>
        </Box>

        {/* Popular Videos Section */}
        <Box sx={{ mb: 6, width: '100%', maxWidth: '1200px' }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <LocalFireDepartmentIcon
              sx={{ color: theme.palette.error.main, fontSize: 28 }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Video phổ biến
            </Typography>
          </Box>

          {/* Centered grid with consistent spacing */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
          >
            {videosLoading
              ? renderSkeletons(3) // Giảm từ 4 xuống 3 để khớp với hình ảnh
              : (Array.isArray(popularVideos) ? popularVideos : []).slice(0, 3).map((video, idx) => ( // Giảm từ 4 xuống 3
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={idx}
                >
                  <VideoCard video={video} index={idx} isPopular={true} />
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Uploaded Videos Section */}
        <Box sx={{ mb: 4, width: '100%', maxWidth: '1200px' }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <PlayArrowIcon
              sx={{ color: theme.palette.primary.main, fontSize: 28 }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Video đã tải lên
            </Typography>
          </Box>

          {/* Centered grid with consistent spacing */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
          >
            {videosLoading
              ? renderSkeletons(6)
              : (Array.isArray(videos) ? videos : []).slice(0, 6).map((video, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={idx}
                >
                  <VideoCard video={video} index={idx} isPopular={false} />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;