# 🚀 TaskFlow — دليل الشامل للمشروع وكيفية عمله (الإصدار المحسّن والنهائي)

**TaskFlow** هي منصة إدارة مشاريع ومهام سحابية متكاملة (SaaS Project & Task Management Platform) تم بناؤها باستخدام أحدث تقنيات تطوير الواجهات الأمامية (Frontend Engineering). 

المشروع مصمم بمعايير احترافية ومستوحى من كبرى المنصات العالمية مثل **Linear** و **Notion** و **ClickUp**، ليكون مشروعاً قوياً يعكس مهارات التطوير المتقدمة في الـ Frontend والربط مع الخدمات السحابية.

---

## 🛠️ 1. التقنيات المستخدمة (Tech Stack)

* **الواجهة البرمجية (Frontend)**: React.js (v18+) مع React Hooks و Context API.
* **أداة البناء (Build Tool)**: Vite (سريع وخفيف للإنتاج).
* **التنسيق والأنماط (Styling)**: Tailwind CSS (مع دعم الوضع الليلي Dark Mode والتصميم المتجاوب Fully Responsive).
* **البنية السحابية والفيسبوك (Backend Infrastructure)**:
  * **Firebase Authentication**: تسجيل الدخول، إنشاء الحساب، Google OAuth، وإعادة تعيين كلمة المرور.
  * **Cloud Firestore**: قاعدة البيانات السحابية الحية لترتيب مساحات العمل، المشاريع، المهام، التعليقات، والأنشطة.
  * **Firebase Storage**: رفع مَلفات ومرفقات المهام.
* **الرسوم البيانية والتحليلات (Charts & Analytics)**: Recharts (رسوم بيانية تفاعلية لنمو المستخدمين، معدل إنجاز المهام، وتوزيع التصنيفات).
* **السحب والإفلات (Drag & Drop)**: `@hello-pangea/dnd` (لوحة كانبان تفاعلية سلسة).
* **التنقل (Routing)**: React Router DOM (v6) مع مسارات محمية (Protected Routes) وحماية الأدوار (Role-Based Access Control).
* **الأيقونات والتاريخ**: Lucide React & `date-fns`.

---

## 🏛️ 2. أقسام المنصة وكيفية عملها

تم تقسيم **TaskFlow** إلى 3 تطبيقات رئيسية في منصة واحدة:

```
TaskFlow SaaS Platform
 ├── 1. الموقع العام (Public Website)
 │     ├── الصفحة الرئيسية (Landing Page)
 │     ├── المميزات (Features)
 │     ├── الأسعار والخطط (Pricing)
 │     ├── من نحن (About)
 │     └── المصادقة (Login / Register / Forgot Password)
 │
 ├── 2. تطبيق المستخدم (User SaaS App)
 │     ├── لوحة التحكم وتحليلات الذكاء التراكمي (Dashboard & Smart Insights)
 │     ├── مهامي وتجهيز القوالب (My Tasks & Task Templates)
 │     ├── الاعتمادية والروابط بين المهام (Task Dependencies - Blocks/Blocked By)
 │     ├── المهام الفرعية (Subtasks Checklist)
 │     ├── متتبع الوقت (Task Time Tracker)
 │     ├── لوحة الأوامر السريعة (Command Palette Cmd+K)
 │     ├── المشاريع وتفاصيلها (Projects & Project Details)
 │     ├── مؤشر صحة المشروع (Project Health Calculator)
 │     ├── لوحة كانبان التفاعلية (Kanban Board)
 │     ├── العرض الزمني للمشروع (Timeline Gantt View)
 │     ├── تقويم المهام (Calendar View)
 │     ├── الفريق وإدارة الدعوات والمعلقات (Team & Pending Invitations)
 │     ├── الإشعارات ومستدعي المنشن (Notifications & @mentions)
 │     ├── تصدير البيانات (CSV & JSON Data Exporter)
 │     ├── الفواتير وحدود الاستخدام (Billing & Limits)
 │     ├── مؤشر الاتصال والشبكة (Network Offline Banner)
 │     └── الإعدادات والتفضيلات (Settings)
 │
 └── 3. تطبيق الآدمين (Admin Application)
       ├── لوحة تحكم الآدمين (Admin Dashboard)
       ├── تحليلات الرسوم البيانية (Recharts Analytics)
       ├── إدارة المستخدمين والأدوار (User Management & Roles)
       ├── إدارة مساحات العمل والمشاريع والمهام (Workspaces / Projects / Tasks)
       └── سجل عمليات النظام (System Activity Audit Logs)
```

---

## ⚙️ 3. تفاصيل الوظائف المتقدمة الإضافية

### 1. محرك التحليلات الحسابية التراكمية (Deterministic Smart Insights)
* يحلل بيانات مساحة العمل تلقائياً بدون ادعاء ذكاء اصطناعي وهمي:
  * ينبه عند وجود مهام متأخرة عن موعدها.
  * يكتشف الضغط العالي والتحميل الزائد على أحد الأعضاء (`Peak Workload`).
  * يحدد المشاريع في حالة خطر بناءً على نسبة الإنجاز والتواريخ.

### 2. اعتماديات المهام (Task Dependencies `Blocks` / `Blocked By`)
* ربط المهام ببعضها (مثال: المهمة "ب" محجوبة بواسطة المهمة "أ").
* إظهار تحذيرات ووسم شفاف ينبه العضو بأن المهمة متوقفة على إنجاز مهمة أخرى.

### 3. قوالب المهام الجاهزة (Task Templates)
* توفير قوالب سريعة مسبقة الإعداد (*Bug Report*, *Feature Request*, *Website Page*, *Marketing Campaign*).
* تعبئة العنوان والوصف والتصنيف والأولوية والمهام الفرعية تلقائياً بنقرة واحدة.

### 4. إدارة دعوات مساحة العمل (Workspace Invitations System)
* إدارة الدعوات المعلقة للأعضاء الجدد (`email`, `role`, `status: pending`).
* إمكانية إعادة إرسال الدعوة (*Resend*) أو إلغائها (*Revoke*) من صفحة الفريق.

### 5. محرك تصدير البيانات (CSV & JSON Data Exporter)
* يتيح للمستخدمين والمدراء تصدير كافة بيانات المهام والمشاريع بضغطة زر وتنزيلها كملف `CSV` أو `JSON`.

---

## 🚀 4. كيفية التشغيل واختبار البناء (Commands)

1. **تثبيت المكتبيات**:
   ```bash
   npm install
   ```

2. **تشغيل السيرفر المحلي للاختبار**:
   ```bash
   npm run dev
   ```
   يتم فتح التطبيق على `http://localhost:5173`.

3. **اختبار بناء ملفات الإنتاج (Production Build)**:
   ```bash
   npm run build
   ```
   تم فحص البناء بنجاح وبدون أي أخطاء (`✓ built in 3.00s`).
