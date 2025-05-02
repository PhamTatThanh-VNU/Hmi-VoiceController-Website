import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { speak } from '../../api/voiceRecognition';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MicIcon from '@mui/icons-material/Mic';

const Page404 = () => {
  const theme = useTheme();

  useEffect(() => {
    const initSpeak = async () => {
      await speak("Trang này không tồn tại. Vui lòng nói 'quay lại' để quay lại trang trước đó.");
    };
    initSpeak();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0.1%, rgba(233, 226, 226, 0.28) 90.1%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 8,
            backdropFilter: 'blur(12px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 800,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.05em',
              textShadow: '4px 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            404
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Trang không tồn tại
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 4, fontSize: '1.1rem' }}
          >
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Bạn có thể nói
            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}> "quay lại" </span>
            để trở về trang trước.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              component={RouterLink}
              to="/"
              sx={{ borderRadius: '28px', px: 3, py: 1.2, fontWeight: 600 }}
            >
              Về trang chủ
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => window.history.back()}
              sx={{ borderRadius: '28px', px: 3, py: 1.2, fontWeight: 600 }}
            >
              Quay lại
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <MicIcon
              sx={{ color: theme.palette.primary.main, mr: 1, animation: 'pulse 2s infinite' }}
            />
            <Typography
              variant="body2"
              sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}
            >
              Bạn có thể sử dụng giọng nói để điều hướng trang web này.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Page404;
