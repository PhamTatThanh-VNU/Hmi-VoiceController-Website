import { useEffect, useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { recognition, speak, toggleRecognition } from './api/voiceRecognition';
import { addVideos } from './redux/actionCreators/videosActionCreator';
import { toast, ToastContainer } from 'react-toastify';
import { routes } from './constants';
import ChatWithAI from './components/AIChat/ChatWithAI';

import Home from './components/Home';
import InstructionScreen from './components/InstructionScreen';
import Navbar from './components/Navbar';
import Search from './components/Search';
import CurrentVideo from './components/CurrentVideo';
import OpenVideoHome from './components/OpenVideo/OpenVideoHome';
import Videos from './components/Videos';
import Contact from './components/Contact/Contact';
import Page404 from './components/Page404';

const App = () => {
  const [greet, setGreet] = useState(false);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [instructionsScreen, setInstructionScreen] = useState(true);
  const [openVideoHome, setOpenVideoHome] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(12);
  const [countPages, setCountPages] = useState(1);
  const [videoRef, setVideoRef] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollInterval = useRef(null);

  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  const submitRef = useRef();

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const history = useHistory();
  //Handle AI
  const { videosLoading, videos, popularVideos } = useSelector(
    (state) => ({
      videosLoading: state.videos.videosLoading,
      videos: state.videos.videos,
      popularVideos: state.videos.popularVideos,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const maxScroll =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let pages = Math.ceil(videos?.length / 12);

  // Hàm chào mừng
  const Greet = () => {
    speak(
      'Chào mừng bạn đến với website điều khiển bằng giọng nói. Vui lòng xem danh sách lệnh! Các lệnh này sẽ giúp bạn điều khiển website bằng giọng nói. Nhấn nút Tiếp theo để bắt đầu!'
    );
  };

  // Chuyển trang video
  const prevPage = () => {
    setStart((prev) => prev - 12);
    setEnd((prev) => prev - 12);
    setCountPages((prev) => prev - 1);
  };

  const nextPage = () => {
    setStart((prev) => prev + 12);
    setEnd((prev) => prev + 12);
    setCountPages((prev) => prev + 1);
  };

  // Gửi biểu mẫu
  const submitForm = (e) => {
    e.preventDefault();
    if (
      !nameRef.current.value ||
      !emailRef.current.value ||
      !messageRef.current.value
    ) {
      toast.dark('Vui lòng điền đầy đủ các trường!');
      speak('Vui lòng điền đầy đủ các trường!');
      return;
    }
    const data = {
      name: nameRef.current.value,
      email: nameRef.current.value,
      message: messageRef.current.value,
    };
    console.log(data);
    speak('Biểu mẫu đã được gửi!');
    speak('Cảm ơn bạn đã gửi thông tin!');
  };

  // Tải video
  useEffect(() => {
    if (videosLoading) {
      dispatch(addVideos());
    }
  }, [dispatch, videosLoading]);

  // Chào mừng khi lần đầu tải
  useEffect(() => {
    if (!greet) {
      Greet();
      setGreet(true);
    }
  }, [greet]);

  // Hàm xử lý lệnh giọng nói
  const handleVoiceCommand = async (command) => {
    if (command.includes('đi tới')) {
      setIsSpeaking(true);
      await speak('Đang điều hướng...', () => setIsSpeaking(false));
      await handleNavigation(command);
    } else if (command === 'quay lại') {
      setIsSpeaking(true);
      history.goBack();
      await speak('Đang quay lại', () => setIsSpeaking(false));
    } else if (command === 'tiến tới') {
      setIsSpeaking(true);
      history.goForward();
      await speak('Đang tiến tới', () => setIsSpeaking(false));
    } else if (command.includes('mở video')) {
      setIsSpeaking(true);
      await handleVideoSelection(command); // <– hàm mới cài
      await speak('Đã mở video', () => setIsSpeaking(false));
    } else if (
      command.includes('phát video') ||
      command.includes('tạm dừng video')
    ) {
      setIsSpeaking(true);
      await handleVideoControl(command);
      await speak('Đã xử lý video', () => setIsSpeaking(false));
    } else if (
      command.includes('kéo') 
      // command.includes('cuộn') ||
      // command.includes('dừng') ||
      // command.includes('ngưng') ||
      // command.includes('tạm dừng') ||
      // command.includes('stop')
    ) {
      setIsSpeaking(true);
      await handleScroll(command);
      await speak('Đã xử lý cuộn trang', () => setIsSpeaking(false));
    } else if (command.includes('tìm kiếm')) {
      setIsSpeaking(true);
      await handleSearch(command);
      await speak('Đã tìm kiếm', () => setIsSpeaking(false));
    } else if (command.includes('điền') || command.includes('gửi biểu mẫu')) {
      setIsSpeaking(true);
      await handleFormFilling(command);
      await speak('Đã gửi biểu mẫu', () => setIsSpeaking(false));
    } else {
      setIsSpeaking(true);
      await speak('Lệnh không hợp lệ. Vui lòng thử lại.', () =>
        setIsSpeaking(false)
      );
    }
  };

  const handleNavigation = async (command) => {
    let pageName = command.replace('đi tới', '').trim();
    if (pageName.includes('trang chủ')) pageName = 'home';
    else if (pageName.includes('tìm kiếm')) pageName = 'search';
    else if (pageName.includes('trò chuyện')) pageName = 'chat';
    else if (pageName.includes('liên hệ')) pageName = 'contact';
    else pageName = pageName.split(' ').pop();

    if (routes.includes(pageName.toLowerCase())) {
      console.log(pageName);
      if (pageName === 'search') {
        history.push({ pathname: '/search', state: { text: '' } });
        speak(
          "Bạn muốn tìm kiếm gì? Hãy nói 'tìm kiếm' theo sau là từ khóa, hoặc nhập vào thanh tìm kiếm."
        );
      } else {
        history.push(pageName === 'home' ? '/' : `/${pageName}`);
        speak(`Đã chuyển tới trang ${pageName}`);
      }
    } else {
      speak("Trang này không tồn tại. Vui lòng nói 'quay lại' để trở về.");
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = async (event) => {
      const command = event.results[0][0].transcript
        .toLowerCase()
        .replace('.', '')
        .trim();
      console.log('Lệnh nhận được:', command);

      if (command === 'dừng nhận') {
        toggleRecognition(false, null, null);
        setIsRecognitionActive(false);
        toast.dark('Đã dừng nhận lệnh!');
        await speak('Đã dừng nhận lệnh!');
        return;
      }

      await handleVoiceCommand(command);
    };

    recognition.onend = () => {
      console.log('onend ở App');

      if (!isSpeaking) {
        console.log('Restart recognition sau onend');
        toggleRecognition(true, null, null);
      }
    };
  }, [isRecognitionActive]);

  const handleScroll = async (command) => {
    if (!command) return;

    const scrollOptions = { behavior: 'smooth' };
    const maxScroll =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const lowerCaseCommand = command.toLowerCase();

    // Dừng cuộn
    if (
      lowerCaseCommand.includes('dừng kéo') ||
      lowerCaseCommand.includes('dừng kéo') ||
      lowerCaseCommand.includes('ngưng kéo') ||
      lowerCaseCommand.includes('ngừng kéo') ||
      lowerCaseCommand.includes('stop') ||
      lowerCaseCommand.includes('thôi kéo')
    ) {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
        console.log('🛑 Đã dừng cuộn trang!');
      }
      return;
    }

    // Nếu đang có cuộn cũ thì dừng lại
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }

    // Cuối trang
    if (lowerCaseCommand.includes('cuối trang')) {
      window.scrollTo({ top: maxScroll, ...scrollOptions });
      return;
    }

    // Đầu trang
    if (lowerCaseCommand.includes('đầu trang')) {
      window.scrollTo({ top: 0, ...scrollOptions });
      return;
    }

    // Kéo xuống liên tục
    if (
      lowerCaseCommand.includes('kéo xuống') ||
      lowerCaseCommand.includes('cuộn xuống')
    ) {
      scrollInterval.current = setInterval(() => {
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight
        ) {
          clearInterval(scrollInterval.current);
          scrollInterval.current = null;
          console.log('✅ Đã tới cuối trang!');
          return;
        }
        window.scrollBy({ top: 10, behavior: 'smooth' });
      }, 30);
      return;
    }

    // Kéo lên liên tục
    if (
      lowerCaseCommand.includes('kéo lên') ||
      lowerCaseCommand.includes('cuộn lên')
    ) {
      scrollInterval.current = setInterval(() => {
        if (window.scrollY <= 0) {
          clearInterval(scrollInterval.current);
          scrollInterval.current = null;
          console.log('✅ Đã tới đầu trang!');
          return;
        }
        window.scrollBy({ top: -10, behavior: 'smooth' });
      }, 30);
      return;
    }

    console.log('⚠️ Không nhận dạng được lệnh cuộn!');
  };

  // Thêm vào App.jsx – đặt trên cùng file (cùng cấp với handleScroll / handleNavigation)

  // === Helper mở video theo số thứ tự (Home & CurrentVideo) ===============
  const handleVideoSelection = async (command) => {
    // 1) Lấy số mà người dùng đọc
    const match = command.match(/\d+/);
    if (!match) {
      speak('Bạn chưa nói số thứ tự của video.');
      return;
    }
    const n = parseInt(match[0], 10);

    // 2) Xác định xem đang ở Home hay CurrentVideo
    const path = history.location.pathname; // ví dụ "/video/abc123"
    const onCurrentVideoPage = path.startsWith('/video/');

    let targetVideo = null;

    if (onCurrentVideoPage) {
      // === ĐANG Ở TRANG CURRENT VIDEO =====================================
      // lấy id video hiện tại
      const currentId = path.split('/')[2];
      // relatedVideos = tất cả videos trừ video hiện tại
      const relatedVideos = videos.filter((v) => v.id.videoId !== currentId);

      if (n < 1 || n > relatedVideos.length) {
        speak('Không có video tương ứng trong danh sách gợi ý.');
        return;
      }
      targetVideo = relatedVideos[n - 1]; // đánh số 1 → N
    } else {
      // === ĐANG Ở TRANG HOME =============================================
      if (n % 2 === 1) {
        // số lẻ -> Uploads
        const idx = (n - 1) / 2;
        if (idx >= videos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        targetVideo = videos[idx];
      } else {
        // số chẵn -> Popular
        const idx = n / 2 - 1;
        if (idx >= popularVideos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        targetVideo = popularVideos[idx];
      }
    }

    // 3) Điều hướng tới trang xem video
    history.push(`/video/${targetVideo.id.videoId}`);
  };

  return (
    <div className="App">
      <ToastContainer />
      <div
        className="d-flex flex-column align-items-center justify-content-center position-fixed"
        style={{ zIndex: 99999, bottom: '5%', right: '30px' }}
      >
        <button
          type="button"
          onClick={() => {
            if (!isSpeaking) {
              setIsRecognitionActive((prev) => !prev);
              toggleRecognition(!isRecognitionActive, null, null);
              toast.dark(
                isRecognitionActive
                  ? 'Đã dừng nhận lệnh!'
                  : 'Bây giờ bạn có thể ra lệnh!'
              );
            } else {
              toast.dark('Không thể bật nhận diện khi đang nói!');
            }
          }}
          className={`btn rounded-circle my-2 shadow ${
            isRecognitionActive ? 'btn-primary' : 'btn-danger'
          }`}
        >
          {isRecognitionActive ? (
            <i className="fa fa-microphone"></i>
          ) : (
            <i className="fa fa-microphone-slash"></i>
          )}
        </button>
        <button
          type="button"
          className="btn rounded-circle my-2 shadow btn-primary"
          onClick={() => {
            setInstructionScreen(true);
            setIsRecognitionActive(false);
            toggleRecognition(false, null, null);
            toast.dark('Nhấn nút tiếp theo hoặc đóng để tiếp tục!');
          }}
        >
          <i className="fa fa-table"></i>
        </button>
      </div>
      {instructionsScreen && (
        <InstructionScreen
          setInstructionScreen={setInstructionScreen}
          setIsRecognitionActive={setIsRecognitionActive}
        />
      )}
      {openVideoHome && (
        <OpenVideoHome
          setOpenVideoHome={setOpenVideoHome}
          selectedVideos={selectedVideos}
        />
      )}
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/video/:id">
          <CurrentVideo setVideoRef={setVideoRef} />
        </Route>
        <Route
          path="/videos"
          component={() => (
            <Videos
              start={start}
              end={end}
              nextPage={nextPage}
              prevPage={prevPage}
              countPages={countPages}
            />
          )}
        />
        <Route path="/chat" component={() => <ChatWithAI />} />
        <Route
          path="/contact"
          component={() => (
            <Contact
              nameRef={nameRef}
              emailRef={emailRef}
              messageRef={messageRef}
              submitRef={submitRef}
              newName={newName}
              newEmail={newEmail}
              newMessage={newMessage}
              submitForm={submitForm}
            />
          )}
        />
        <Route path="/search">
          <Search setIsRecognitionActive={setIsRecognitionActive} />
        </Route>
        <Route component={Page404} />
      </Switch>
    </div>
  );
};

export default App;
