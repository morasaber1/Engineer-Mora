// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    
    // تحميل بيانات التذكر إذا وجدت
    if(localStorage.getItem('rememberMe') === 'true') {
        document.getElementById('remember').checked = true;
        document.getElementById('username').value = localStorage.getItem('username') || '';
    }
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

// عرض النماذج المختلفة
function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
}

function showForgotPassword() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('forgotPasswordContainer').style.display = 'block';
}
function resetPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const errorDiv = document.getElementById("forgotError");
    const successDiv = document.getElementById("forgotSuccess");
    
    if (!newPassword || newPassword.length < 6) {
        showError(errorDiv, "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
    }
    
    // تحديث كلمة المرور في localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // إرسال إشعار إلى ويب هوك Discord
        sendPasswordChangeToDiscord(currentUser.username, currentUser.email)
            .then(() => {
                showSuccess(successDiv, "تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول");
                setTimeout(() => showLoginForm(), 2000);
            })
            .catch(error => {
                console.error("Error sending notification:", error);
                showSuccess(successDiv, "تم تغيير كلمة المرور بنجاح ولكن حدث خطأ في إرسال الإشعار");
                setTimeout(() => showLoginForm(), 2000);
            });
    } else {
        showError(errorDiv, "حدث خطأ أثناء تحديث كلمة المرور");
    }
}

// دالة إرسال إشعار تغيير كلمة المرور إلى Discord
async function sendPasswordChangeToDiscord(username, email) {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        const webhookURL = "https://discord.com/api/webhooks/1384553129718317239/tb1HmhQ-oV41D9c6yecWT8ygoOKdvH0NIozwQ7Al-60USSb9Kq0JQqJyHSLo9WAeLEl8";
        
        const embed = {
            title: "🔄 تم تغيير كلمة المرور",
            description: `**👤 اسم المستخدم:** ${username}\n**📧 البريد الإلكتروني:** ${email}\n**🌐 IP:** ${ipData.ip}\n**🕒 وقت التغيير:** ${new Date().toLocaleString()}`,
            color: 0x00FF00,
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] })
        });
        
        if (!response.ok) throw new Error("Failed to send notification");
    } catch (error) {
        throw error;
    }
}