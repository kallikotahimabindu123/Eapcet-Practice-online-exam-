# Excel Upload Format & Website Sharing Guide

## 📊 **Excel Format for Question Upload**

### **Required Columns (Exact Names):**
```
Question | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Subject | Marks
```

### **Sample Excel Format:**
| Question | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Subject | Marks |
|----------|---------|---------|---------|---------|---------------|---------|-------|
| What is 2+2? \| 2+2 ఎంత? | 3 | 4 | 5 | 6 | B | mathematics | 4 |
| Speed of light? \| కాంతి వేగం? | 3×10⁸ m/s | 3×10⁶ m/s | 3×10⁷ m/s | 3×10⁹ m/s | A | physics | 4 |
| Water formula? \| నీటి సూత్రం? | H₂O | CO₂ | NH₃ | CH₄ | A | chemistry | 4 |

### **Important Rules:**
- ✅ **CorrectAnswer:** Use A, B, C, or D (capital letters)
- ✅ **Subject:** Use lowercase: `mathematics`, `physics`, `chemistry`
- ✅ **Marks:** Usually 4 for each question
- ✅ **Bilingual:** English first, then `|` then Telugu
- ✅ **No empty cells** in required columns

### **How to Upload:**
1. **Login as Admin** (`admin@example.com` / `admin123`)
2. **Go to "Manage Exams"**
3. **Click "Upload Questions"** button
4. **Select your exam** from dropdown
5. **Upload your Excel file**
6. **Click "Upload Questions"**

---

## 🌐 **How to Share Website with Others**

### **Your Website URL:**
```
https://eapcet-online-test-r-c0di.bolt.host
```

### **For Students to Take Exams:**

#### **Step 1: Student Registration**
Students need to:
1. **Go to:** https://eapcet-online-test-r-c0di.bolt.host
2. **Click "Register"**
3. **Fill details:** Name, Email, Password
4. **Select Role:** Student
5. **Upload photo** (optional)
6. **Click "Create Account"**

#### **Step 2: Admin Assigns Exams**
You (admin) need to:
1. **Login as admin**
2. **Go to "Manage Students"**
3. **Find the student**
4. **Click "Assign Exams"**
5. **Select which exams** to assign

#### **Step 3: Student Takes Exam**
Student can then:
1. **Login** with their credentials
2. **See assigned exams** on dashboard
3. **Click "Start Exam"**
4. **Allow camera access** (required)
5. **Take the exam**
6. **View results** after submission

---

## 🧪 **Testing the Website (No Errors)**

### **Test Accounts Already Created:**
```
Admin Account:
Email: admin@example.com
Password: admin123

Student Account:
Email: student@example.com  
Password: password123
```

### **Complete Testing Flow:**

#### **1. Test Admin Functions:**
- ✅ Login as admin
- ✅ Create new exam
- ✅ Upload questions via Excel
- ✅ Assign exam to students
- ✅ View student submissions

#### **2. Test Student Functions:**
- ✅ Register new student account
- ✅ Login as student
- ✅ Take assigned exam
- ✅ Camera permission works
- ✅ Submit exam and view results

#### **3. Test Different Devices:**
- ✅ Desktop/Laptop
- ✅ Mobile phone
- ✅ Tablet
- ✅ Different browsers (Chrome, Firefox, Safari)

---

## 📱 **Mobile Responsiveness Features:**
- ✅ **Collapsible sidebar** on mobile
- ✅ **Touch-friendly buttons**
- ✅ **Optimized layouts** for small screens
- ✅ **Hamburger menu** navigation
- ✅ **Camera works** on mobile devices

---

## 🔒 **Security Features:**
- ✅ **Webcam monitoring** during exams
- ✅ **Auto-save** every 30 seconds
- ✅ **Time limits** with auto-submit
- ✅ **Secure authentication**
- ✅ **Role-based access** (admin/student)

---

## 📊 **Data Storage:**
All data is stored in **Supabase PostgreSQL**:
- ✅ Student registrations
- ✅ Exam questions and answers
- ✅ Student submissions and scores
- ✅ Real-time data sync

---

## 🎯 **Quick Start for Others:**

**Share this with students:**
```
1. Go to: https://eapcet-online-test-r-c0di.bolt.host
2. Click "Register" and create account
3. Wait for admin to assign exams
4. Login and take your assigned exams
5. Make sure camera is working before starting
```

**For other admins:**
```
1. Register with role "Admin"
2. Create exams and upload questions
3. Assign exams to students
4. Monitor submissions and results
```