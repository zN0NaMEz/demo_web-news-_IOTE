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
// 2. ระบบ Filter ข่าว (Tab Menu)
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('.filter-item');

// เช็กว่ามีปุ่มและมีการ์ดข่าวให้ Filter หรือไม่
if (filterButtons.length > 0 && filterItems.length > 0) {
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // 2.1 ลบสถานะ Active สีส้ม ออกจากปุ่มทั้งหมด
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2.2 ใส่สถานะ Active ให้ปุ่มที่เพิ่งกด
            button.classList.add('active');

            // 2.3 ดึงค่าว่าปุ่มนี้คือหมวดหมู่อะไร (all, research, award, activity)
            const filterValue = button.getAttribute('data-filter');

            // 2.4 วนลูปเช็กการ์ดข่าวทุกใบ
            filterItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // ถ้ากด "ทั้งหมด" หรือ หมวดหมู่ตรงกัน -> แสดงการ์ด
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hide');
                    
                    // เพิ่มลูกเล่น Fade-in ให้การ์ดค่อยๆ ปรากฏ
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease';
                        item.style.opacity = '1';
                    }, 50);

                } else {
                    // ถ้าหมวดหมู่ไม่ตรง -> ซ่อนการ์ด
                    item.classList.add('hide');
                }
            });
        });
    });
}