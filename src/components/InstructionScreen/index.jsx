// InstructionScreen.jsx
import React from "react";
import { toast } from "react-toastify";
import { speak } from "../../api/voiceRecognition";
import CommandsTable from "./CommandsTable";
import "./style.css";

const InstructionScreen = () => {
  const sections = [
    {
      title: "🛑 Dừng/Bật nhận lệnh",
      commands: [
        { commands: ["dừng nhận"], info: "Dừng chế độ nhận lệnh giọng nói." },
        { commands: ["bật nghe"], info: "Bật lại chế độ nhận lệnh giọng nói." }
      ]
    },
    {
      title: "🧭 Điều hướng trang",
      commands: [
        { commands: ["đi tới <_tên trang_>"], info: "Đi tới trang mong muốn. Ví dụ: 'đi tới trang chủ'" }
      ]
    },
    {
      title: "🛤️ Điều khiển lịch sử",
      commands: [
        { commands: ["quay lại", "tiến tới"], info: "Quay lại hoặc tiến tới trang trước/sau." }
      ]
    },
    {
      title: "🎬 Mở Video",
      commands: [
        { commands: ["mở video số <_n_>"], info: "Mở video dựa trên số thứ tự." }
      ]
    },
    {
      title: "⏯️ Điều khiển Video",
      commands: [
        { commands: ["phát video", "tạm dừng video"], info: "Phát hoặc tạm dừng video." },
        { commands: ["tua tới <_n_> giây", "lùi <_n_> giây"], info: "Tua video tới/lùi thời gian." }
      ]
    },
    {
      title: "📄 Chuyển Trang Video",
      commands: [
        { commands: ["trang tiếp", "trang trước"], info: "Chuyển trang trong danh sách video." }
      ]
    },
    {
      title: "🖱️ Cuộn Trang",
      commands: [
        { commands: ["kéo xuống", "kéo lên", "cuối trang", "đầu trang"], info: "Cuộn trang lên, xuống hoặc tới đầu/cuối." }
      ]
    },
    {
      title: "🔎 Tìm kiếm",
      commands: [
        { commands: ["tìm kiếm <_từ khoá_>"], info: "Tìm kiếm video theo từ khoá." }
      ]
    },
    {
      title: "📬 Gửi biểu mẫu",
      commands: [
        { commands: ["gửi biểu mẫu"], info: "Gửi biểu mẫu đã nhập." }
      ]
    }
  ];

  return (
    <div className="instruction">
      <div className="instruction__container">
        <header className="instruction__header">
          <h2 className="instruction__title">📢 Hướng Dẫn Sử Dụng Bằng Giọng Nói</h2>
        </header>

        <div className="instruction__body">
          {sections.map((section, idx) => (
            <div key={idx} className="instruction__section">
              <h4 className="instruction__section-title">{section.title}</h4>
              <CommandsTable cols={["Lệnh", "Ý nghĩa"]} rows={section.commands} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionScreen;
