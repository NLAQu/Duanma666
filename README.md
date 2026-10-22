# ecommerce-fashion-cosmetics

Sàn TMĐT thời trang & mỹ phẩm với các tính năng thông minh (lựa size, gợi ý phối đồ, thử đồ ảo, trắc nghiệm da).

## Cấu trúc thư mục

```
ecommerce-fashion-cosmetics/
│
├── .github/                          # Cấu hình CI/CD, Workflows (Tự động build/deploy)
│   └── workflows/
│
├── docs/                             # Tài liệu dự án (Dùng để prompt & làm việc với Claude AI)
│   ├── PRD.md                        # Chi tiết yêu cầu chức năng (Toàn bộ mục 2 của bạn)
│   ├── ARCHITECTURE.md               # Kiến trúc hệ thống & Luồng dữ liệu (Data Flow)
│   ├── SYSTEM_DESIGN_DEEPDIVE.md      # Thiết kế hệ thống: Anti-fraud, Smart Routing, Anti-bot
│   └── WORDPRESS_REFERENCE.md        # Ghi chú logic/cấu trúc DB học từ WordPress (Hooks, Custom Post Types)
│
├── datasets/                         # Quản lý Data set (Mục 4)
│   ├── raw/                          # Dữ liệu thô cào từ các trang TMĐT khác (Shopee, Lazada, Tiki...)
│   │   ├── fashion_products.csv
│   │   └── cosmetics_ingredients.json
│   ├── backup_kaggle/                # Dữ liệu dự phòng từ Kaggle (Skin type dataset, Sizing dataset...)
│   └── processed/                    # Dữ liệu đã làm sạch & Chuẩn hóa sẵn sàng train AI / Seed vào DB
│
├── backend/                          # Mã nguồn BACKEND (Custom Code)
│   ├── config/                       # Cấu hình môi trường, DB, Payment Gateways, Redis...
│   ├── src/
│   │   ├── modules/                  # Chia theo từng nhóm Chức năng chính (Domain-Driven Design)
│   │   │   ├── auth/                 # Đăng ký, Đăng nhập, Capcha chống bot, OTP
│   │   │   ├── users/                # Quản lý người dùng, Địa chỉ giao hàng, Hệ thống thành viên
│   │   │   ├── sellers/              # Dashboard người bán, Theo dõi xu hướng, Báo cáo
│   │   │   ├── products/             # Danh mục, Thông tin sản phẩm, Đánh giá, Xác thực chính hãng
│   │   │   ├── inventory/            # Quản lý kho hàng shop & Kho tổng của sàn
│   │   │   ├── orders/               # Giỏ hàng, Đặt hàng, Xử lý thanh toán
│   │   │   ├── shipping/             # Quản lý vận chuyển, Định tuyến vận chuyển thông minh
│   │   │   ├── chat/                 # Chat thời gian thực (Real-time Chat người mua - người bán)
│   │   │   ├── ads-promotions/       # Chạy quảng cáo, Đề xuất khuyến mãi
│   │   │   ├── moderation/           # Kiểm duyệt nội dung, Hệ thống chống lừa đảo & rủi ro
│   │   │   └── smart-features/       # Các API Chức năng Chuyên biệt (AI Services Integration)
│   │   │       ├── sizing/           # Lựa size thông minh
│   │   │       ├── styling/          # Gợi ý phối đồ (sự kiện, dáng người)
│   │   │       ├── virtual-tryon/    # Model thử đồ
│   │   │       └── skin-quiz/        # Trắc nghiệm da & Phân tích thành phần mỹ phẩm
│   │   ├── middleware/               # Security, Anti-bot, Authentication, Logging
│   │   ├── services/                 # Báo cáo thông minh, AI recommendation engine integration
│   │   └── utils/                    # Helper functions (Validate, Format data...)
│   ├── tests/                        # Unit tests & Integration tests
│   ├── Dockerfile
│   └── package.json (hoặc requirements.txt)
│
├── frontend/                         # Mã nguồn FRONTEND (Custom Code - Web UI/UX)
│   ├── public/                       # Assets tĩnh (Favicon, Logos, Icons...)
│   ├── src/
│   │   ├── assets/                   # Images, Styles, Fonts
│   │   ├── components/               # Các UI component dùng chung
│   │   │   ├── common/               # Header, Footer, Navbar, SearchBar, Captcha, Notification
│   │   │   ├── product/              # ProductCard, Rating, ReviewSystem, CategoryFilter
│   │   │   ├── cart/                 # CartDrawer, CartItem
│   │   │   └── ui/                   # Buttons, Modals, Inputs (Cài đặt giao diện/Theme switcher)
│   │   ├── pages/                    # Trang màn hình chính
│   │   │   ├── consumer/             # Màn hình cho Người Dùng
│   │   │   │   ├── Home.jsx          # Trang chủ
│   │   │   │   ├── ProductDetail.jsx # Chi tiết sản phẩm, Xác thực chính hãng, Review
│   │   │   │   ├── Checkout.jsx      # Thanh toán, Địa chỉ
│   │   │   │   └── QuizSkin.jsx      # Trắc nghiệm phân tích loại da & Tìm sản phẩm phù hợp
│   │   │   ├── seller/               # Màn hình cho Người Bán (Seller Center)
│   │   │   │   ├── Dashboard.jsx     # Xu hướng khách hàng, Báo cáo
│   │   │   │   ├── Inventory.jsx     # Quản lý kho, voucher, giá
│   │   │   │   ├── Logistics.jsx     # Quản lý đơn hàng, hoàn trả
│   │   │   │   └── VideoMarketing.jsx# Đăng video tiếp thị
│   │   │   └── admin/                # Màn hình Quản trị hệ thống (System Admin)
│   │   │       ├── ServerMonitor.jsx # Quản lý server
│   │   │       ├── ContentModeration.jsx # Kiểm duyệt nội dung
│   │   │       ├── GlobalWarehouse.jsx  # Kho tổng sàn
│   │   │       └── RiskAntiFraud.jsx    # Hệ thống chống lừa đảo & Báo cáo thông minh
│   │   ├── features/                 # Widget/Popups tính năng chuyên biệt
│   │   │   ├── SmartSizingModal/     # Popup lựa size thông minh
│   │   │   ├── OutfitSuggest/        # Gợi ý phối đồ
│   │   │   └── VirtualTryOn/         # Model thử đồ
│   │   ├── services/                 # Gọi API kết nối với Backend
│   │   └── store/                    # Quản lý state toàn cục (Cart, User info, Theme Settings...)
│   ├── Dockerfile
│   └── package.json
│
├── ai_services/                      # Microservice/Scripts xử lý AI & ML (Nếu muốn tách riêng cho nhẹ backend)
│   ├── skin_analysis/                # Logic xử lý trắc nghiệm & gợi ý mỹ phẩm theo thành phần/tầm giá
│   ├── recommendation/               # Đề xuất sản phẩm theo vị trí địa lý & nhu cầu người dùng
│   └── size_fitting/                 # Algorithm/Model tính toán size & Virtual Try-on (Thử đồ)
│
├── scripts/                          # Script hỗ trợ (Cào data, seed DB tự động, backup)
│   ├── scraper/                      # Code cào dữ liệu từ các web TMĐT khác
│   └── seed_database.js              # Đổ data thô/Kaggle vào DB để test
│
├── .env.example                      # File mẫu biến môi trường (API Key, Database URL, Config)
├── docker-compose.yml                # File chạy toàn bộ hệ thống (Frontend, Backend, DB, AI) chỉ với 1 lệnh
└── README.md                         # Hướng dẫn tổng quan và cách chạy dự án
```

