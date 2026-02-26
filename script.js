// ==========================================
// 1. ระบบ Slider ข่าว (News Carousel)
// ==========================================
const track = document.getElementById('newsTrack');

if (track) {
    const cards = track.querySelectorAll('.card');
    const totalCards = cards.length;
    let cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    let currentIndex = 0;

    window.addEventListener('resize', () => {
        cardsPerView = window.innerWidth <= 768 ? 1 : 3;
        currentIndex = 0;
        track.style.transform = `translateX(0px)`;
    });

    function slideNews() {
        if (!cards[0] || !cards[1]) return;
        currentIndex++;
        if (currentIndex > totalCards - cardsPerView) {
            currentIndex = 0;
        }
        const card1Position = cards[0].getBoundingClientRect().left;
        const card2Position = cards[1].getBoundingClientRect().left;
        const exactDistance = card2Position - card1Position;
        track.style.transform = `translateX(-${currentIndex * exactDistance}px)`;
    }
    setInterval(slideNews, 3000);
}

// ==========================================
// 2. ระบบ Filter ข่าว และ ค้นหา
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('.filter-item');
const searchInput = document.getElementById('newsSearchInput');

function applyFilters() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const currentCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    filterItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemText = item.textContent.toLowerCase();
        const matchesCategory = (currentCategory === 'all' || itemCategory === currentCategory);
        const matchesSearch = itemText.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    });
}

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
        });
    });
}
if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

// ==========================================
// 3. ระบบ Mobile Navbar (Hamburger Menu)
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
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
// 4. Scroll Animation
// ==========================================
const animateElements = document.querySelectorAll('.header-title-container, .card, .text-box-card, .filter-menu');

animateElements.forEach((el, index) => {
    el.classList.add('reveal');
    if (!el.closest('.slider-track')) {
        el.style.transitionDelay = `${(index % 3) * 0.15}s`;
    }
});

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// ==========================================
// 5. ระบบ Scroll to Top
// ==========================================
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
// ==========================================
// 6. ระบบ Popup อ่านข่าวเต็ม & ฟอร์มรับสมัคร (Force Update)
// ==========================================
const modal = document.getElementById('newsModal');
const closeBtn = document.getElementById('closeModalBtn');
const regSection = document.getElementById('registrationSection');
const modalSlots = document.getElementById('modalSlots');
const recruitForm = document.getElementById('recruitForm');

let currentEventId = "";

