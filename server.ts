import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Data Store for server state persistence
interface ServerProposal {
  id: string;
  clubName: string;
  category: string;
  description: string;
  advisor: string;
  proposerName: string;
  proposerStudentId: string;
  proposerMajor: string;
  foundingMembers: string[];
  submittedDate: string;
  status: string;
  adminNotes?: string;
}

let serverProposals: ServerProposal[] = [
  {
    id: 'prop-1',
    clubName: 'ชมรมพัฒนาซอฟต์แวร์และ AI (WU Tech & AI)',
    category: 'วิชาการ',
    description: 'พื้นที่เรียนรู้การเขียนโค้ด พัฒนาโมเดล AI และสร้างโครงงานเทคโนโลยีเพื่อแก้ปัญหาในชุมชนและมหาวิทยาลัย',
    advisor: 'ดร.สมเกียรติ ปัญญาวงศ์ (สำนักวิชาสารสนเทศศาสตร์)',
    proposerName: 'นายภานุวัฒน์ นวัตกรรม',
    proposerStudentId: '68101234',
    proposerMajor: 'วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ ปี 2',
    foundingMembers: ['นายภานุวัฒน์ นวัตกรรม', 'นางสาวณิชา เทคโนโลยี', 'นายธนกฤต วิทยาการ'],
    submittedDate: '18 ก.ย. 2026',
    status: 'pending',
  },
  {
    id: 'prop-2',
    clubName: 'ชมรมกาแฟสเปเชียลตี้และการชง (WU Coffee Guild)',
    category: 'ไลฟ์สไตล์',
    description: 'ศึกษาศิลปะการคั่ว บด ชงกาแฟพันธุ์ไทย ส่งเสริมองค์ความรู้เมล็ดกาแฟภาคใต้ และสร้างเครือข่ายบาริสต้ารุ่นใหม่',
    advisor: 'ผศ.ดร.วรัญญา หอมกรุ่น (สำนักวิชาการจัดการ)',
    proposerName: 'นางสาวกานต์รวี สุขใจ',
    proposerStudentId: '68102345',
    proposerMajor: 'การจัดการการท่องเที่ยวและการบริการ ปี 3',
    foundingMembers: ['นางสาวกานต์รวี สุขใจ', 'นายปิยะพงษ์ คาเฟ่', 'นางสาวนภัสวรรณ รสละมุน'],
    submittedDate: '19 ก.ย. 2026',
    status: 'pending',
  }
];

let serverPolicies = [
  {
    id: 'pol-1',
    section: 'หมวดที่ 1: การจัดตั้งและบริหารงานชมรม',
    title: 'เกณฑ์การขอจัดตั้งชมรมใหม่ในมหาวิทยาลัยวลัยลักษณ์',
    content: 'การขอจัดตั้งชมรมใหม่ต้องมีนักศึกษาผู้ร่วมก่อตั้งไม่น้อยกว่า 3 คน พร้อมทั้งมีอาจารย์หรือบุคลากรประจำของมหาวิทยาลัยลงนามรับเป็นอาจารย์ที่ปรึกษาชมรม และต้องมีวัตถุประสงค์ที่ไม่ขัดต่อศีลธรรมอันดีหรือระเบียบมหาวิทยาลัย',
    updatedDate: '1 ส.ค. 2026'
  },
  {
    id: 'pol-2',
    section: 'หมวดที่ 2: ความปลอดภัยและเวลาการจัดกิจกรรม',
    title: 'ช่วงเวลาที่อนุญาตให้จัดกิจกรรมและมาตรฐานความปลอดภัย',
    content: 'กิจกรรมภายในมหาวิทยาลัยต้องจัดให้อยู่ระหว่างเวลา 06:00 - 21:00 น. หากเป็นกิจกรรมนอกสถานที่หรือค้างคืน ต้องยื่นขออนุญาตล่วงหน้าอย่างน้อย 14 วันทำการ พร้อมส่งมาตรการปฐมพยาบาลและรายชื่อผู้รับผิดชอบ',
    updatedDate: '15 ส.ค. 2026'
  },
  {
    id: 'pol-3',
    section: 'หมวดที่ 3: เกณฑ์การให้คะแนนความดี 5 ด้าน',
    title: 'การจัดสรรและบันทึกคะแนนความดีสำหรับผู้เข้าร่วมกิจกรรม',
    content: 'กิจกรรมที่ขอรับการประเมินคะแนนความดี ต้องสอดคล้องกับ 5 ด้านหลัก ได้แก่ ความกตัญญู (เป้าหมาย 10), การรู้วินัย (เป้าหมาย 14), การมีจิตอาสา (เป้าหมาย 33), การพัฒนาภาวะผู้นำ (เป้าหมาย 33), และความรักชาติ (เป้าหมาย 10) โดยชมรมต้องส่งรายชื่อเช็คชื่อยืนยันการเข้าร่วมผ่านระบบ',
    updatedDate: '20 ส.ค. 2026'
  }
];