## Cách chạy

```bash
cp .env.example .env
docker compose up
```

# DỰ ÁN TỂU LUẬN: WEBSITE TMĐT THỜI TRANG & MỸ PHẨM (TUẦN 1 - MVP)

## 🌐 BÁO CÁO DEPLOY (LIVE DEMO)
- **Website (Frontend):** [https://your-project.vercel.app](https://your-project.vercel.app)
- **API Server (Backend):** [https://your-backend.onrender.com](https://your-backend.onrender.com)
- **Mã nguồn GitHub:** [https://github.com/your-username/ecommerce-fashion-cosmetics](https://github.com/your-username/ecommerce-fashion-cosmetics)

---

## 🛠️ Bộ Công Nghệ Sử Dụng
- **Frontend:** React.js, TailwindCSS, Axios (Host: Vercel)
- **Backend:** Node.js, Express.js (Host: Render)
- **Database:** PostgreSQL (Host: Supabase Cloud)

---

## 📋 Chức Năng Đã Hoàn Thành Trong Tuần 1
1. **Khách hàng:**
   - Xem danh sách sản phẩm & chi tiết sản phẩm.
   - Đăng ký / Đăng nhập tài khoản.
   - Thêm/Xóa/Sửa giỏ hàng.
   - Tạo đơn đặt hàng thành công.
2. **Người bán / Quản trị:**
   - Trang Dashboard xem đơn hàng mới.
   - Form thêm sản phẩm mới vào hệ thống.

---

## 🔐 Tài Khoản Dùng Thử Cho Giảng Viên Chấm Điểm
- **Tài khoản Admin/Seller:** `admin@gmail.com` / `123456`
- **Tài khoản Khách hàng:** `user@gmail.com` / `123456`