// ใช้ document.body กางตาข่ายดักจับการคลิกทั้งหน้าเว็บ
document.body.addEventListener('click', async (e) => {
    // เช็กว่าสิ่งที่คลิก เป็นส่วนหนึ่งของการ์ดข่าวไหม?
    const card = e.target.closest('.card');
    
    if (card) {
        e.preventDefault(); // หยุดการลิ้งก์ปกติ
        
        // ทดสอบเด้ง Alert เมื่อกดการ์ด (ถ้ากดแล้วข้อความนี้ขึ้น แปลว่าระบบคลิกทำงาน!)
        console.log("พบการคลิกที่การ์ด!"); 

        // 1. จัดการรูปภาพ
        const img = card.querySelector('img');
        if(document.getElementById('modalImage')) {
            document.getElementById('modalImage').src = img ? img.src : 'pic/IOTE.png'; 
        }

        // 2. จัดการ Badge
        const badge = card.querySelector('.news-badge');
        const modalBadge = document.getElementById('modalBadge');
        
        if (badge && modalBadge) {
            // ใช้คำสั่ง getComputedStyle เพื่อดึง "สีที่แสดงผลจริงๆ" บนหน้าจอมาใช้
            const badgeStyle = window.getComputedStyle(badge);
            
            modalBadge.innerText = badge.innerText;
            modalBadge.style.backgroundColor = badgeStyle.backgroundColor; // ก๊อปปี้สีพื้นหลัง
            modalBadge.style.color = badgeStyle.color;                     // ก๊อปปี้สีตัวหนังสือ
            modalBadge.style.padding = badgeStyle.padding;                 // ก๊อปปี้ระยะห่าง
            modalBadge.style.borderRadius = badgeStyle.borderRadius;       // ก๊อปปี้ความโค้งมน
            
            modalBadge.style.display = 'inline-block';
        } else if (modalBadge) {
            modalBadge.style.display = 'none';
        }

        // 3. จัดการหัวข้อ
        const titleEl = card.querySelector('.hero-title, .side-title') || card.querySelector('.card-body');
        let titleText = titleEl ? titleEl.innerText : "ไม่มีหัวข้อข่าว";
        if(badge) titleText = titleText.replace(badge.innerText, '');
        if(document.getElementById('modalTitle')) {
            document.getElementById('modalTitle').innerText = titleText.trim();
        }

        // 4. จัดการคำอธิบาย
        const descEl = card.querySelector('.hero-desc');
        if(document.getElementById('modalDescription')) {
            document.getElementById('modalDescription').innerHTML = descEl ? descEl.innerHTML : "อ่านรายละเอียดเพิ่มเติมของเนื้อหาข่าวนี้...";
        }

        // 5. เช็กระบบรับสมัคร
        const isRecruit = card.getAttribute('data-type') === 'recruit';
        currentEventId = card.getAttribute('data-event-id');

        if (isRecruit && currentEventId && regSection && modalSlots && recruitForm) {
            regSection.style.display = 'block';
            modalSlots.innerText = "กำลังเช็กจำนวนที่นั่ง...";
            modalSlots.style.display = 'inline-block';
            modalSlots.style.backgroundColor = "#ffc107"; 

            const submitBtn = recruitForm.querySelector('button');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "กำลังโหลด...";
            }

            try {
                // พยายามดึงข้อมูลจากหลังบ้าน
                const response = await fetch(`http://localhost:3000/api/slots/${currentEventId}`);
                const data = await response.json();
                
                if (data.slots > 0) {
                    modalSlots.innerText = `🔥 รับด่วน! ขาดอีก ${data.slots} คน`;
                    modalSlots.style.backgroundColor = "#dc3545"; 
                    if(submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = "ยืนยันการสมัคร";
                    }
                } else {
                    modalSlots.innerText = `❌ เต็มแล้ว!`;
                    modalSlots.style.backgroundColor = "#6c757d"; 
                    if(submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerText = "ปิดรับสมัครแล้ว";
                    }
                }
            } catch (err) {
                console.error("เชื่อมต่อ Backend ไม่สำเร็จ", err);
                modalSlots.innerText = "ยังไม่ได้เปิด Backend หรือเซิร์ฟเวอร์ขัดข้อง";
                modalSlots.style.backgroundColor = "#6c757d";
                if(submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = "ระบบขัดข้องชั่วคราว";
                }
            }
        } else {
            if(regSection) regSection.style.display = 'none';
            if(modalSlots) modalSlots.style.display = 'none';
        }

        // แสดง Popup
        if(modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        }
    }
});

// ฟังก์ชันปิด Popup
const closeModal = () => {
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
if(closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ฟังก์ชันส่งข้อมูลสมัคร
if (recruitForm) {
    recruitForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const inputs = recruitForm.querySelectorAll('input');
        const formData = {
            eventId: currentEventId,
            name: inputs[0].value,
            studentId: inputs[1].value,
            phone: inputs[2].value
        };

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (result.success) {
                alert(`🎉 ${result.message}\nตอนนี้เหลือที่นั่งอีก ${result.remain} คน`);
                recruitForm.reset();
                closeModal();
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (err) {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าเปิด Backend (node server.js) แล้วหรือยัง");
        }
    });
}

// ฟังก์ชันสำหรับโหลดจำนวนที่นั่งมาแสดงที่หน้าการ์ดข่าว
async function updateAllSlotsIndicators() {
    // หาการ์ดทุกใบที่มีป้ายบอกจำนวนคน
    const indicators = document.querySelectorAll('.slots-indicator');

    for (const span of indicators) {
        const eventId = span.getAttribute('data-event-id');
        
        try {
            // เรียก API ไปที่ Node.js ที่รันอยู่ที่พอร์ต 3000
            const response = await fetch(`http://localhost:3000/api/slots/${eventId}`);
            const data = await response.json();

            if (data.slots > 0) {
                span.innerText = `🔥 รับด่วน! ขาดอีก ${data.slots} คน`;
            } else {
                span.innerText = `❌ เต็มแล้ว`;
                span.style.backgroundColor = "#6c757d"; // เปลี่ยนเป็นสีเทาถ้าเต็ม
            }
        } catch (err) {
            console.log("ไม่สามารถดึงที่นั่งสำหรับงาน:", eventId);
        }
    }
}

// สั่งให้ทำงานทันทีที่โหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', updateAllSlotsIndicators);