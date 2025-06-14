document.addEventListener('DOMContentLoaded', function() {
    // القائمة المتحركة للهواتف
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // تصفية معرض الأعمال
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة النشط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة النشط للزر المحدد
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // تأثير التمرير للعناصر
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });
    
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));
    
    // إضافة كلاس hidden للعناصر التي نريد ظهورها بالتدرج
    document.querySelectorAll('section').forEach(section => {
        section.querySelectorAll('h2, .about-container, .portfolio-grid, .skills-container, .contact-container').forEach(el => {
            el.classList.add('hidden');
        });
    });
    
    // إرسال نموذج التواصل
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // هنا يمكنك إضافة كود إرسال النموذج
        alert('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.');
        this.reset();
    });
    
    // تغيير لون الشريط العلوي عند التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            document.querySelector('header').style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            document.querySelector('header').style.backgroundColor = 'white';
        }
    });
});