let serverNotifications = [
  {
    id: 'notif-1',
    title: 'กิจกรรมใหม่รอการอนุมัติ',
    message: 'ชมรมดนตรีสากลได้ส่งคำขออนุมัติกิจกรรม "WU Acoustic Night 2026"',
    time: '15 นาทีที่แล้ว',
    read: false,
    type: 'activity'
  },
  {
    id: 'notif-2',
    title: 'คำขอจัดตั้งชมรมใหม่',
    message: 'นักศึกษาได้ยื่นคำขอจัดตั้ง "ชมรมพัฒนาซอฟต์แวร์และ AI"',
    time: '1 ชั่วโมงที่แล้ว',
    read: false,
    type: 'club'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // REST API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Club Proposals
  app.get("/api/proposals", (req, res) => {
    res.json(serverProposals);
  });

  app.post("/api/proposals", (req, res) => {
    const proposal = {
      id: `prop-${Date.now()}`,
      submittedDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      ...req.body
    };
    serverProposals.unshift(proposal);
    serverNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'มีคำขอจัดตั้งชมรมใหม่',
      message: `นักศึกษาได้ยื่นคำขอจัดตั้ง "${proposal.clubName}"`,
      time: 'เมื่อสักครู่',
      read: false,
      type: 'club'
    });
    res.status(201).json(proposal);
  });

  app.patch("/api/proposals/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const target = serverProposals.find(p => p.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    target.status = status;
    if (adminNotes) target.adminNotes = adminNotes;
    
    serverNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: status === 'approved' ? 'คำขอจัดตั้งชมรมได้รับการอนุมัติ' : 'คำขอจัดตั้งชมรมถูกปฏิเสธ',
      message: `ชมรม "${target.clubName}" ได้รับการพิจารณา: ${status === 'approved' ? 'อนุมัติเรียบร้อย' : adminNotes || 'ปฏิเสธ'}`,
      time: 'เมื่อสักครู่',
      read: false,
      type: 'club'
    });

    res.json(target);
  });

  // Policies
  app.get("/api/policies", (req, res) => {
    res.json(serverPolicies);
  });

  app.post("/api/policies", (req, res) => {
    const newPolicy = {
      id: `pol-${Date.now()}`,
      updatedDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...req.body
    };
    serverPolicies.push(newPolicy);
    res.status(201).json(newPolicy);
  });

  // Notifications
  app.get("/api/notifications", (req, res) => {
    res.json(serverNotifications);
  });

  app.post("/api/notifications/read", (req, res) => {
    serverNotifications = serverNotifications.map(n => ({ ...n, read: true }));
    res.json({ success: true });
  });

