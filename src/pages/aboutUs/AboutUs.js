import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import "./aboutUs.css";
function AboutUs() {
  return (
    <>
      <Topbar />

      <div class="blog-container">
        <header>
          <h1>Social_D: Mạng Xã Hội Của Tương Lai</h1>
          <img src="assets/ad.jpg" alt="Social_D Banner" class="banner-image" />
        </header>
        <article>
          <section class="introduction">
            <h2>Giới Thiệu Về Social_D</h2>
            <p>
              Social_D là một mạng xã hội tiên tiến được thiết kế để kết nối mọi
              người trên toàn thế giới. Với Social_D, bạn có thể dễ dàng kết nối
              với bạn bè, chia sẻ những khoảnh khắc đặc biệt, và khám phá những
              nội dung thú vị mà bạn quan tâm. Social_D mang đến cho bạn một
              trải nghiệm trực tuyến mới mẻ, an toàn và tiện lợi.
            </p>
          </section>
          <section class="features">
            <h2>Tính Năng Nổi Bật</h2>
            <ul>
              <li>
                <strong>Kết nối dễ dàng:</strong> Liên lạc với bạn bè và gia
                đình bất kỳ lúc nào, bất kỳ nơi đâu.
              </li>
              <li>
                <strong>Chia sẻ sáng tạo:</strong> Đăng tải hình ảnh, video và
                câu chuyện đầy màu sắc.
              </li>
              <li>
                <strong>Tạo nhóm & sự kiện:</strong> Tổ chức các hoạt động cộng
                đồng và tham gia các sự kiện thú vị.
              </li>
              <li>
                <strong>Bảo mật cao:</strong> Công cụ bảo mật mạnh mẽ để bảo vệ
                thông tin cá nhân của bạn.
              </li>
              <li>
                <strong>Khám phá & tìm kiếm:</strong> Khám phá nội dung phong
                phú và đa dạng từ khắp nơi trên thế giới.
              </li>
            </ul>
          </section>
          <section class="technology">
            <h2>Công Nghệ Sử Dụng</h2>
            <p>
              Social_D được xây dựng trên nền tảng công nghệ hiện đại, đảm bảo
              tốc độ nhanh chóng và bảo mật cao. Chúng tôi sử dụng các công nghệ
              như:
            </p>
            <ul>
              <li>
                <strong>AI và Machine Learning:</strong> Để cá nhân hóa trải
                nghiệm người dùng và cung cấp các đề xuất nội dung chính xác.
              </li>
              <li>
                <strong>Blockchain:</strong> Để bảo vệ dữ liệu người dùng và đảm
                bảo tính minh bạch.
              </li>
              <li>
                <strong>Cloud Computing:</strong> Để đảm bảo dịch vụ luôn sẵn
                sàng và hoạt động ổn định.
              </li>
            </ul>
          </section>
          <section class="benefits">
            <h2>Lợi Ích Cho Người Dùng</h2>
            <p>Tham gia Social_D, bạn sẽ nhận được nhiều lợi ích như:</p>
            <ul>
              <li>
                <strong>Kết nối rộng rãi:</strong> Mở rộng mạng lưới bạn bè và
                đồng nghiệp.
              </li>
              <li>
                <strong>Nội dung phong phú:</strong> Tiếp cận với nhiều nội dung
                đa dạng và hấp dẫn.
              </li>
              <li>
                <strong>An toàn và bảo mật:</strong> Bảo vệ quyền riêng tư và dữ
                liệu cá nhân của bạn.
              </li>
              <li>
                <strong>Hỗ trợ 24/7:</strong> Đội ngũ hỗ trợ khách hàng luôn sẵn
                sàng giúp đỡ bạn.
              </li>
            </ul>
          </section>
          <section class="cta">
            <h2>Tham Gia Social_D Ngay Hôm Nay!</h2>
            <p>
              Bắt đầu hành trình kết nối và khám phá của bạn cùng với Social_D.{" "}
              Và cảm ơn bạn đã đồng hành cùng chúng tôi !!!{" "}
              <a href="#">đọc lại</a>
            </p>
          </section>
        </article>
        <footer>
          <p>© 2024 Social_D. Tất cả các quyền được bảo lưu.</p>
        </footer>
      </div>
    </>
  );
}

export default AboutUs;
