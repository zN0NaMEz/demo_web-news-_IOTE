// ==========================================
// 1. ระบบ Slider ข่าว (News Carousel) - แก้ไขบั๊กเลื่อนไม่ตรง
// ==========================================
const track = document.getElementById('newsTrack');

if (track) { 
    const cards = track.querySelectorAll('.card');
    const totalCards = cards.length;
    
    // ตั้งค่าให้โชว์ทีละ 3 ใบ (มือถือโชว์ทีละ 1 ใบ)
    let cardsPerView = window.innerWidth <= 768 ? 1 : 3; 
    let currentIndex = 0;

    // เมื่อมีการย่อ/ขยายหน้าจอ ให้รีเซ็ตกลับไปรูปแรกสุดเพื่อป้องกันการแสดงผลเพี้ยน
    window.addEventListener('resize', () => {
        cardsPerView = window.innerWidth <= 768 ? 1 : 3;
        currentIndex = 0;
        track.style.transform = `translateX(0px)`;
    });

    function slideNews() {
        currentIndex++;

        // ถ้าเลื่อนไปจนสุด (ข่าวหมด) ให้วนกลับมาที่รูปแรก
        if (currentIndex > totalCards - cardsPerView) {
            currentIndex = 0;
        }

        // วิธีที่แม่นยำ 100%: วัดระยะห่างจริงระหว่างใบที่ 1 และใบที่ 2 
        // (รวมความกว้างการ์ด + Gap + เศษทศนิยมไว้ครบถ้วน)
        const card1Position = cards[0].getBoundingClientRect().left;
        const card2Position = cards[1].getBoundingClientRect().left;
        const exactDistance = card2Position - card1Position;
        
        // สั่งเลื่อนตามระยะที่วัดได้เป๊ะๆ
        track.style.transform = `translateX(-${currentIndex * exactDistance}px)`;
    }

    // เลื่อนอัตโนมัติทุกๆ 3 วินาที (3000 ms)
    setInterval(slideNews, 3000);
}

// ==========================================
// 2. ระบบ Filter ข่าว และ ค้นหา (Search & Tab Menu)
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('.filter-item');
const searchInput = document.getElementById('newsSearchInput');

// ฟังก์ชันหลักสำหรับกรองข่าว (เช็กทั้งปุ่มที่กด และ คำที่พิมพ์ค้นหา)
function applyFilters() {
    // 1. ดูว่าตอนนี้ปุ่มไหนถูกกดอยู่ (All, Award, Activity)
    const activeBtn = document.querySelector('.filter-btn.active');
    const currentCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    // 2. ดูว่าพิมพ์คำว่าอะไรอยู่ (ทำให้เป็นตัวพิมพ์เล็กทั้งหมดเพื่อเทียบง่ายๆ)
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    // 3. วนลูปเช็กการ์ดทุกใบ
    filterItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        // ดึงข้อความทั้งหมดในการ์ดใบนั้น (รวมถึงคำใน Badge ด้วย)
        const itemText = item.textContent.toLowerCase();

        // เงื่อนไขที่ 1: ตรงกับปุ่มหมวดหมู่ไหม?
        const matchesCategory = (currentCategory === 'all' || itemCategory === currentCategory);
        // เงื่อนไขที่ 2: มีคำที่พิมพ์ค้นหาไหม?
        const matchesSearch = itemText.includes(searchQuery);

        // ถ้าผ่านทั้ง 2 เงื่อนไข ให้โชว์การ์ด
        if (matchesCategory && matchesSearch) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide'); // ถ้าไม่ตรงให้ซ่อน
        }
    });
}

// ผูกระบบเข้ากับปุ่ม Tab Menu
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // สลับสถานะ Active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // เรียกฟังก์ชันกรองข่าว
            applyFilters();
        });
    });
}

// ผูกระบบเข้ากับช่องค้นหา (ทำงานทันทีที่พิมพ์)
if (searchInput) {
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
}

// ==========================================
// 3. ระบบ Mobile Navbar (Hamburger Menu)
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        // สลับคลาส 'active' เพื่อโชว์/ซ่อน เมนู
        navLinks.classList.toggle('active');
        
        // สลับไอคอนระหว่าง ขีด3ขีด กับ กากบาท
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// ==========================================
// 4. Scroll Animation (เลื่อนจอแล้วโผล่)
// ==========================================

// เลือกสิ่งที่เราอยากให้มีอนิเมชั่นเด้งขึ้นมา
const animateElements = document.querySelectorAll('.header-title-container, .card, .text-box-card, .filter-menu');

// วนลูปเพื่อใส่คลาส 'reveal' ให้กับทุกชิ้น
animateElements.forEach((el, index) => {
    el.classList.add('reveal');
    
    // ทริค: ให้การ์ดที่อยู่ติดกัน ค่อยๆ เด้งเหลื่อมเวลากัน (0.1วิ, 0.2วิ) ทำให้ดูสมูทมาก
    // ยกเว้นส่วน Slider ด้านบน ให้เด้งพร้อมกัน
    if(!el.closest('.slider-track')) {
        el.style.transitionDelay = `${(index % 3) * 0.15}s`;
    }
});

// ใช้ Intersection Observer เพื่อจับตาดูว่าตอนเลื่อนเมาส์ ของชิ้นนั้นโผล่เข้ามาในจอหรือยัง
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // ทำงานเมื่อเห็นของชิ้นนั้นโผล่มา 10%
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // ถ้าเลื่อนมาเจอ ให้ใส่คลาส active (โชว์อนิเมชั่น)
            entry.target.classList.add('active');
            
            // สั่งให้เลิกจับตาดู (เพื่อให้มันเด้งแค่ครั้งแรกครั้งเดียว)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// เริ่มจับตาดูทุกชิ้นที่มีคลาส reveal
document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// ==========================================
// 5. ระบบ Scroll to Top (ปุ่มเลื่อนกลับบนสุด)
// ==========================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    // เช็กระยะการเลื่อนหน้าจอ
    window.addEventListener("scroll", () => {
        // ถ้าเลื่อนลงมาเกิน 300px ให้โชว์ปุ่ม
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add("show");
        } else {
            // ถ้าอยู่บนสุดให้ซ่อนปุ่ม
            scrollTopBtn.classList.remove("show");
        }
    });

    // เมื่อคลิกปุ่ม ให้เลื่อนกลับไปบนสุดแบบนุ่มนวล
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // เลื่อนแบบสมูท
        });
    });
}