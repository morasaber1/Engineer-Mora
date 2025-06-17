// متغيرات عامة
let verificationCode = '';
let currentUser = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة قاعدة البيانات
    initDatabase();
    
    // تحميل بيانات التذكر إذا وجدت
    if(localStorage.getItem('rememberMe') === 'true') {
        document.getElementById('remember').checked = true;
        document.getElementById('username').value = localStorage.getItem('username') || '';
        document.getElementById('password').value = localStorage.getItem('password') || '';
    }
    
    // معالجة إرسال نموذج تسجيل الدخول
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // التحقق من صحة بيانات الدخول
        loginUser(username, password, function(success, user) {
            if(success) {
                // حفظ البيانات إذا تم اختيار "تذكرني"
                if(rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                    localStorage.setItem('rememberMe', true);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                    localStorage.removeItem('rememberMe');
                }
                
                alert(`مرحباً ${user.username}! تم تسجيل الدخول بنجاح`);
                // توجيه المستخدم إلى الصفحة الرئيسية
                // window.location.href = 'home.html';
            } else {
                alert('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        });
    });
    
    // معالجة إرسال نموذج التسجيل
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // التحقق من تطابق كلمتي المرور
        if(password !== confirmPassword) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }
        
        // تسجيل المستخدم الجديد
        registerUser(username, email, password, function(success, message) {
            if(success) {
                alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
                showLoginForm();
                document.getElementById('loginForm').reset();
            } else {
                alert(message);
            }
        });
    });
});

// تبديل عرض كلمة المرور
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = passwordField.nextElementSibling;
    
    if(passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// عرض نموذج التسجيل
function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('forgotPasswordContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    document.getElementById('registerForm').reset();
}

// عرض نموذج تسجيل الدخول
function showLoginForm() {
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('forgotPasswordContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('loginForm').reset();
}

// عرض نموذج استعادة كلمة المرور
function showForgotPassword() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('forgotPasswordContainer').style.display = 'block';
    document.getElementById('forgotPasswordForm').reset();
    document.getElementById('verificationCodeGroup').style.display = 'none';
    document.getElementById('newPasswordGroup').style.display = 'none';
    document.getElementById('resetPasswordBtn').style.display = 'none';
}

// إرسال رمز التحقق
function sendVerificationCode() {
    const username = document.getElementById('forgotUsername').value;
    const email = document.getElementById('forgotEmail').value;
    
    // التحقق من وجود المستخدم
    getUserByUsernameAndEmail(username, email, function(user) {
        if(user) {
            currentUser = user;
            // إنشاء رمز تحقق عشوائي (6 أرقام)
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // في تطبيق حقيقي، هنا يتم إرسال الرمز إلى البريد الإلكتروني
            alert(`تم إرسال رمز التحقق إلى بريدك الإلكتروني. الرمز: ${verificationCode} (في التطبيق الحقيقي سيتم إرساله إلى البريد)`);
            
            // إظهار حقل إدخال الرمز
            document.getElementById('verificationCodeGroup').style.display = 'block';
        } else {
            alert('لا يوجد حساب مرتبط ببيانات الدخول هذه');
        }
    });
}

// إعادة تعيين كلمة المرور
function resetPassword() {
    const code = document.getElementById('verificationCode').value;
    const newPassword = document.getElementById('newPassword').value;
    
    if(code !== verificationCode) {
        alert('رمز التحقق غير صحيح');
        return;
    }
    
    if(!newPassword || newPassword.length < 6) {
        alert('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل');
        return;
    }
    
    // تحديث كلمة المرور في قاعدة البيانات
    updateUserPassword(currentUser.id, newPassword, function(success) {
        if(success) {
            alert('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة');
            showLoginForm();
        } else {
            alert('حدث خطأ أثناء تحديث كلمة المرور');
        }
    });
}

// عند إدخال رمز التحقق
document.getElementById('verificationCode').addEventListener('input', function() {
    if(this.value.length === 6) {
        if(this.value === verificationCode) {
            document.getElementById('newPasswordGroup').style.display = 'block';
            document.getElementById('resetPasswordBtn').style.display = 'block';
        } else {
            alert('رمز التحقق غير صحيح');
        }
    }
});