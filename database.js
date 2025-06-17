// متغير قاعدة البيانات
let db;

// تهيئة قاعدة البيانات
function initDatabase() {
    // في تطبيق حقيقي، هنا يتم الاتصال بقاعدة بيانات حقيقية
    // هذا مثال محاكي لقاعدة بيانات باستخدام localStorage
    
    // إذا لم تكن قاعدة البيانات موجودة، قم بإنشائها
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// تسجيل مستخدم جديد
function registerUser(username, email, password, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // التحقق من عدم وجود مستخدم بنفس الاسم أو البريد
    const userExists = users.some(user => user.username === username || user.email === email);
    
    if(userExists) {
        callback(false, 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل');
        return;
    }
    
    // إنشاء مستخدم جديد
    const newUser = {
        id: Date.now().toString(),
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    callback(true, 'تم التسجيل بنجاح');
}

// تسجيل الدخول
function loginUser(username, password, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    callback(!!user, user);
}

// الحصول على مستخدم بالاسم والبريد
function getUserByUsernameAndEmail(username, email, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.email === email);
    callback(user || null);
}

// تحديث كلمة المرور
function updateUserPassword(userId, newPassword, callback) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === userId);
    
    if(userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        callback(true);
    } else {
        callback(false);
    }
}