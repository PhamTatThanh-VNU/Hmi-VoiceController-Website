import React from 'react';
import CommandsTable from './CommandsTable';
import './style.css';

const sections = [
  {
    title: '🧭 Điều hướng trang',
    commands: [
      {
        commands: [
          'đi tới trang chủ',
          'đi tới video',
          'đi tới tìm kiếm',
          'đi tới trò chuyện',
          'đi tới liên hệ',
          'đi tới hướng dẫn',
        ],
        info: 'Đi tới trang tương ứng.',
      },
    ],
  },
  {
    title: '🛤️ Điều khiển lịch sử',
    commands: [
      {
        commands: ['quay lại', 'tiến tới'],
        info: 'Quay lại hoặc tiến tới trang trước/sau.',
      },
    ],
  },
  {
    title: '🎬 Mở Video',
    commands: [
      { commands: ['mở video số <_n_>'], info: 'Mở video theo số thứ tự.' },
    ],
  },
  {
    title: '⏯️ Điều khiển Video',
    commands: [
      {
        commands: ['phát video', 'tạm dừng video'],
        info: 'Phát hoặc tạm dừng video.',
      },
      {
        commands: [
          'tua tới <_n_> giây',
          'tua tới <_n_> phút',
          'lùi <_n_> giây',
          'lùi <_n_> phút',
        ],
        info: 'Tua tới/lùi video theo thời gian.',
      },
    ],
  },
  {
    title: '📄 Chuyển Trang Video',
    commands: [
      {
        commands: ['trang tiếp', 'trang trước'],
        info: 'Chuyển trang danh sách video.',
      },
    ],
  },
  {
    title: '🖱️ Cuộn Trang',
    commands: [
      {
        commands: ['kéo xuống', 'kéo lên'],
        info: 'Cuộn trang lên hoặc xuống.',
      },
      {
        commands: ['đi tới cuối trang', 'đi tới đầu trang'],
        info: 'Đi tới đầu hoặc cuối trang.',
      },
      { commands: ['dừng kéo'], info: 'Dừng cuộn tự động.' },
    ],
  },
  {
    title: '🔎 Tìm kiếm',
    commands: [
      {
        commands: ['tìm kiếm <_từ khoá_>'],
        info: 'Tìm kiếm video theo từ khoá.',
      },
    ],
  },
];

const InstructionScreen = () => {
  return (
    <div className="instruction">
      <div className="instruction__container">
        <header className="instruction__header">
          <h2 className="instruction__title">
            📢 Hướng Dẫn Sử Dụng Bằng Giọng Nói
          </h2>
        </header>

        <div style={styles.note}>
          ⚡ Nên thêm cụm từ <strong>"chuẩn bị"</strong> + <strong>lệnh</strong>{' '}
          để dễ dàng điều khiển hơn!
        </div>

        <div className="instruction__body">
          {sections.map((section, index) => (
            <div key={index} className="instruction__section">
              <h4 className="instruction__section-title">{section.title}</h4>
              <CommandsTable
                cols={['Lệnh', 'Ý nghĩa']}
                rows={section.commands}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  note: {
    backgroundColor: '#fff3cd', // vàng nhẹ kiểu warning
    color: '#856404', // chữ vàng đậm
    padding: '10px 20px',
    borderRadius: '8px',
    marginTop: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '16px',
    border: '1px solid #ffeeba',
  },
};

export default InstructionScreen;
