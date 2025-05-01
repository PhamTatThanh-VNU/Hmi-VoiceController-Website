import React, { useState, useEffect } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink, useLocation } from 'react-router-dom';

// MUI components
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  alpha,
  Badge
} from '@mui/material';

// MUI icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: <HomeIcon /> },
    { name: 'Videos', path: '/videos', icon: <VideoLibraryIcon /> },
    { name: 'Trò chuyện', path: '/chat', icon: <ChatIcon /> },
    { name: 'Hướng dẫn', path: '/instruction', icon: <HelpIcon /> },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleMic = () => {
    setIsListening(!isListening);
  };

  const drawerList = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
          background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          color: 'white',
          mb: 2
        }}
      >
        <KeyboardVoiceIcon
          sx={{
            width: 50,
            height: 50,
            mb: 2,
            color: 'white',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
          }}
        />
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Voice Controller
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Điều khiển bằng giọng nói
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.path}
            sx={{
              my: 0.5,
              mx: 1,
              px: 2,
              py: 1.5,
              borderRadius: '10px',
              color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
              bgcolor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 500 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: scrolled ? '70px' : '80px', transition: 'height 0.3s ease' }}>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                color: 'white',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <KeyboardVoiceIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 800,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VOICE CONTROLLER
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterNavLink}
                  to={item.path}
                  sx={{
                    my: 2,
                    mx: 1,
                    px: 3,
                    color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: isActive(item.path) ? 600 : 500,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: isActive(item.path) ? theme.palette.primary.main : 'transparent',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': {
                        backgroundColor: isActive(item.path) ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                      }
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Tìm kiếm">
              <Button
                component={RouterLink}
                to={{ pathname: '/search', state: { text: '' } }}
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                sx={{
                  mr: 2,
                  borderRadius: '12px',
                  py: 1,
                  boxShadow: 2,
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  '&:hover': {
                    boxShadow: 4,
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {!isMobile && 'Tìm kiếm'}
              </Button>
            </Tooltip>
            <Tooltip title={isListening ? "Đang nghe..." : "Kích hoạt giọng nói"}>
              <IconButton
                className="mic-button"
                onClick={toggleMic}
                sx={{
                  p: 1.5,
                  bgcolor: isListening ? alpha(theme.palette.error.main, 0.9) : alpha(theme.palette.secondary.main, 0.9),
                  color: 'white',
                  '&:hover': {
                    bgcolor: isListening ? theme.palette.error.main : theme.palette.secondary.main,
                  },
                  transition: 'all 0.3s ease',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  boxShadow: isListening
                    ? '0 0 0 rgba(139, 92, 246, 0.4)'
                    : '0 4px 12px rgba(139, 92, 246, 0.3)',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: `0 0 0 0 ${isListening ? 'rgba(239, 68, 68, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
                    },
                    '70%': {
                      boxShadow: `0 0 0 12px ${isListening ? 'rgba(239, 68, 68, 0)' : 'rgba(139, 92, 246, 0)'}`,
                    },
                    '100%': {
                      boxShadow: `0 0 0 0 ${isListening ? 'rgba(239, 68, 68, 0)' : 'rgba(139, 92, 246, 0)'}`,
                    },
                  },
                }}
              >
                <Badge
                  variant="dot"
                  color="error"
                  invisible={!isListening}
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <MicIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '0 16px 16px 0',
          }
        }}
      >
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
