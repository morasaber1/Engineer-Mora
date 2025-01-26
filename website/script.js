// الحصول على العناصر
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const interactBtn = document.getElementById("interactBtn");
const effectMessage = document.getElementById("effectMessage");

// التحقق من الوضع الداكن المحفوظ
if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.classList.add("dark-mode");
}

// تبديل الوضع الداكن
darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkModeToggle.classList.toggle("dark-mode");

    // حفظ الوضع الداكن في localStorage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }
});

// إضافة تأثير عند الضغط على الزر
interactBtn.addEventListener("click", () => {
    effectMessage.textContent = "تم الضغط على الزر!";
    effectMessage.style.color = "green";
    effectMessage.style.fontSize = "20px";

    // إعادة التفاعل بعد 3 ثوانٍ
    setTimeout(() => {
        effectMessage.textContent = "";
    }, 3000);
});
