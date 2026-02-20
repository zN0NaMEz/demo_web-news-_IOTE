// ==========================================
// 1. ระบบ Slider ข่าว (News Carousel)
// ==========================================
const track = document.getElementById('newsTrack');

if (track) {
    const cards = track.querySelectorAll('.card');
    const totalCards = cards.length;

    // ตั้งค่าให้โชว์ทีละ 3 ใบ (มือถือโชว์ทีละ 1 ใบ)
    let cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    let currentIndex = 0;

    // อัปเดตจำนวนการ์ดที่โชว์เมื่อมีการย่อ/ขยายหน้าจอ
    window.addEventListener('resize', () => {
        cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    });

    function slideNews() {
        currentIndex++;

        // ถ้าเลื่อนไปจนสุด (ข่าวหมด) ให้วนกลับมาที่รูปแรก
        if (currentIndex > totalCards - cardsPerView) {
            currentIndex = 0;
        }

        // ให้ JS วัดความกว้างจริงของการ์ดใบแรก ณ เวลานั้นเลย
        const cardWidth = cards[0].offsetWidth;

        // สั่งเลื่อนตามพิกเซลจริง
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
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