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
// ==========================================
// 4. Mobile Menu Handling (Hamburger)
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '60px';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.width = '100%';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 5px 5px rgba(0,0,0,0.1)';
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
// 6. ระบบ Popup อ่านข่าวเต็ม & ฟอร์มรับสมัคร
// ==========================================
const modal = document.getElementById('newsModal');
const closeBtn = document.getElementById('closeModalBtn');
const regSection = document.getElementById('registrationSection');
const modalSlots = document.getElementById('modalSlots');
const recruitForm = document.getElementById('recruitForm');

let currentEventId = "";

document.body.addEventListener('click', async (e) => {
    const card = e.target.closest('.card');

    if (card) {
        e.preventDefault();

        // 1. จัดการรูปภาพ
        const img = card.querySelector('img');
        if (document.getElementById('modalImage')) {
            document.getElementById('modalImage').src = img ? img.src : 'pic/IOTE.png';
        }

        // 2. จัดการ Badge
        const badge = card.querySelector('.news-badge');
        const modalBadge = document.getElementById('modalBadge');

        if (badge && modalBadge) {
            const badgeStyle = window.getComputedStyle(badge);
            modalBadge.innerText = badge.innerText;
            modalBadge.style.backgroundColor = badgeStyle.backgroundColor;
            modalBadge.style.color = badgeStyle.color;
            modalBadge.style.padding = badgeStyle.padding;
            modalBadge.style.borderRadius = badgeStyle.borderRadius;
            modalBadge.style.display = 'inline-block';
        } else if (modalBadge) {
            modalBadge.style.display = 'none';
        }

        // 3. จัดการหัวข้อ
        const titleEl = card.querySelector('.hero-title, .side-title') || card.querySelector('.card-body');
        let titleText = titleEl ? titleEl.innerText : "ไม่มีหัวข้อข่าว";
        if (badge) titleText = titleText.replace(badge.innerText, '');
        if (document.getElementById('modalTitle')) {
            document.getElementById('modalTitle').innerText = titleText.trim();
        }

        // 4. จัดการคำอธิบาย
        const descEl = card.querySelector('.hero-desc');
        if (document.getElementById('modalDescription')) {
            document.getElementById('modalDescription').innerHTML = descEl ? descEl.innerHTML : "อ่านรายละเอียดเพิ่มเติมของเนื้อหาข่าวนี้...";
        }

        // 5. เช็กระบบรับสมัคร
        const isRecruit = card.getAttribute('data-type') === 'recruit';
        window.currentEventId = card.getAttribute('data-event-id');

        const googleContainer = document.getElementById('googleSignInContainer');
        const regStatusMsg = document.getElementById('regStatusMsg');

        if (isRecruit && window.currentEventId && regSection && modalSlots) {
            regSection.style.display = 'block';
            modalSlots.innerText = "กำลังเช็กจำนวนที่นั่ง...";
            modalSlots.style.display = 'inline-block';
            modalSlots.style.backgroundColor = "#ffc107";

            if (regStatusMsg) regStatusMsg.innerText = "";

            try {
                const response = await fetch(`http://localhost:3000/api/slots/${window.currentEventId}`);
                const data = await response.json();

                if (data.slots > 0) {
                    modalSlots.innerText = `🔥 รับด่วน! ขาดอีก ${data.slots} คน`;
                    modalSlots.style.backgroundColor = "#dc3545";

                    if (googleContainer) {
                        google.accounts.id.initialize({
                            client_id: "75291653813-t6kk42bootq130linle5mfshululaith.apps.googleusercontent.com",
                            callback: window.handleGoogleLogin
                        });
                        google.accounts.id.renderButton(
                            googleContainer,
                            { theme: "outline", size: "large", width: "100%", text: "continue_with" }
                        );
                    }
                } else {
                    modalSlots.innerText = `❌ เต็มแล้ว!`;
                    modalSlots.style.backgroundColor = "#6c757d";
                    if (googleContainer) googleContainer.innerHTML = "";
                }
            } catch (err) {
                modalSlots.innerText = "ระบบเซิร์ฟเวอร์ขัดข้อง";
                modalSlots.style.backgroundColor = "#6c757d";
            }
        } else {
            if (regSection) regSection.style.display = 'none';
            if (modalSlots) modalSlots.style.display = 'none';
        }

        // แสดง Popup
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
});

// ฟังก์ชันปิด Popup
const closeModal = () => {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
if (closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });


// ฟังก์ชันสำหรับโหลดจำนวนที่นั่งมาแสดงที่หน้าการ์ดข่าว
async function updateAllSlotsIndicators() {
    const indicators = document.querySelectorAll('.slots-indicator');

    for (const span of indicators) {
        const eventId = span.getAttribute('data-event-id');

        try {
            const response = await fetch(`http://localhost:3000/api/slots/${eventId}`);
            const data = await response.json();

            if (data.slots > 0) {
                span.innerText = `🔥 รับด่วน! ขาดอีก ${data.slots} คน`;
            } else {
                span.innerText = `❌ เต็มแล้ว`;
                span.style.backgroundColor = "#6c757d";
            }
        } catch (err) {
            console.log("ไม่สามารถดึงที่นั่งสำหรับงาน:", eventId);
        }
    }
}

// ==========================================
// 7. ระบบ Google Sign-In & คัดกรองอีเมลสถาบัน
// ==========================================
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.handleGoogleLogin = async (response) => {
    const payload = decodeJwtResponse(response.credential);
    const email = payload.email;
    const name = payload.name;
    const statusMsg = document.getElementById('regStatusMsg');

    if (!email.endsWith('@kmitl.ac.th')) {
        statusMsg.style.color = "#dc3545";
        statusMsg.innerText = "❌ ปฏิเสธการเข้าถึง: กรุณาใช้อีเมลสถาบัน (@kmitl.ac.th) ครับ";
        return;
    }

    statusMsg.style.color = "#28a745";
    statusMsg.innerText = `กำลังบันทึกข้อมูลคุณ ${name}...`;

    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: window.currentEventId,
                name: name,
                email: email,
                phone: "-"
            })
        });
        const result = await res.json();

        if (result.success) {
            alert(`🎉 ยืนยันตัวตนสำเร็จ!\nยินดีต้อนรับ: ${name}`);
            location.reload();
        } else {
            statusMsg.style.color = "#dc3545";
            statusMsg.innerText = `❌ ${result.message}`;
        }
    } catch (err) {
        statusMsg.style.color = "#dc3545";
        statusMsg.innerText = "❌ ระบบขัดข้อง ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
    }
};

// ==========================================
// 8. ระบบ Auto-Slide เลื่อนข่าวอัตโนมัติ (เฉพาะจอมือถือ)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    let autoSlideTimer;

    const autoSlide = () => {
        if (window.innerWidth <= 768) {
            const card = sliderContainer.querySelector('.card');
            if (!card) return;

            const scrollAmount = card.offsetWidth + 15;

            if (sliderContainer.scrollLeft + sliderContainer.clientWidth >= sliderContainer.scrollWidth - 5) {
                sliderContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                sliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const startAutoSlide = () => {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(autoSlide, 3000);
    };

    startAutoSlide();

    sliderContainer.addEventListener('touchstart', () => {
        clearInterval(autoSlideTimer);
    });

    sliderContainer.addEventListener('touchend', () => {
        startAutoSlide();
    });
});

// สั่งให้โหลดจำนวนที่นั่งทำงานทันทีที่โหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', updateAllSlotsIndicators);