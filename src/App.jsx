// 1. IMPORT ======================================================================================
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { recognition, speak, toggleRecognition } from './api/voiceRecognition';
import { addVideos } from './redux/actionCreators/videosActionCreator';

import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import PopUp from './components/PopUp';
import OpenVideoHome from './components/OpenVideo/OpenVideoHome';
import CurrentVideo from './components/CurrentVideo/CurrentVideo';
import Videos from './components/Videos/Videos';
import Search from './components/Search/Search';
import ChatWithAI from './components/AIChat/ChatWithAI';
import InstructionScreen from './components/InstructionScreen/InstructionScreen';
import Page404 from './components/Page404/Page404';
import Footer from './components/Footer/Footer';
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

  const history = useHistory();
  const dispatch = useDispatch();

  const videosLoading = useSelector((state) => state.videos.videosLoading);
  const videos = useSelector((state) => state.videos.videos);
  const popularVideos = useSelector((state) => state.videos.popularVideos);
  const searchResults = useSelector(
    (state) => state.searchResult.searchResults
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

  const searchResultsRef = useRef([]);

  useEffect(() => {
    searchResultsRef.current = searchResults;
  }, [searchResults]);

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
    } else {
      await speak('Lệnh không hợp lệ', () => setIsSpeaking(false));
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
    let pageName = command.replace('đi tới', '').trim().toLowerCase();

    // Map các từ tiếng Việt người dùng nói thành route chuẩn
    const pageMapping = {
      'trang chủ': '/',
      home: '/',
      video: '/videos',
      'tìm kiếm': '/search',
      search: '/search',
      'trò chuyện': '/chat',
      chat: '/chat',
      'hướng dẫn': '/instruction',
      instruction: '/instruction',
    };

    const matchedRoute = pageMapping[pageName];

    if (matchedRoute) {
      if (matchedRoute === '/search') {
        history.push({ pathname: '/search', state: { text: '' } });
        await speak('Bạn muốn tìm kiếm gì? Hãy nói tìm kiếm cộng từ khoá.');
      } else {
        history.push(matchedRoute);
        await speak(`Đã chuyển tới ${pageName}`);
      }
    } else {
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

    console.log(' Không nhận dạng được lệnh cuộn!');
  };

  const handleVideoSelection = async (command) => {
    const num = command.match(/\d+/);
    if (!num) {
      speak('Bạn chưa nói số thứ tự của video.');
      return;
    }
    const n = parseInt(num[0], 10);
    const path = history.location.pathname;
    let target = null;

    if (path.startsWith('/video/')) {
      const currentId = path.split('/')[2];
      const related = videos.filter((v) => v.id.videoId !== currentId);
      if (n < 1 || n > related.length) {
        speak('Không có video tương ứng trong danh sách gợi ý.');
        return;
      }
      target = related[n - 1];
    } else if (path.startsWith('/videos')) {
      const globalIndex = start + (n - 1);
      if (globalIndex < 0 || globalIndex >= videos.length) {
        speak('Số thứ tự vượt quá tổng số video.');
        return;
      }
      target = videos[globalIndex];
    } else if (path.startsWith('/search')) {
      console.log('📦 searchResults:', searchResults);
      if (n < 1 || n > searchResults.length) {
        speak('Số thứ tự vượt quá số video trên trang.');
        return;
      }
      target = searchResults[n - 1];

    } else {
      // Trang Home
      if (n % 2 === 1) {
        const idx = (n - 1) / 2;
        if (idx >= videos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        target = videos[idx];
      } else {
        const idx = n / 2 - 1;
        if (idx >= popularVideos.length) {
          speak('Không có video tương ứng.');
          return;
        }
        target = popularVideos[idx];
      }
    }

    console.log('🎯 target video', target);
    if (target?.id?.videoId) {
      history.push(`/video/${target.id.videoId}`);
    } else {
      speak('Không thể mở video. Định dạng video không hợp lệ.');
    }
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
    if (lc.includes('tua') || lc.includes('tour') || lc.includes('tu') || lc.includes('to')) {
      const foundNumber = lc.match(/\d+/);
      let seconds = foundNumber ? +foundNumber[0] : 10;
      if (lc.includes('phút')) seconds *= 60;

      const isForward = /(tới|nhanh|trước|lên)/.test(lc);
      const isBackward = /(lùi|về|lại|xuống)/.test(lc);

      const now = player.getCurrentTime?.();
      if (typeof now !== 'number') {
        speak('Không thể lấy thời gian hiện tại của video.');
        return;
      }

      let targetTime = isForward
        ? now + seconds
        : isBackward
          ? now - seconds
          : now + seconds;

      if (!player.seekTo || typeof player.seekTo !== 'function') {
        speak('Không thể tua video lúc này. Vui lòng thử lại.');
        return;
      }

      targetTime = Math.max(0, targetTime);
      player.seekTo(targetTime, true);
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


  // 2.4 JSX =======================================================================================
  return (
    <div className="App">
      <ToastContainer />

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
        <Route path="/instruction" component={InstructionScreen} />
        <Route path="/search">
          <Search setIsRecognitionActive={setIsRecognitionActive} />
        </Route>
        <Route component={Page404} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
