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
// 2. API รับข้อมูลคนสมัคร (อัปเกรดเป็น Google Login)
// ==========================================
app.post('/api/register', async (req, res) => {
    // เปลี่ยนจากการรับ studentId เป็น email แทน
    const { eventId, name, email, phone } = req.body;

    try {
        const [rows] = await pool.query('SELECT slots_remaining FROM events WHERE id = ?', [eventId]);
        
        if (rows.length > 0 && rows[0].slots_remaining > 0) {
            const newSlots = rows[0].slots_remaining - 1;
            
            await pool.query('UPDATE events SET slots_remaining = ? WHERE id = ?', [newSlots, eventId]);
            
            // บันทึกข้อมูลลงฐานข้อมูล (ใช้ email แทน student_id)
            await pool.query(
                'INSERT INTO registrations (event_id, name, email, phone) VALUES (?, ?, ?, ?)', 
                [eventId, name, email, phone]
            );
            
            console.log(`📢 มีคนสมัครใหม่! ชื่อ: ${name} (อีเมล: ${email})`);
            
            res.json({ success: true, message: "ลงทะเบียนสำเร็จ!", remain: newSlots });
        } else {
            res.status(400).json({ success: false, message: "ขออภัย ที่นั่งเต็มแล้วครับ!" });
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการบันทึก:", err);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

// ==========================================
// 👑 ระบบแอดมิน (Admin API)
// ==========================================

// 1. [READ] ดึงรายชื่อทั้งหมดมาโชว์
app.get('/api/admin/registrants', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
    }
});

// 2. [DELETE] ลบชื่อและคืนที่นั่ง
app.delete('/api/admin/registrants/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // หาว่าคนที่ถูกลบ สมัครกิจกรรมอะไรไว้ (เพื่อจะคืนที่นั่งให้ถูกงาน)
        const [reg] = await pool.query('SELECT event_id FROM registrations WHERE id = ?', [id]);
        
        if (reg.length > 0) {
            const eventId = reg[0].event_id;
            
            // ลบรายชื่อออกจากตาราง
            await pool.query('DELETE FROM registrations WHERE id = ?', [id]);
            
            // คืนที่นั่ง (+1) ให้กิจกรรมนั้น
            await pool.query('UPDATE events SET slots_remaining = slots_remaining + 1 WHERE id = ?', [eventId]);
            
            res.json({ success: true, message: 'ลบข้อมูลและคืนที่นั่งเรียบร้อยแล้ว!' });
        } else {
            res.status(404).json({ success: false, message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'ระบบขัดข้อง' });
    }
});

// 3. [UPDATE] แก้ไขข้อมูล (เช่น พิมพ์ชื่อผิด)
app.put('/api/admin/registrants/:id', async (req, res) => {
    const id = req.params.id;
    const { name, phone } = req.body;
    try {
        await pool.query('UPDATE registrations SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);
        res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ!' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'ระบบขัดข้อง' });
    }
});

app.listen(3000, () => {
    console.log('✅ Backend Server รันแล้วที่ http://localhost:3000');
});