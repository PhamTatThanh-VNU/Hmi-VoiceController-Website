// 1. IMPORT ======================================================================================
import { useEffect, useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { recognition, speak, toggleRecognition } from './api/voiceRecognition';
import { addVideos } from './redux/actionCreators/videosActionCreator';
import { routes } from './constants';

import Home from './components/Home';
import Navbar from './components/Navbar';
import PopUp from './components/PopUp';
import OpenVideoHome from './components/OpenVideo/OpenVideoHome';
import CurrentVideo from './components/CurrentVideo';
import Videos from './components/Videos';
import Search from './components/Search';
import ChatWithAI from './components/AIChat/ChatWithAI';
import Contact from './components/Contact/Contact';
import InstructionScreen from './components/InstructionScreen';
import Page404 from './components/Page404';

// 2. COMPONENT ====================================================================================
const App = () => {
  // 2.1 STATE =====================================================================================
  const [greet, setGreet] = useState(false);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [popUp, setPopUp] = useState(true);
  const [openVideoHome, setOpenVideoHome] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(12);
  const [countPages, setCountPages] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef(null);
  const scrollInterval = useRef(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  const submitRef = useRef();

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();

  const { videosLoading, videos, popularVideos, searchResults } = useSelector(
    (state) => ({
      videosLoading: state.videos.videosLoading,
      videos: state.videos.videos,
      popularVideos: state.videos.popularVideos,
      searchResults: state.searchResult.searchResults,
    }),
    shallowEqual
  );

  // 2.2 USEEFFECT =================================================================================
  useEffect(() => {
    if (videosLoading) {
      dispatch(addVideos());
    }
  }, [dispatch, videosLoading]);

  useEffect(() => {
    if (!greet) {
      Greet();
      setGreet(true);
    }
  }, [greet]);

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

  // 2.3 HANDLE FUNCTIONS ==========================================================================
  // Hàm xử lý lệnh giọng nói
  const handleVoiceCommand = async (command) => {
    const handled = await handleInstructionToggle(command);
    if (handled) return; // nếu đã xử lý mở/đóng bảng hướng dẫn thì dừng luôn

    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('đi tới')) {
      await speak('Đang điều hướng...', () => setIsSpeaking(false));
      await handleNavigation(command);
    } else if (lowerCommand.includes('quay lại')) {
      history.goBack();
      await speak('Đang quay lại', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('tiến tới')) {
      history.goForward();
      await speak('Đang tiến tới', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('mở video')) {
      await handleVideoSelection(command);
      await speak('Đã mở video', () => setIsSpeaking(false));
    } else if (
      lowerCommand.includes('phát video') ||
      lowerCommand.includes('tạm dừng video') ||
      lowerCommand.includes('tua')
    ) {
      await handleVideoControl(command);
      await speak('Đã xử lý video', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('trang tiếp')) {
      await nextPage();
      await speak('Đã chuyển trang', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('trang trước')) {
      await prevPage();
      await speak('Đã chuyển trang', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('kéo')) {
      await handleScroll(command);
      await speak('Đã xử lý cuộn trang', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('tìm kiếm')) {
      await handleSearch(command);
      await speak('Đã tìm kiếm', () => setIsSpeaking(false));
    } else if (lowerCommand.includes('gửi biểu mẫu')) {
      await handleFormFilling(command);
      await speak('Đã gửi biểu mẫu', () => setIsSpeaking(false));
    } else {
      await speak('Lệnh không hợp lệ. Vui lòng thử lại.', () =>
        setIsSpeaking(false)
      );
    }
  };

  const handleInstructionToggle = async (command) => {
    const lowerCommand = command.toLowerCase();

    // Mở bảng hướng dẫn
    if (
      lowerCommand.includes('mở lệnh') ||
      lowerCommand.includes('xem hướng dẫn') ||
      lowerCommand.includes('mở bảng hướng dẫn')
    ) {
      setPopUp(true);
      setIsRecognitionActive(false);
      toggleRecognition(false, null, null);
      toast.dark('Đang mở bảng hướng dẫn sử dụng');
      await speak('Đang mở bảng hướng dẫn sử dụng');
      return true; // báo hiệu đã xử lý lệnh
    }

    // Đóng bảng hướng dẫn
    if (
      lowerCommand.includes('đóng lệnh') ||
      lowerCommand.includes('đóng hướng dẫn') ||
      lowerCommand.includes('đóng bảng hướng dẫn')
    ) {
      setPopUp(false);
      setIsRecognitionActive(false);
      toggleRecognition(false, null, null);
      toast.dark('Đã đóng bảng hướng dẫn');
      await speak('Đã đóng bảng hướng dẫn');
      return true;
    }

    return false; // không phải lệnh mở/đóng bảng hướng dẫn
  };

  // Hàm điều hướng tới trang
  const handleNavigation = async (command) => {
    let pageName = command.replace('đi tới', '').trim();

    if (pageName.includes('trang chủ')) pageName = 'home';
    else if (pageName.includes('tìm kiếm')) pageName = 'search';
    else if (pageName.includes('trò chuyện')) pageName = 'chat';
    else if (pageName.includes('liên hệ')) pageName = 'contact';
    else if (pageName.includes('hướng dẫn')) pageName = 'instruction';
    else pageName = pageName.split(' ').pop();

    if (routes.includes(pageName.toLowerCase())) {
      if (pageName === 'search') {
        history.push({ pathname: '/search', state: { text: '' } });
        await speak('Bạn muốn tìm kiếm gì? Hãy nói tìm kiếm kèm từ khóa.');
      } else {
        history.push(pageName === 'home' ? '/' : `/${pageName}`);
        await speak(`Đã chuyển tới trang ${pageName}`);
      }
    } else {
      history.push(`/${pageName}`);
      await speak('Trang này không tồn tại. Vui lòng thử lệnh khác.');
    }
  };

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

  const handleVideoSelection = async (command) => {
    /* === 1. Lấy số thứ tự ================================================================================= */
    const num = command.match(/\d+/);
    if (!num) {
      speak('Bạn chưa nói số thứ tự của video.');
      return;
    }
    const n = parseInt(num[0], 10);

    const path = history.location.pathname; // ví dụ "/", "/videos", "/video/abc"
    let target = null;

    /* === 2. Trang /video/:id  (Related Videos) ============================================================ */
    if (path.startsWith('/video/')) {
      const currentId = path.split('/')[2];
      const related = videos.filter((v) => v.id.videoId !== currentId); // cùng nguồn dữ liệu redux

      if (n < 1 || n > related.length) {
        speak('Không có video tương ứng trong danh sách gợi ý.');
        return;
      }
      target = related[n - 1];
    } else if (path.startsWith('/videos')) {
      /* === 3. Trang /videos  (Danh sách 12 video mỗi trang) ================================================= */
      const pageList = videos.slice(start, end); // 12 video hiện tại
      if (n < 1 || n > pageList.length) {
        speak('Số thứ tự vượt quá số video trên trang.');
        return;
      }
      target = pageList[n - 1];
    } else if (path.startsWith('/search')) {
      /* === 4. Trang /search  (Danh sách 12 video mỗi trang) ================================================= */
      const searchList = searchResults;
      if (n < 1 || n > searchList.length) {
        speak('Số thứ tự vượt quá số video trên trang.');
        return;
      }
      target = searchList[n - 1];
    } else {
      /* === 5. Trang Home  (/ hoặc /home) ==================================================================== */
      if (n % 2 === 1) {
        /* số lẻ ⇒ Uploads */
        const idx = (n - 1) / 2;
        if (idx >= videos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        target = videos[idx];
      } else {
        /* số chẵn ⇒ Popular Uploads */
        const idx = n / 2 - 1;
        if (idx >= popularVideos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        target = popularVideos[idx];
      }
    }

    /* === 6. Điều hướng ==================================================================================== */
    history.push(`/video/${target.id.videoId}`);
  };

  const handleVideoControl = (command) => {
    const player = videoRef.current;
    if (!player) {
      speak('Chưa có video nào đang phát.');
      return;
    }

    const lc = command.toLowerCase().trim();

    /* ───────── 1. Phát / tiếp tục ───────── */
    if (/(phát\s+(video|tiếp)|tiếp tục)/.test(lc)) {
      player.playVideo();
      return;
    }

    /* ───────── 2. Tạm dừng ───────── */
    if (/(tạm\s*dừng|pause|dừng\s+video)/.test(lc)) {
      player.pauseVideo();
      return;
    }

    /* ─────── 3. Tua video ─────── */
    if (lc.includes('tua') || lc.includes('tour')) {
      /* Bước 3-1. Số giây (hoặc phút) cần tua */
      const foundNumber = lc.match(/\d+/); // tìm số trong câu
      let seconds = foundNumber
        ? +foundNumber[0] // có số → dùng
        : 10; // không số → 10s mặc định

      /* Nếu người dùng nói “phút” → đổi sang giây */
      if (lc.includes('phút')) seconds *= 60;

      /* Bước 3-2. Quyết định hướng tua */
      const isForward = /(tới|nhanh|trước|lên)/.test(lc); // tua tới
      const isBackward = /(lùi|về|lại|xuống)/.test(lc); // tua lùi

      const now = player.getCurrentTime();
      let targetTime = now;

      if (isForward) targetTime = now + seconds;
      else if (isBackward) targetTime = now - seconds;
      else targetTime = now + seconds; // không nói rõ → tua tới

      if (targetTime < 0) targetTime = 0;

      player.seekTo(targetTime, true);
      return;
    }

    /* ───────── 4. Lệnh không khớp ───────── */
    speak('Không nhận dạng được lệnh điều khiển video.');
  };

  // Hàm tìm kiếm
  const handleSearch = async (command) => {
    let query = command.replace(/^tìm kiếm\s*/i, '').trim();

    if (!query) {
      await speak('Bạn chưa nói từ khoá. Hãy nói: tìm kiếm cộng từ khoá.');
      return;
    }

    history.push({
      pathname: '/search',
      state: { text: query },
    });

    await speak(`Đang tìm kiếm từ khoá: ${query}`);
  };

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

  // 2.4 JSX =======================================================================================
  return (
    <div className="App">
      <ToastContainer />

      {/* Floating buttons */}
      {/* <div
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
            setPopUp(true);
            setIsRecognitionActive(false);
            toggleRecognition(false, null, null);
            toast.dark('Nhấn nút tiếp theo hoặc đóng để tiếp tục!');
          }}
        >
          <i className="fa fa-table"></i>
        </button>
      </div> */}

      {popUp && (
        <PopUp
          setPopUp={setPopUp}
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
        <Route exact path="/" component={Home} />
        <Route exact path="/video/:id">
          <CurrentVideo setVideoRef={(player) => (videoRef.current = player)} />
        </Route>
        <Route path="/videos">
          <Videos
            start={start}
            end={end}
            nextPage={nextPage}
            prevPage={prevPage}
            countPages={countPages}
          />
        </Route>
        <Route path="/chat" component={ChatWithAI} />
        <Route path="/contact">
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
        </Route>
        <Route path="/instruction" component={InstructionScreen} />
        <Route path="/search">
          <Search setIsRecognitionActive={setIsRecognitionActive} />
        </Route>
        <Route component={Page404} />
      </Switch>
    </div>
  );
};

export default App;