function generateSmartFallbackReply(message: string, role: string, context: any): string {
  const msg = (message || '').toLowerCase();
  
  if (msg.includes('คะแนนความดี') || msg.includes('ความดี') || msg.includes('เกณฑ์') || msg.includes('5 ด้าน')) {
    return `🌟 **เกณฑ์การสะสมคะแนนความดี 5 ด้าน มหาวิทยาลัยวลัยลักษณ์** (รวม 100 คะแนน เพื่อสำเร็จการศึกษา):
1. **การมีจิตอาสา** - เป้าหมาย 33 คะแนน
2. **การพัฒนาภาวะผู้นำ** - เป้าหมาย 33 คะแนน
3. **การรู้วินัย** - เป้าหมาย 14 คะแนน
4. **ความกตัญญู** - เป้าหมาย 10 คะแนน
5. **ความรักชาติ** - เป้าหมาย 10 คะแนน

💡 สามารถเข้าร่วมกิจกรรมของชมรมต่างๆ เพื่อสะสมคะแนนในแต่ละด้านได้ตลอดปีการศึกษาครับ!`;
  }

  if (msg.includes('กิจกรรม') || msg.includes('activity') || msg.includes('แนะนำกิจกรรม')) {
    if (context?.activities && context.activities.length > 0) {
      const recs = context.activities.slice(0, 3).map((a: any) => `• **${a.title}** (ชมรม${a.club}) - วันที่ ${a.date} ได้คะแนนความดีด้าน${a.goodnessCategory || 'จิตอาสา'} +${a.goodnessPoints || 1}`).join('\n');
      return `นี่คือกิจกรรมแนะนำใน ม.วลัยลักษณ์ ตอนนี้ครับ ✨\n\n${recs}\n\nสนใจเข้าร่วมกิจกรรมไหน สามารถกดดูรายละเอียดและลงทะเบียนในระบบได้ทันทีเลยครับ! 😊`;
    }
    return 'กิจกรรมแนะนำใน ม.วลัยลักษณ์ ตอนนี้ครับ 🏃‍♂️🎶\n• **WU Acoustic Night 2026** (ชมรมดนตรีสากล) ได้คะแนนภาวะผู้นำ +2.0\n• **บอร์ดเกมสานสัมพันธ์** (ชมรมบอร์ดเกม) ได้คะแนนจิตอาสา +1.5\n• **วิ่งรอบสระน้ำวลัยลักษณ์** (ชมรมวิ่ง WU Run) ได้คะแนนสุขภาพ\nลองเปิดดูในแท็บ "กิจกรรม" เพื่อลงทะเบียนได้เลยครับ!';
  }

  if (msg.includes('ชมรม') || msg.includes('club')) {
    if (context?.clubs && context.clubs.length > 0) {
      const recs = context.clubs.slice(0, 3).map((c: any) => `• **${c.name}** (${c.category}): ${c.desc}`).join('\n');
      return `ชมรมยอดนิยมที่น่าสนใจใน ม.วลัยลักษณ์ ครับ 🏛️✨\n\n${recs}\n\nคลิกดูเพิ่มเติมและสมัครสมาชิกได้ที่หน้ารายการชมรมเลยครับ!`;
    }
    return 'ใน ม.วลัยลักษณ์ มีชมรมหลากหลายหมวดหมู่ครับ ทั้งกีฬา ศิลปะ วิชาการ ดนตรี และจิตอาสา เช่น ชมรมทำอาหาร, ชมรมวิ่ง (WU Run), ชมรมถ่ายภาพ และชมรมบอร์ดเกม สนใจด้านไหนเป็นพิเศษบอกได้เลยครับ! 😊';
  }

  if (msg.includes('ระเบียบ') || msg.includes('จัดตั้ง') || msg.includes('เวลา')) {
    return `📌 **ระเบียบกิจกรรมและชมรม ม.วลัยลักษณ์**:
• **การจัดกิจกรรม**: จัดได้ระหว่างเวลา 06:00 - 21:00 น. หากเป็นกิจกรรมนอกสถานที่หรือค้างคืน ต้องยื่นขออนุญาตล่วงหน้าอย่างน้อย 14 วันทำการ
• **การขอจัดตั้งชมรมใหม่**: ต้องมีผู้ร่วมก่อตั้งไม่น้อยกว่า 3 คน พร้อมมีอาจารย์หรือบุคลากรประจำรับเป็นอาจารย์ที่ปรึกษา ยื่นผ่านระบบได้เลยครับ!`;
  }

  return `สวัสดีครับ! WU AI ยินดีช่วยเหลือครับ ✨ สามารถสอบถามเกี่ยวกับ:\n• แนะนำกิจกรรมและชมรมที่น่าสนใจ\n• เกณฑ์คะแนนความดี 5 ด้าน (รวม 100 คะแนน)\n• ระเบียบการจัดกิจกรรมและการขอจัดตั้งชมรม\nถามเข้ามาได้เลยครับ! 😊`;
}

  // API route for Chatbot with Ultra-Fast Streaming & Fallback
  app.post("/api/chat", async (req, res) => {
    const { message, context, role, stream } = req.body;

    let systemInstruction = `คุณคือ "WU AI Assistant" ผู้ช่วยอัจฉริยะประจำระบบ WU Club ของมหาวิทยาลัยวลัยลักษณ์
ข้อมูลสำคัญของมหาวิทยาลัยวลัยลักษณ์:
1. เกณฑ์คะแนนความดี 5 ด้าน (เป้าหมายรวม 100 คะแนน สำหรับสำเร็จการศึกษา):
   - จิตอาสา: เป้าหมาย 33 คะแนน
   - การพัฒนาภาวะผู้นำ: เป้าหมาย 33 คะแนน
   - การรู้วินัย: เป้าหมาย 14 คะแนน
   - ความกตัญญู: เป้าหมาย 10 คะแนน
   - ความรักชาติ: เป้าหมาย 10 คะแนน
2. ระเบียบกิจกรรม: อนุญาตให้จัดกิจกรรมระหว่าง 06:00 - 21:00 น. กิจกรรมนอกสถานที่/ค้างคืนต้องขออนุญาตล่วงหน้า 14 วันทำการ
3. การตั้งชมรมใหม่: ต้องมีนักศึกษาผู้ก่อตั้งอย่างน้อย 3 คน และมีอาจารย์ที่ปรึกษาประจำชมรม 1 คน
คำแนะนำในการตอบ:
- ตอบเป็นภาษาไทย สุภาพ เป็นกันเอง ชัดเจน ตรงคำถาม กระชับ (ไม่เกิน 4-5 บรรทัด หรือใช้ bullet list สั้นๆ ให้อ่านง่าย)
- ใส่อีโมจิให้ดูมีชีวิตชีวาและเป็นมิตรกับนักศึกษา
- หากผู้ใช้ถามเรื่องเกณฑ์คะแนนความดี ให้แจกแจงด้านและคะแนนเป้าหมายให้ชัดเจน`;
    
    if (role === 'student') {
      const userNeeds = (context?.goodnessStats || [])
        .filter((s: any) => s.current < s.target)
        .map((s: any) => `${s.name} (ขาดอีก ${(s.target - s.current).toFixed(1)})`)
        .join(', ');

      const userPref = (context?.preferences && context.preferences.length > 0)
        ? context.preferences.join(', ')
        : 'ทั่วไป';

      const availableActs = (context?.activities || []).slice(0, 5)
        .map((a: any) => `${a.title} (${a.club}, ด้าน${a.goodnessCategory}, +${a.goodnessPoints})`)
        .join('; ');

      const availableClubs = (context?.clubs || []).slice(0, 5)
        .map((c: any) => `${c.name} (${c.category})`)
        .join('; ');

      systemInstruction += `\n\nบริบทผู้ใช้ (นักศึกษา):
- ความสนใจ/ความชอบ: ${userPref}
- คะแนนความดีที่ยังขาด: ${userNeeds || 'ครบเกณฑ์ 100 คะแนนแล้ว'}
- กิจกรรมปัจจุบันในระบบ: ${availableActs}
- ชมรมในระบบ: ${availableClubs}
ถ้าผู้ใช้ถามแนะนำกิจกรรม ให้แนะนำตามความชอบ (${userPref}) หรือตามด้านคะแนนความดีที่ยังขาดอย่างเป็นมิตร`;
    } else if (role === 'club') {
      systemInstruction += `\n\nบริบทผู้ใช้: ผู้บริหารชมรม "${context?.clubName || ''}" ให้คำแนะนำเกี่ยวกับการจัดกิจกรรม ดึงดูดสมาชิกใหม่ และเกณฑ์ความดี`;
    } else if (role === 'system_admin') {
      systemInstruction += `\n\nบริบทผู้ใช้: ผู้ดูแลระบบส่วนกลาง (System Admin) มหาวิทยาลัยวลัยลักษณ์ ให้ข้อมูลเกี่ยวกับการอนุมัติกิจกรรม ระเบียบชมรม และภาพรวม`;
    }

    // Check if client requested SSE streaming
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      try {
        const responseStream = await ai.models.generateContentStream({
          model: "gemini-3.8-flash",
          contents: message || "สวัสดี",
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        }
        res.write(`data: [DONE]\n\n`);
        return res.end();
      } catch (streamError) {
        console.warn('Stream failed or busy, sending fallback stream:', streamError);
        const fallbackText = generateSmartFallbackReply(message, role, context);
        res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }
    }

    // Standard Non-streaming response
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message || "สวัสดี",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || generateSmartFallbackReply(message, role, context) });
    } catch (error) {
      console.warn('Gemini API call failed, using intelligent fallback:', error);
      const fallbackText = generateSmartFallbackReply(message, role, context);
      res.json({ text: fallbackText });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
