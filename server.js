const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// ตั้งค่าการเชื่อมต่อฐานข้อมูล MySQL (XAMPP)
// ==========================================
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // XAMPP ปกติใช้ root
    password: '',      // XAMPP ปกติไม่มีรหัสผ่าน
    database: 'iote_news', // ชื่อฐานข้อมูลที่เราเพิ่งสร้าง
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ตรวจสอบสถานะตอนเปิด Server
pool.getConnection()
    .then(() => console.log('🗄️ เชื่อมต่อฐานข้อมูล MySQL สำเร็จ!'))
    .catch((err) => console.error('❌ เชื่อมต่อ MySQL ไม่สำเร็จ:', err.message));

// ==========================================
// 1. API ดึงจำนวนที่นั่ง
// ==========================================
app.get('/api/slots/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const [rows] = await pool.query('SELECT slots_remaining FROM events WHERE id = ?', [eventId]);
        
        if (rows.length > 0) {
            res.json({ slots: rows[0].slots_remaining });
        } else {
            res.json({ slots: 0 }); 
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ระบบฐานข้อมูลขัดข้อง' });
    }
});

// ==========================================
// 2. API รับข้อมูลคนสมัคร
// ==========================================
app.post('/api/register', async (req, res) => {
    const { eventId, name, studentId, phone } = req.body;

    try {
        const [rows] = await pool.query('SELECT slots_remaining FROM events WHERE id = ?', [eventId]);
        
        if (rows.length > 0 && rows[0].slots_remaining > 0) {
            const currentSlots = rows[0].slots_remaining;
            const newSlots = currentSlots - 1;
            
            // อัปเดตที่นั่งให้ลดลง
            await pool.query('UPDATE events SET slots_remaining = ? WHERE id = ?', [newSlots, eventId]);
            
            // บันทึกข้อมูลลงตาราง registrations
            await pool.query(
                'INSERT INTO registrations (event_id, name, student_id, phone) VALUES (?, ?, ?, ?)', 
                [eventId, name, studentId, phone]
            );
            
            console.log(`📢 มีคนสมัครใหม่! ชื่อ: ${name} (รหัส: ${studentId})`);
            console.log(`ที่นั่งเหลือ: ${newSlots} คน`);
            
            res.json({ success: true, message: "ลงทะเบียนสำเร็จ!", remain: newSlots });
        } else {
            res.status(400).json({ success: false, message: "ขออภัย ที่นั่งเต็มแล้วครับ!" });
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึก:", err);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

app.listen(3000, () => {
    console.log('✅ Backend Server รันแล้วที่ http://localhost:3000');
});