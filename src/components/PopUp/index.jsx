// InstructionScreen.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { speak } from '../../api/voiceRecognition';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  alpha,
  Slide,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigationIcon from '@mui/icons-material/Navigation';
import HistoryIcon from '@mui/icons-material/History';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PaginationIcon from '@mui/icons-material/FindReplace';
import MouseIcon from '@mui/icons-material/Mouse';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import './style.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PopUp = ({ setPopUp, setIsRecognitionActive }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleStart = async () => {
    setPopUp(false);
    toast.success('🎤 Hãy ra lệnh bằng giọng nói', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    await speak('Hãy ra lệnh bằng giọng nói');
    setIsRecognitionActive(true);
  };

  const sections = [
    {
      id: 'voice',
      title: 'Điều khiển giọng nói',
      icon: <VolumeUpIcon />,
      commands: [
        { commands: ['dừng nhận'], info: 'Dừng chế độ nhận lệnh giọng nói.' },
        { commands: ['bật nghe'], info: 'Bật lại chế độ nhận lệnh giọng nói.' },
      ],
    },
    {
      id: 'navigation',
      title: 'Điều hướng trang',
      icon: <NavigationIcon />,
      commands: [
        {
          commands: ['đi tới <tên trang>'],
          info: "Đi tới trang mong muốn. VD: 'đi tới trang chủ'",
          examples: ['đi tới trang chủ', 'đi tới videos', 'đi tới tìm kiếm']
        },
      ],
    },
    {
      id: 'history',
      title: 'Điều khiển lịch sử',
      icon: <HistoryIcon />,
      commands: [
        {
          commands: ['quay lại', 'tiến tới'],
          info: 'Di chuyển qua lại giữa các trang.',
        },
      ],
    },
    {
      id: 'open-video',
      title: 'Mở Video',
      icon: <VideoLibraryIcon />,
      commands: [
        {
          commands: ['mở video số <n>'],
          info: 'Mở video dựa trên số thứ tự.',
          examples: ['mở video số 1', 'mở video số 5']
        },
      ],
    },
    {
      id: 'control-video',
      title: 'Điều khiển Video',
      icon: <PlayCircleIcon />,
      commands: [
        {
          commands: ['phát video', 'tạm dừng video'],
          info: 'Phát hoặc tạm dừng video.',
        },
        {
          commands: ['tua tới <n> giây', 'lùi <n> giây'],
          info: 'Tua video tới/lùi thời gian.',
          examples: ['tua tới 30 giây', 'lùi 10 giây']
        },
      ],
    },
    {
      id: 'pagination',
      title: 'Chuyển trang',
      icon: <PaginationIcon />,
      commands: [
        {
          commands: ['trang tiếp', 'trang trước'],
          info: 'Chuyển sang trang video kế tiếp hoặc trước đó.',
        },
      ],
    },
    {
      id: 'scroll',
      title: 'Cuộn Trang',
      icon: <MouseIcon />,
      commands: [
        {
          commands: ['kéo xuống', 'kéo lên', 'cuối trang', 'đầu trang'],
          info: 'Cuộn trang lên, xuống hoặc tới đầu/cuối trang.',
        },
      ],
    },
    {
      id: 'search',
      title: 'Tìm kiếm',
      icon: <SearchIcon />,
      commands: [
        {
          commands: ['tìm kiếm <từ khoá>'],
          info: 'Tìm kiếm nội dung theo từ khoá.',
          examples: ['tìm kiếm cách học tiếng anh', 'tìm kiếm âm nhạc thư giãn']
        },
      ],
    },
    {
      id: 'form',
      title: 'Gửi Biểu Mẫu',
      icon: <SendIcon />,
      commands: [
        { commands: ['gửi biểu mẫu'], info: 'Gửi form đã điền thông tin.' },
      ],
    },
  ];

  const filteredSections = activeTab === 0
    ? sections
    : sections.filter((_, index) => index === activeTab - 1);

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backgroundImage: `radial-gradient(at 100% 0%, ${alpha(theme.palette.primary.light, 0.15)} 0px, transparent 50%), 
                           radial-gradient(at 0% 100%, ${alpha(theme.palette.secondary.light, 0.1)} 0px, transparent 50%)`,
          height: '90vh',
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          py: 3,
          px: 4,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <KeyboardVoiceIcon sx={{ fontSize: 30 }} />
          <Typography variant="h5" component="span" sx={{ fontWeight: 700 }}>
            Hướng Dẫn Điều Khiển Bằng Giọng Nói
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={() => setPopUp(false)}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              minWidth: 0,
              px: 3,
            },
            mb: 2,
          }}
        >
          <Tab label="Tất cả" />
          {sections.map((section, idx) => (
            <Tab key={idx} label={section.title} icon={section.icon} iconPosition="start" />
          ))}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, overflow: 'auto' }}>
        {filteredSections.map((section, idx) => (
          <Zoom key={section.id} in={true} style={{ transitionDelay: `${idx * 50}ms` }}>
            <Paper
              elevation={3}
              sx={{
                mb: 3,
                overflow: 'hidden',
                borderRadius: '12px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                  }}
                >
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {section.title}
                </Typography>
              </Box>

              <List sx={{ py: 0 }}>
                {section.commands.map((command, cmdIdx) => (
                  <React.Fragment key={cmdIdx}>
                    {cmdIdx > 0 && <Divider component="li" />}
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <MicIcon sx={{ color: theme.palette.secondary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            {command.commands.map((cmd, i) => (
                              <Chip
                                key={i}
                                label={cmd}
                                sx={{
                                  m: 0.5,
                                  fontWeight: 500,
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.main,
                                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                                }}
                              />
                            ))}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                color: theme.palette.text.secondary,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <NavigateNextIcon sx={{ fontSize: 18, mr: 0.5, color: theme.palette.primary.main }} />
                              {command.info}
                            </Typography>

                            {command.examples && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                                  Ví dụ:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {command.examples.map((example, i) => (
                                    <Chip
                                      key={i}
                                      size="small"
                                      label={example}
                                      sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.main,
                                        fontStyle: 'italic',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Zoom>
        ))}
      </DialogContent>

      <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
          startIcon={<KeyboardVoiceIcon />}
          sx={{
            borderRadius: '30px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Bắt đầu sử dụng giọng nói
        </Button>
      </Box>
    </Dialog>
  );
};

export default PopUp;
