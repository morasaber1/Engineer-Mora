// تهيئة قاعدة البيانات
function initDatabase() {
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// تسجيل مستخدم جديد
function registerUser(username, email, password, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // التحقق من عدم وجود مستخدم بنفس الاسم أو البريد
    const userExists = users.some(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if(userExists) {
        callback(false, 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل');
        return;
    }
    
    // إنشاء مستخدم جديد
    const newUser = {
        id: Date.now().toString(),
        username: username,
        email: email,
        password: password, // في الواقع يجب استخدام تشفير
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    callback(true, 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
}


// تسجيل الدخول
function loginUser(username, password, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        callback(false, 'اسم المستخدم غير موجود. يرجى إنشاء حساب أولاً', null);
        return;
    }
    
    if (user.password !== password) {
        callback(false, 'كلمة المرور غير صحيحة. تواصل مع الإدارة إذا نسيت كلمة المرور', user);
        return;
    }
    
    callback(true, 'تم تسجيل الدخول بنجاح', user);
}

// باقي الدوال...
function getUserByUsernameAndEmail(username, email, callback) {
    // تأكد أن users هي المصفوفة التي تحتوي على المستخدمين المسجلين
    const user = users.find(u => 
        u.username === username && 
        u.email === email
    );
    callback(user || null);
}

function updateUserPassword(userId, newPassword, callback) {
    // ابحث عن المستخدم وقم بتحديث كلمة المرور
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        callback(true);
    } else {
        callback(false);
    }
}