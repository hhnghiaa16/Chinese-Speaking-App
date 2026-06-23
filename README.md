# 🏮 AI-Powered Chinese Learning App

Ứng dụng di động thông minh giúp người học tiếng Trung chinh phục chứng chỉ HSK (từ HSK 1 đến HSK 6) một cách tự nhiên và thú vị. Điểm nổi bật nhất của ứng dụng là tính năng **Hội thoại AI trực tiếp**, đóng vai trò như một giáo viên bản xứ, giúp người học luyện phản xạ giao tiếp, tự động nhận diện giọng nói và chấm điểm câu trả lời chi tiết.

---

## ✨ Tính năng chính

- 🤖 **Giao tiếp với AI (AI Conversation):** 
  - Luyện nói trực tiếp với giáo viên AI theo đa dạng các chủ đề giao tiếp thực tế.
  - Hỗ trợ nhận diện giọng nói (Speech-to-Text) và phát âm (Text-to-Speech) siêu chân thực.
  - Chấm điểm ngay lập tức với các nhận xét chi tiết về Ngữ pháp, Từ vựng và đề xuất câu trả lời chuẩn xác.
- 📚 **Ngân hàng đề thi (Practice Bank):** Các bài tập luyện tập đa dạng theo từng cấp độ HSK.
- 📈 **Theo dõi Tiến độ (Progress Tracking):** Lưu trữ và phân tích lịch sử học tập, tổng điểm trung bình và biểu đồ Chuỗi học tập (Streak).
- 🎨 **Giao diện hiện đại (Modern UI):** Giao diện Dark mode sang trọng, sử dụng các hiệu ứng animation mượt mà (Staggered Fade-in, Bouncing Dots, Breathing waves...).

---

## 🛠 Tech Stack (Công nghệ sử dụng)

Dự án được xây dựng theo kiến trúc **Monorepo** (chia thành 2 phân hệ `apps/mobile` và `apps/api`) quản lý bằng npm workspaces.

**1. Mobile App (`apps/mobile`)**
- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **UI/Styling:** StyleSheet thuần, kết hợp `expo-linear-gradient` và `lucide-react-native`
- **Audio & Speech:** `expo-audio`, `expo-speech`

**2. Backend API (`apps/api`)**
- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **AI Integration:** OpenAI API (GPT-4o-mini cho sinh câu hỏi và chấm bài, Whisper cho STT, TTS-1 cho Text-to-Speech)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue Auth)

---

## ⚙️ Hướng dẫn cài đặt (Local Development)

### Yêu cầu hệ thống
- Node.js >= 18
- Tài khoản Supabase & OpenAI API Key
- Expo Go (cài trên điện thoại) hoặc Android Emulator / iOS Simulator

### 1. Cài đặt Dependencies
Từ thư mục gốc (Root), chạy:
```bash
npm install
```

### 2. Thiết lập Biến môi trường
Dự án sử dụng 2 file `.env` riêng biệt cho Backend và Mobile.

**Backend (`apps/api/.env`)**:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
OPENAI_STT_MODEL=whisper-1
OPENAI_TTS_MODEL=tts-1
OPENAI_GRADING_MODEL=gpt-4o-mini
```

**Mobile (`apps/mobile/.env`)**:
```env
EXPO_PUBLIC_API_URL=http://<IP_MAY_TINH_CUA_BAN>:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
*(Thay `<IP_MAY_TINH_CUA_BAN>` bằng địa chỉ IP IPv4 máy tính của bạn, ví dụ `192.168.1.5`)*

### 3. Chạy ứng dụng

Bạn cần chạy song song cả Backend và Mobile. 

Mở 2 cửa sổ Terminal:
- **Terminal 1 (Backend):**
  ```bash
  npm run api
  ```
- **Terminal 2 (Mobile):**
  ```bash
  npm run mobile
  ```
Sau đó, dùng ứng dụng **Expo Go** quét mã QR trên terminal để mở app trên thiết bị thật.

---

## 🚀 Hướng dẫn Triển khai (Deployment)

Vui lòng tham khảo file chi tiết: **[`DEPLOY.md`](./DEPLOY.md)** để biết cách:
1. Đưa Backend lên **Vercel**.
2. Đóng gói và build file cài đặt `.apk` cho Android thông qua **Expo EAS**.

---

## 🔒 Bảo mật & An toàn dữ liệu
- Mọi API giao tiếp với OpenAI đều được bảo mật qua Token xác thực người dùng (JWT Supabase).
- Dung lượng file ghi âm tải lên được giới hạn nghiêm ngặt ở cấp độ Server (Max 15MB) để tối ưu bộ nhớ.
- Dữ liệu người dùng được phân quyền cô lập thông qua hệ thống Row-Level Security (RLS) của Supabase.
