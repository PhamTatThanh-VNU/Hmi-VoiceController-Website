// InstructionScreen.jsx
import React from 'react';
import { toast } from 'react-toastify';
import { speak } from '../../api/voiceRecognition';
import CommandsTable from '../InstructionScreen/CommandsTable';
import './style.css';

const PopUp = ({ setPopUp, setIsRecognitionActive }) => {
  const handleStart = async () => {
    setPopUp(false);
    toast.dark('Hãy bắt đầu ra lệnh bằng giọng nói của bạn');
    await speak('Hãy bắt đầu ra lệnh bằng giọng nói của bạn');
    setIsRecognitionActive(true);
  };

  const sections = [
    {
      title: 'Dừng/Bật nhận lệnh',
      commands: [
        { commands: ['dừng nhận'], info: 'Dừng chế độ nhận lệnh giọng nói.' },
        { commands: ['bật nghe'], info: 'Bật lại chế độ nhận lệnh giọng nói.' },
      ],
    },
    {
      title: 'Điều hướng trang',
      commands: [
        {
          commands: ['đi tới <_tên trang_>'],
          info: "Đi tới trang mong muốn. VD: 'đi tới trang chủ'",
        },
      ],
    },
    {
      title: 'Điều khiển lịch sử trang',
      commands: [
        {
          commands: ['quay lại', 'tiến tới'],
          info: 'Di chuyển qua lại giữa các trang.',
        },
      ],
    },
    {
      title: 'Mở Video',
      commands: [
        {
          commands: ['mở video số <_n_>'],
          info: 'Mở video dựa trên số thứ tự.',
        },
      ],
    },
    {
      title: 'Điều khiển Video',
      commands: [
        {
          commands: ['phát video', 'tạm dừng video'],
          info: 'Phát hoặc tạm dừng video.',
        },
        {
          commands: ['tua tới <_n_> giây', 'lùi <_n_> giây'],
          info: 'Tua video tới/lùi thời gian.',
        },
      ],
    },
    {
      title: 'Chuyển trang video',
      commands: [
        {
          commands: ['trang tiếp', 'trang trước'],
          info: 'Chuyển sang trang video kế tiếp hoặc trước đó.',
        },
      ],
    },
    {
      title: 'Cuộn Trang',
      commands: [
        {
          commands: ['kéo xuống', 'kéo lên', 'cuối trang', 'đầu trang'],
          info: 'Cuộn trang lên, xuống hoặc tới đầu/cuối trang.',
        },
      ],
    },
    {
      title: 'Tìm kiếm',
      commands: [
        {
          commands: ['tìm kiếm <_từ khoá_>'],
          info: 'Tìm kiếm nội dung theo từ khoá.',
        },
      ],
    },
    {
      title: 'Gửi Biểu Mẫu',
      commands: [
        { commands: ['gửi biểu mẫu'], info: 'Gửi form đã điền thông tin.' },
      ],
    },
  ];

  return (
    <div className="popup">
      <div className="popup__card">
        <div className="popup__header">
          <h4 className="popup__title">📢 Hướng Dẫn Sử Dụng Bằng Giọng Nói</h4>
          <button className="popup__start-btn" onClick={handleStart}>
            Bắt đầu
          </button>
        </div>
        <div className="popup__body">
          {sections.map((section, idx) => (
            <div key={idx} className="popup__section">
              <h5 className="popup__subtitle">{section.title}</h5>
              <CommandsTable cols={['Lệnh', 'Mô tả']} rows={section.commands} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
