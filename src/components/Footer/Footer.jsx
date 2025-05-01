import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">Về chúng tôi</h3>
                    <p className="footer-text">
                        Chúng tôi phát triển các ứng dụng web tiên tiến với trải nghiệm người dùng tuyệt vời,
                        tập trung vào công nghệ điều khiển bằng giọng nói và video streaming.
                    </p>
                    <div className="social-icons">
                        <a href="#" className="social-icon" aria-label="facebook">
                            <i className="fa fa-facebook"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="twitter">
                            <i className="fa fa-twitter"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="instagram">
                            <i className="fa fa-instagram"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="youtube">
                            <i className="fa fa-youtube"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="linkedin">
                            <i className="fa fa-linkedin"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3 className="footer-heading">Liên kết nhanh</h3>
                    <div className="footer-links-container">
                        <div className="footer-links-column">
                            <a href="/" className="footer-link">Trang chủ</a>
                            <a href="/videos" className="footer-link">Video</a>
                            <a href="/search" className="footer-link">Tìm kiếm</a>
                        </div>
                        <div className="footer-links-column">
                            <a href="/chat" className="footer-link">Trò chuyện</a>
                            <a href="/instruction" className="footer-link">Hướng dẫn</a>
                            <a href="/contact" className="footer-link">Liên hệ</a>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="footer-section">
                    <h3 className="footer-heading">Liên hệ</h3>
                    <div className="contact-info">
                        <p className="footer-text">144 Xuân Thủy, Hà Nội</p>
                        <p className="footer-text">+84 123 456 789</p>
                        <p className="footer-text">voicecontrol@vnu.edu.vnvn</p>
                    </div>
                </div>
            </div>

            <div className="footer-divider"></div>

            {/* Copyright */}
            <div className="copyright">
                <p>© {currentYear} Voice Control Website. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
};

export default Footer;