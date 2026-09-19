# UX/UI เว็บดูดวงที่เปิดตัวปี 2026 — งานวิจัยเทียบกับ REFFORTUNE

> วันที่สำรวจ: 19 ก.ย. 2569 (2026-09-19) · วิธีการ: เปิดเว็บจริงใน Chrome (Claude in Chrome) + ตรวจวันจดโดเมนผ่าน RDAP/WHOIS
> ข้อจำกัด: ไม่ได้สมัครสมาชิก ล็อกอิน หรือจ่ายเงิน ข้อมูลเกิดที่ใช้ทดสอบเป็นข้อมูลปลอม (01/01/1990) ส่วนที่ต้องล็อกอินจึงดูได้แค่หน้าประตู (gate) ไม่ได้เห็นผลลัพธ์ข้างใน
> หน้าจอที่ใช้ทดสอบเป็นเดสก์ท็อปกว้าง ~1568px (THAKSA เปิดครั้งแรกที่ ~633px จึงได้เห็นเลย์เอาต์มือถือด้วย) ไม่ได้ทดสอบ responsive แบบย่อขยายหน้าต่างทุกเว็บ

---

## 1. สรุปแพทเทิร์นร่วมที่เด่นที่สุด (Top cross-site patterns)

1. **"ฟรีก่อน แล้วค่อยล็อกส่วนลึก" (free teaser → locked deep reading)** — เว็บที่ดีที่สุดให้ผลฟรีทันทีไม่ต้องล็อกอิน (THAKSA ไพ่รายวัน, MuCraft ธาตุปาจื่อ, Starot widget, AkashicStone 3 ใบ) แล้ววาง **การ์ดเบลอ + ไอคอนกุญแจ** ใต้ผลฟรีเพื่อขายส่วนลึก (ใส่วันเกิด / ล็อกอิน / จ่าย) ส่วนเว็บที่บังคับล็อกอินก่อนเห็นอะไรเลย (AstroNeko, Horachat tarot, aitarot.pro) ทำให้ funnel สะดุดชัดเจน
2. **Micro-payment รายครั้งราคาต่ำ (฿29–฿99) มาแรงในไทย** — THAKSA ถามอาจารย์ ฿49/฿99 "รวมถามต่อฟรี 1 ครั้ง", AstroNeko ปลดล็อกไพ่ 3 ใบ ฿39 / เซียมซีความรัก ฿69, MuCraft ฿59/ครั้ง ควบคู่กับ subscription (Horachat ฿99/เดือน, MuCraft ฿299/เดือน) — ตรงกับโมเดลเครดิตของเรา
3. **LINE เป็นล็อกอินหลักของเว็บไทย** — MuCraft วางปุ่ม LINE สีเขียวเด่นสุดเหนือ Google และเบอร์โทร OTP, AstroNeko และ Horachat มี LINE, THAKSA ใช้ OTP เบอร์โทร + ชวน "รับไพ่และดวงรายวันใน LINE" เป็นช่องทาง retention
4. **ธีมมืด + ทอง (dark & gold, luxury-mystic)** เป็นมาตรฐานใหม่ — THAKSA, MuCraft, AkashicStone, aitarot.pro, Starot ล้วนพื้นดำ/ม่วงเข้ม ตัวอักษรทอง/ครีม serif หัวเรื่อง, ภาพไพ่ออกแบบเอง (THAKSA ไพ่นกฟีนิกซ์, AstroNeko แมวมาสคอต)
5. **"เลือกผู้อ่าน/เพอร์โซนา"** — Horachat (อาจารย์เทพ = โหราศาสตร์ไทย, แม่หมออลิสา = ทาโรต์), aitarot.pro (Selene Noir, Luna & Seren), Raka (4 Teacher Personas), THAKSA ผสม AI กับอาจารย์คนจริงที่มีเรตติ้ง/เวลาตอบเฉลี่ย ~5 นาที
6. **Retention loop รายวัน** — ไพ่ประจำวัน 7 วัน (THAKSA), ปฏิทินดวงรายวัน/สัปดาห์/เดือน (Horachat), streak (Raka "7-day streak"), Daily Fortune & Moon Pulse (Starot)
7. **ข้อความความโปร่งใส/ความเป็นส่วนตัว** ใช้เป็นจุดขาย — MuCraft (PDPA, ประมวลผลในอุปกรณ์, ข้อมูลอยู่ในอาเซียน, คืนเงิน 7 วัน, "ระบบแจ้งระดับความน่าเชื่อถือของทุกการอ่าน"), Raka/Starot วางตัวเป็น "self-reflection ไม่ใช่คำทำนาย", AkashicStone "No personal data stored"
8. **หน้าเครื่องมือฟรีเป็น SEO landing** — THAKSA มีบทความยาวใต้เครื่องมือ (ความหมายไพ่ 78 ใบ, วิธีจั่ว) + "เครื่องมืออื่นที่เกี่ยวข้อง", Starot บอกตรงๆ ว่า widget ฟรีมีไว้ "discovery, onboarding, and SEO", aitarot.pro มี scenario pages แยกเป็นร้อยหน้า
9. **ผสมพาณิชย์ของมงคล** — AstroNeko (ทองคำแท่งลายไพ่, สร้อย, วอลเปเปอร์เจิมแล้ว ฿299), AkashicStone (ร้านเครื่องประดับที่ใช้ AI tarot เป็นแม่เหล็ก), MuCraft "ส่วนลด Silk Road", Horachat "ช็อปของสายมู"

---

## 2. ตารางเปรียบเทียบ

| # | เว็บ | ประเทศ/ภาษา | เปิดตัว (หลักฐาน) | สถานะยืนยัน | ล็อกอินเมื่อไหร่ | โมเดลรายได้ | ธีม |
|---|------|-------------|---------------------|-------------|------------------|-------------|-----|
| 1 | THAKSA (thaksa.ai) | ไทย (TH/EN) | จดโดเมน 2026-04-26 (RDAP, registrant TH) | ✅ 2026 | หลังผลฟรี (ส่วนลึก) — OTP เบอร์โทร | อาจารย์คนจริง ฿49/฿99 ต่อคำถาม + ปลดล็อกส่วนลึก | ดำ-ทอง, ไพ่ฟีนิกซ์ |
| 2 | MuCraft (mucraft.in.th) | ไทย | จดโดเมน 2026-04-25 (THNIC WHOIS) + ป้าย "เปิดตัวเวอร์ชันทดลอง" | ✅ 2026 | หลังผลฟรีสั้นๆ — LINE / Google / เบอร์โทร OTP | ฟรี → ฿59/ครั้ง → ฿299/เดือน → ฿2,999/ปี | ดำ-ทอง, typographic |
| 3 | Starot (starot.ai) | สหรัฐฯ/อเมริกาเหนือ, EN | จดโดเมน 2026-04-29 (RDAP) + "Early access — coming Q2 2026" | ✅ 2026 (ยังเป็น waitlist) | Join waitlist | ยังไม่เปิดขาย | ดำ-เขียวมิ้นต์ |
| 4 | Raka (rakatarot.com) | สหรัฐฯ, EN | จดโดเมน 2026-06-21 (RDAP) + footer "© 2026 Vyve Health Tech" | ✅ 2026 | ในแอป (เว็บเป็นหน้า marketing) | Free + Mastery $9.99/เดือน, $79.99/ปี | ครีม-ม่วง, สว่าง |
| 5 | AkashicStone — Eye of Fate (akashicstone.com/pages/free-ai-tarot-online) | EN (ร้านค้าสากล) | จดโดเมน 2026-04-04 (RDAP) | ✅ 2026 | ไม่ต้องล็อกอิน | ฟรี ใช้ดึงคนเข้าร้านเครื่องประดับ | ดำ-ทอง, ไพ่ Rider–Waite |
| 6 | AI Tarot (aitarot.pro) | EN (มีปุ่มเปลี่ยนภาษา) | จดโดเมน 2026-03-18 (RDAP) — แต่ footer เขียน "© 2025" | ✅ 2026 (ตามโดเมน) | ก่อนอ่าน AI (ฟรี 1 ครั้ง/บัญชี), เครื่องมือจั่วไพ่ไม่ต้องล็อกอิน | Free / Plus $5.99–9.99 / Pro $11.99–19.99 ต่อเดือน | ม่วงเข้ม-ทอง, มีโหมดสว่าง |
| 7 | AstroNeko (astroneko.com, mu.astroneko.com) | ไทย | จดโดเมน 2025-07-03; ข่าวเปิดตัวไทยรัฐ 21 ต.ค. 2568; **ตู้ดูดวง AI** เปิดตัว ก.ย. 2569 (Siam Blockchain 9 ก.ย. 2026) | ⚠️ เว็บเปิดปี 2025 — ส่วนที่ใหม่ปี 2026 คือตู้และร้าน | ทันทีที่เลือกหมวด — Google / LINE / อีเมล | ปลดล็อก ฿39–฿99, รายงาน ฿289–฿6,444, ของมงคล | แดงเข้ม-ทอง, มาสคอตแมว |
| 8 | Horachat (horachat.com) | ไทย | จดโดเมน 2025-12-24; footer "© 2025" | ⚠️ น่าจะเปิดปลาย 2025/ต้น 2026 — ยืนยันไม่ได้ | ทาโรต์: ก่อนเริ่ม (onboarding 3 ขั้น, อีเมล/LINE) | ฟรี / ลูกดวง ฿99/เดือน, ฿699/ปี, ทดลองฟรี 7 วัน | ม่วงเข้ม-เหลือง |

**ตัดออกเพราะไม่ใช่ปี 2026** (ตรวจโดเมนแล้ว): Aistro (ไม่มีวันที่บน Product Hunt, มี 532 followers ดูเป็นของเก่า), aistro.ai 2025-07, nummi.ai 2024-10, astroo.ai 2025-06, jenova.ai 2019, astronidan.com 2019, astrogpt.ai 2023, tarotap.com 2023, tarotoo.com 2022, chatarot.ai 2024-12, tarotqa.com 2025-01, tarotreadingapp.com 2025-10, divinewhisperapp.com 2024, horoworld.com 2008

---

## 3. รายละเอียดรายเว็บ

### 3.1 THAKSA — thaksa.ai ✅ 2026
- **ยืนยัน**: RDAP `.ai` registration 2026-04-26T10:28Z, registrant country TH, Cloudflare registrar; title หน้าเว็บ "ดูดวง 2569 ฟรี"
- **สไตล์ภาพ**: พื้นดำ ลายเส้นกลุ่มดาว (constellation lines + จุดเรืองแสง) ตัวหัวเรื่อง serif ไทยสีทองตัวเอียง ("ไพ่ทาโรต์วันนี้") + ซับไตเติลอังกฤษตัวเล็ก spaced caps ("YOUR DAILY TAROT") หลังไพ่ออกแบบเอง (นกฟีนิกซ์ทอง-แดง) หน้าไพ่ Rider–Waite วาดใหม่โทนทอง ให้ความรู้สึกหรูหรามาก มีปุ่มสลับภาษา TH|EN
- **หน้าแรก (IA)**: ช่องพิมพ์ใหญ่ "เรื่องไหนกำลังค้างอยู่ในใจคุณตอนนี้?" + ชิปเลือกหัวข้อ (ความรัก / งาน/เงิน / สอบ/เรียน / เช็คเบอร์ / ดวงวันนี้ / ไพ่วันนี้) → แนะนำ "อาจารย์ที่เหมาะกับเรื่องความรัก" (การ์ดอาจารย์: รูป, ประสบการณ์, เรตติ้ง, "ตอบเฉลี่ย ~5m", ถามละเอียด ฿99 / ถามด่วน ฿49) คอลัมน์ขวาเป็นวิดเจ็ตรายวัน (ไพ่ประจำวัน 7 วัน, เซียมซีวันนี้ "เขย่า", เช็คเบอร์ฟรี, กราฟชีวิต, รับดวงใน LINE) และ "เครื่องมือทั้งหมด (19)" — **ใช้เจตนาของผู้ใช้เป็นตัวนำทาง (intent-first) แทนการเรียงเมนูตามประเภทศาสตร์**
- **flow ไพ่**: เลือกหัวข้อ (ทั่วไป/ความรัก/การงาน/การเงิน) + ช่องคำอธิษฐาน (ไม่บังคับ) → ไพ่ 8 ใบกางเป็นพัด (fan) → แตะ 1 ใบ → ป็อปอัป "ระบุวันเกิดเพื่อปลดล็อกบทวิเคราะห์เจาะลึก · ใช้เวลา 3 วินาที" (กดข้ามได้) → ไพ่หงายใหญ่กลางจอ + "ข้อความวันนี้" (ความหมาย + โฟกัสวันนี้)
- **หน้าผล**: ข้อความฟรีสั้น → "ไพ่ประจำวัน 7 วัน" (ชวนล็อกอินเพื่อบันทึกต่อเนื่อง) → กล่อง "ไพ่ตอบตามตำรา — ให้อาจารย์ดูจากดวงจริงของคุณ" ปุ่ม "ถามอาจารย์ต่อ ฿49 ✓ ไม่ชัดถามต่อฟรี 1 ครั้ง" → **DEEPER READING** 3 การ์ดเบลอมีกุญแจ: (1) ไพ่ใบนี้พูดกับวันเกิดคุณ (ใส่วันเกิดเพื่อปลดล็อก) (2) สัญญาณช่วง ก.ย.–ธ.ค. (เข้าสู่ระบบ) (3) อ่านเพิ่มกับอาจารย์ (ปรึกษาอาจารย์ →) → บทความ SEO ยาว + ลิงก์เครื่องมือที่เกี่ยวข้อง (ดวงรายวัน 12 ราศี, เซียมซี 28 ใบ, วิเคราะห์เบอร์, ฤกษ์, ทำนายฝัน)
- **ล็อกอิน**: เบอร์โทร + OTP พร้อม checkbox ยินยอม PDPA ไม่มี LINE/Google ในหน้า signin (แต่มี "รับไพ่ใน LINE")
- **จุดเด่นที่ควรลอก**: บันไดปลดล็อก 3 ขั้น (วันเกิด → ล็อกอิน → จ่าย) บนหน้าผลเดียว, เจาะจงช่วงเวลา ("ก.ย.–ธ.ค.") ให้ความรู้สึกเฉพาะตัว, ไพ่ประจำวัน 7 วันเป็น retention, คำว่า "ถามต่อฟรี 1 ครั้ง" ลดความเสี่ยงในการจ่าย
- **จุดอ่อน**: ข้อความเก็บคำอธิษฐาน ("จะถูกเก็บไว้เพื่อให้อาจารย์…") อาจทำให้กังวลเรื่องความเป็นส่วนตัว, ผลฟรีสั้นมากและเป็นแบบ template, คุกกี้แบนเนอร์ไม่มีปุ่มปฏิเสธชัดเจน (มีแค่ ตั้งค่า / ยอมรับทั้งหมด)
- **ภาพหน้าจอ**
  - [screens/thaksa/01-landing-desktop.jpg](screens/thaksa/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า): ช่อง "เรื่องไหนค้างใจ" + ชิปหัวข้อ + การ์ดอาจารย์ ฿99/฿49
  - [screens/thaksa/02-landing-mobile.jpg](screens/thaksa/02-landing-mobile.jpg) — หน้าแรกมือถือ พร้อม bottom nav 4 แท็บ (หน้าแรก/ดูดวง/ถามอาจารย์/ดวงของฉัน)
  - [screens/thaksa/03-topic-form-mobile.jpg](screens/thaksa/03-topic-form-mobile.jpg) — หน้าไพ่วันนี้: ชิปหัวข้อ + ช่องคำอธิษฐาน (ไม่บังคับ)
  - [screens/thaksa/04-card-spread-mobile.jpg](screens/thaksa/04-card-spread-mobile.jpg) — ไพ่ 8 ใบ หลังไพ่ฟีนิกซ์ ใบที่เลือกยกขึ้นมีแสง
  - [screens/thaksa/05-card-revealed-mobile.jpg](screens/thaksa/05-card-revealed-mobile.jpg) — ไพ่หงายเต็มจอ ชื่อไทยตัวใหญ่ + ชื่ออังกฤษ (ไม่มีสถานะโหลด เพราะผลฟรีเป็น deterministic)
  - [screens/thaksa/06-result-free-mobile.jpg](screens/thaksa/06-result-free-mobile.jpg) — "ข้อความวันนี้" ผลฟรี
  - [screens/thaksa/06b-result-share-mobile.jpg](screens/thaksa/06b-result-share-mobile.jpg) — ปุ่มแชร์ + "ส่งไป LINE" + นับถอยหลัง "กลับมาเปิดไพ่ใหม่พรุ่งนี้"
  - [screens/thaksa/06c-result-locked-deeper-mobile.jpg](screens/thaksa/06c-result-locked-deeper-mobile.jpg) — DEEPER READING การ์ดเบลอ + กุญแจ (ใส่วันเกิด / เข้าสู่ระบบ)
  - [screens/thaksa/07-paywall-ask-master-mobile.jpg](screens/thaksa/07-paywall-ask-master-mobile.jpg) — หน้าถามอาจารย์: "ว่างตอนนี้" ฿99/15 นาที + ชิปคำถามสำเร็จรูป
  - [screens/thaksa/08-login-mobile.jpg](screens/thaksa/08-login-mobile.jpg) — ล็อกอินเบอร์โทร + OTP (ไม่ได้กดส่ง)
  - [screens/thaksa/09-standout-birthdate-unlock-modal-mobile.jpg](screens/thaksa/09-standout-birthdate-unlock-modal-mobile.jpg) — ⭐ ปลดล็อกด้วยวันเกิดแบบ inline ในการ์ด ไม่ต้องสมัคร

### 3.2 MuCraft — mucraft.in.th ✅ 2026
- **ยืนยัน**: THNIC WHOIS Created 25 Apr 2026; หน้าแรกมีป้าย "เปิดตัวเวอร์ชันทดลอง"; บทความในบล็อกเขียนถึงตัวเองว่า "ใหม่ในตลาด" (26 เม.ย. 2569)
- **สไตล์ภาพ**: ดำด้าน หัวเรื่องไทยตัวใหญ่มาก ("ดวงของคุณ คำนวณได้แล้ว") ไล่เฉดเทา-ขาว ปุ่ม CTA ทองทรงแคปซูล มี ticker แถบศาสตร์เลื่อนวน (โหราศาสตร์ไทย · ปาจี้ · มหาทักษา · มี่นเซียง · ลายมือ · เลขมหาโชติ · 12 เรือนชะตา · AI เทวดา) โทนเหมือน fintech/"หอบัญชาการ" มากกว่าหมอดู
- **IA**: hero → ฟอร์ม "ลองคำนวณก่อนสมัคร" (วันเกิดช่องเดียว) → 4 สาย (ไทย / จีน / มงคล / ตัวเลข) → ชั้นยืนยันทางกายภาพ (สแกนหน้า 486 จุด + ลายมือ, "ประมวลผลในเบราว์เซอร์") → pricing → FAQ → บทความ
- **flow**: ใส่วันเกิด → การ์ดผลทันที "หลักวันของคุณ **Yang Fire**" พร้อมไอคอนวงธาตุ 5 จุด + คำอธิบาย 2 บรรทัด + ลิงก์ "ดูดวง 12 เรือนแบบเต็ม →" + หมายเหตุ "ตัวอย่างจากวันเกิดเท่านั้น • ดวงเต็มต้องใช้เวลาและสถานที่เกิด • คำนวณในเบราว์เซอร์ของคุณ" → กดดูเต็ม → หน้าล็อกอิน
- **ล็อกอิน**: "ลงชื่อเข้าใช้เพื่อดำเนินการต่อ" — **LINE (ปุ่มเขียวใหญ่ บนสุด)** / Google / เบอร์โทร +66 OTP; เป็น PWA พร้อม toast "ติดตั้ง MuCraft"
- **ราคา**: ทดลอง ฿0 (ดวงย่อยรายวัน 1 ครั้ง, คำถามโอราเคิล 3 ข้อ/เดือน) · ฤกษ์ ฿59/ครั้ง · ตรีมูรติ ฿299/เดือน หรือ ฿2,490/ปี · ปรมาจารย์ ฿2,999/ปี; จ่ายผ่าน Stripe / PromptPay / TrueMoney; แถบความเชื่อมั่น "จ่ายครั้งเดียว ไม่มีรายเดือนแอบเก็บ · คืนเงิน 7 วัน · ไม่บังคับสแกน"
- **จุดเด่น**: time-to-value ภายใน 1 ช่องกรอก, บอกตรงๆ ว่าอะไรคือ "ตัวอย่าง" vs "ดวงเต็ม", FAQ บอกว่า "ระบบจะแจ้งระดับความน่าเชื่อถือของทุกการอ่าน" (ตรงกับ trust panel ของเรา), PromptPay/TrueMoney
- **จุดอ่อน**: คำศัพท์เยอะ/เทคนิค (เมทริกซ์, ออร่า +12, API export), ฟีเจอร์สแกนหน้า/ลายมือยังเป็น stub ตามบล็อกของตัวเอง, contrast หัวเรื่องเทาบนดำค่อนข้างต่ำ
- **ภาพหน้าจอ**
  - [screens/mucraft/01-landing-desktop.jpg](screens/mucraft/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า): hero ตัวใหญ่ → 4 สาย → biometric → pricing → FAQ
  - [screens/mucraft/02-landing-mobile.jpg](screens/mucraft/02-landing-mobile.jpg) — หน้าแรกมือถือ
  - [screens/mucraft/03-input-birthdate-mobile.jpg](screens/mucraft/03-input-birthdate-mobile.jpg) — ฟอร์ม "ลองคำนวณก่อนสมัคร" ช่องเดียว + แถบ PDPA/ประมวลผลในอุปกรณ์
  - [screens/mucraft/06-result-free-teaser-mobile.jpg](screens/mucraft/06-result-free-teaser-mobile.jpg) — ผลทันที "Yang Fire" + วงธาตุ + หมายเหตุ "ตัวอย่างจากวันเกิดเท่านั้น" (วันเกิดปลอม 01/01/1990)
  - [screens/mucraft/07-pricing-mobile.jpg](screens/mucraft/07-pricing-mobile.jpg) — ราคาแบบมือถือ
  - [screens/mucraft/07b-pricing-desktop.jpg](screens/mucraft/07b-pricing-desktop.jpg) — 4 แผน ฿0/฿59/฿299/฿2,999 + แถบ "จ่ายครั้งเดียว · คืนเงิน 7 วัน · ไม่บังคับสแกน"
  - [screens/mucraft/08-login-line-first-mobile.jpg](screens/mucraft/08-login-line-first-mobile.jpg) — ล็อกอิน: LINE ปุ่มเขียวบนสุด / Google / เบอร์โทร OTP (ไม่ได้กดส่ง)
  - [screens/mucraft/09-standout-privacy-biometric-mobile.jpg](screens/mucraft/09-standout-privacy-biometric-mobile.jpg) — ⭐ การ์ดความเป็นส่วนตัว "ไม่มีภาพ ไม่มีการรั่วไหล" (AES-256, ลบใน 72 ชม.)
  - ไม่มีจังหวะเลือกไพ่/สถานะโหลด (ผลตัวอย่างคำนวณในเบราว์เซอร์ทันที)

### 3.3 Starot — starot.ai ✅ 2026 (pre-launch)
- **ยืนยัน**: RDAP registration 2026-04-29; hero "NORTH AMERICA EARLY ACCESS · COMING Q2 2026"
- **สไตล์**: ดำ ฟอนต์ sans ตัวหนาใหญ่ mockup มือถือ "Planet Space" ตัวอย่าง UI ดาวเคราะห์โคจร วางตัวเป็น "digital sanctuary, not another noisy horoscope feed" (โทนสงบ ใช้กลางดึก)
- **flow ที่ลองได้**: 4 วิดเจ็ตฟรีบนหน้าแรก — Daily Tarot (แตะไพ่ → The Star · "Healing · hope · renewal" + ประโยคสั้น + "Use it as a reflection prompt, not a prediction"), Birth Insight (วันเกิด + Focus today dropdown), Compatibility (2 ราศี → ข้อความสั้น), Moon Pulse (ข้างขึ้นข้างแรม + คำแนะนำ) — ผลขึ้นทันทีในการ์ด ไม่เปลี่ยนหน้า
- **รายได้/ล็อกอิน**: ยังไม่มี มีแค่ Join waitlist
- **จุดเด่น**: ทำ widget ฟรีแบบ in-place เป็น SEO/onboarding, ภาษาดูแลใจ (emotional check-in) แทนคำทำนาย
- **จุดอ่อน**: ยังไม่มีสินค้าจริง, ผลลัพธ์ตื้น
- **ภาพหน้าจอ** (waitlist เท่านั้น — ไม่มีหน้าราคา)
  - [screens/starot/01-landing-desktop.jpg](screens/starot/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า, บีบ JPEG เหลือ quality 28 เพื่อให้ไม่เกิน 400 KB)
  - [screens/starot/02-landing-mobile.jpg](screens/starot/02-landing-mobile.jpg) — หน้าแรกมือถือ
  - [screens/starot/09-standout-free-widgets-desktop.jpg](screens/starot/09-standout-free-widgets-desktop.jpg) — ⭐ 4 วิดเจ็ตฟรี "try before the app launches" (Daily Tarot / Birth Insight / Compatibility / Moon Pulse)

### 3.4 Raka — rakatarot.com ✅ 2026 (แอป, เว็บเป็น marketing)
- **ยืนยัน**: RDAP registration 2026-06-21; footer "© 2026 Vyve Health Tech"
- **สไตล์**: พื้นครีมสว่าง หัวเรื่อง serif "Your AI for the *inner life*." (ตัวเอียงม่วง) orb ม่วงกลาง + ชิปลอย ("The Star · upright", "Scorpio · Sun", "7-day streak") — ต่างจากคู่แข่งที่ทำธีมมืด
- **IA/เนื้อหา**: Daily tarot, natal chart จากแบบสอบถาม 30 วินาที, Deep conversations, 5 Premium Spreads, **4 Teacher Personas** (Maeve, Solomon, Iris, Atlas), คอร์สเรียนไพ่ 90 บทเรียน (ฟรี 3 บทแรกทุกโมดูล), "Raka remembers" ต่อยอดประวัติการอ่าน
- **รายได้**: Free + Mastery $9.99/เดือน หรือ $79.99/ปี (รายปีได้ Certificate, personas, **แชร์ผลไป Instagram/WhatsApp**, "Year Wrapped")
- **flow การอ่าน**: อยู่ในแอป iOS/Android — ไม่ได้ทดสอบบนเว็บ
- **จุดเด่น**: การสอน (course) เป็นตัวขาย subscription, Year Wrapped/แชร์เป็นฟีเจอร์ premium, ข้อความ disclaimer ชัด ("self-reflection and education only")
- **จุดอ่อน**: เว็บไม่มีการอ่านจริงให้ลอง ต้องโหลดแอปก่อน
- **ภาพหน้าจอ** (marketing เท่านั้น)
  - [screens/raka/01-landing-desktop.jpg](screens/raka/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า) ธีมครีม-ม่วง
  - [screens/raka/02-landing-mobile.jpg](screens/raka/02-landing-mobile.jpg) — หน้าแรกมือถือ
  - [screens/raka/07-pricing-desktop.jpg](screens/raka/07-pricing-desktop.jpg) — Mastery $9.99/เดือน vs $79.99/ปี (รายปีได้แชร์ IG/WhatsApp + Year Wrapped)

### 3.5 AkashicStone "Eye of Fate" — akashicstone.com ✅ 2026
- **ยืนยัน**: RDAP registration 2026-04-04
- **สไตล์**: ส่วน hero พื้นดำมีตัวอักษรรูนลอย ไพ่ Rider–Waite ลอยเรียงบนหัว ตัว serif ทองตัวใหญ่ spaced ("DRAW YOUR FATE") ส่วนหัวเว็บเป็นร้านค้าสีขาวเต็มรูปแบบ (ขัดกับอารมณ์)
- **flow**: พิมพ์คำถาม (บังคับ) → "Begin Your Free Reading" → เด็คกลางจอเรืองทอง "Tap the deck to reveal **3** cards" (ตัวนับ) → แตะ 3 ครั้ง ไพ่ลงช่อง Past/Present/Future ทีละใบ (มีป้าย Upright/Reversed) → ข้อความ AI ยาว แบ่งหัวข้อ: สรุป 1 ย่อหน้า → Past: The Hidden Roots → Present: The Current Truth → Future: The Path Unfolding → **Oracle: Final Wisdom** → "New Reading · Return"
- **ช่วงโหลด**: ไม่มีสถานะโหลดชัดเจน ช่องไพ่ว่าง (1/2/3) ค้างอยู่ ~5–10 วินาทีก่อนผลขึ้น
- **รายได้**: ฟรีไม่จำกัด ไม่เก็บข้อมูล → ขายไพ่/คริสตัล/จี้ ("Featured Spiritual Jewelry", "Explore Sacred Tools")
- **จุดเด่น**: ไม่มี friction เลย, การแตะเด็คทีละใบ + ตัวนับ ทำให้ผู้ใช้มีส่วนร่วม, หัวข้อผลลัพธ์ตั้งชื่อเชิงกวี
- **จุดอ่อน**: ไม่มี share/save, ไม่มี disclaimer ในหน้าผล, header ร้านค้าทำลายบรรยากาศ
- **ภาพหน้าจอ**: ไม่มี — เมื่อเปิดผ่าน Chrome DevTools CLI ร้าน Shopify นี้ขึ้นหน้า "访问被拒绝 / Bot detected (AT): webdriver" (แอป X Shield) จึงข้ามไป ไม่ได้พยายามหลบระบบกันบอท คำอธิบายข้างบนมาจากการเปิดด้วย Claude in Chrome รอบแรก

### 3.6 AI Tarot — aitarot.pro ✅ 2026 (ตามโดเมน)
- **ยืนยัน**: RDAP registration 2026-03-18 (footer ยังเขียน © 2025 — น่าจะเป็น template)
- **สไตล์**: ม่วงเข้ม-ทอง serif, ไพ่ลอยเบลอพื้นหลัง, มีปุ่มสลับธีมสว่าง/มืด และปุ่มภาษา
- **IA**: เมนู Tarot ▾ / Card Library / Horoscope / Compatibility / Chat / Pricing; หน้าแรกแบ่ง reading เป็นกลุ่ม: Core (General, Yes/No, Celtic Cross) · Love (Their Feelings, Relationship Insight, Love Future, Reconciliation) · Fortune & timing (Daily/Monthly/Seasonal/Year Ahead/Yearly) · Decisions (Options) — **ตั้งชื่อตามคำถามของผู้ใช้ ไม่ใช่ชื่อ spread**
- **flow**: หน้า General → เลือก spread (Single / Three ฟรี; Five/Seven/Celtic มีกุญแจ) → ช่องคำถาม + ชิปตัวอย่างคำถาม ("What should I focus on next?") → **Choose your reader** (Selene Noir · CHANGE READER) → "Draw your cards" — การอ่าน AI ต้องล็อกอิน (ฟรี 1 ครั้งต่อบัญชี ไม่รีเซ็ต) ส่วนเครื่องมือ Draw Cards / Oracle / Birth Card ใช้ได้ไม่ต้องล็อกอิน; ผลแบบ stream ("Watch the interpretation arrive in a stream") และพลิกไพ่ 3D (ตามคำอธิบายหน้าเว็บ)
- **รายได้**: Free (tarot 1 ครั้ง/บัญชี, chat 2 ข้อความ) → Plus $5.99–9.99 → Pro $11.99–19.99; ตาราง "Compare plans" ระบุว่า "limits come from the same rules enforced by the app"
- **จุดเด่น**: ชิปคำถามตัวอย่างแก้ปัญหา "ไม่รู้จะถามอะไร", ตั้งชื่อ scenario ตามอารมณ์ ("Their Feelings", "Reconciliation"), ความโปร่งใสของโควต้า
- **จุดอ่อน**: ฟรีแค่ 1 ครั้งตลอดชีพ + ต้องล็อกอินก่อน — ประตูแคบ, ปุ่ม Draw ถูกปิดโดยไม่มีคำอธิบายว่าทำไม (ผู้ใช้ที่ยังไม่ล็อกอินจะงง)
- **อัปเดตจากรอบถ่ายภาพ**: รอบนี้กด "Draw your cards" ได้โดยไม่ต้องล็อกอิน → เข้า "Immersive card ritual" (เลือก 3 จาก 30 ใบ, ตัวนับ "0 OF 3 SELECTED") → คว่ำ 3 ใบ Past/Present/Future "Click a card to reveal it" → พลิกทีละใบ → ได้ preview 2 ใบเป็น "BASIC MEANING" ใบที่ 3 ล็อก + ข้อความ "The AI preview is temporarily unavailable, so the cards above show their basic meanings" (= fallback) → ปุ่ม "Sign in to unlock the full reading" → bottom sheet "Your cards are ready… same cards, same orientations, never a redraw"
- **ภาพหน้าจอ**
  - [screens/aitarot/01-landing-desktop.jpg](screens/aitarot/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า): reading แบ่งกลุ่มตามคำถาม + ตารางราคา
  - [screens/aitarot/02-landing-mobile.jpg](screens/aitarot/02-landing-mobile.jpg) — หน้าแรกมือถือ
  - [screens/aitarot/03-question-chips-mobile.jpg](screens/aitarot/03-question-chips-mobile.jpg) — เลือก spread (บางแบบมีกุญแจ) + ช่องคำถาม + ชิปคำถามตัวอย่าง
  - [screens/aitarot/04-card-ritual-spread-mobile.jpg](screens/aitarot/04-card-ritual-spread-mobile.jpg) — ritual เต็มจอ: เลือก 3 จาก 30 ใบ + ตัวนับ
  - [screens/aitarot/04c-card-ritual-3picked-mobile.jpg](screens/aitarot/04c-card-ritual-3picked-mobile.jpg) — 3 ใบคว่ำ Past/Present/Future "Destiny awaits"
  - [screens/aitarot/04d-reveal-prompt-mobile.jpg](screens/aitarot/04d-reveal-prompt-mobile.jpg) — ขั้น "Click a card to reveal it"
  - [screens/aitarot/04e-card-flip-mobile.jpg](screens/aitarot/04e-card-flip-mobile.jpg) — ระหว่างพลิกไพ่ใบแรก
  - [screens/aitarot/05-after-reveal-mobile.jpg](screens/aitarot/05-after-reveal-mobile.jpg) — หลังเปิดครบ (ไม่มีสถานะโหลด AI ให้เห็น เพราะ preview ล่มและ fallback ทันที)
  - [screens/aitarot/06-result-preview-fallback-mobile.jpg](screens/aitarot/06-result-preview-fallback-mobile.jpg) — ผล preview: ป้าย "BASIC MEANING" + ใบที่ 3 ล็อกแบบเส้นประ + ข้อความแจ้ง AI ใช้ไม่ได้
  - [screens/aitarot/06b-result-unlock-gate-mobile.jpg](screens/aitarot/06b-result-unlock-gate-mobile.jpg) — "Unlock your reading — they stay exactly as drawn"
  - [screens/aitarot/07-pricing-mobile.jpg](screens/aitarot/07-pricing-mobile.jpg) — หน้าราคามือถือ
  - [screens/aitarot/07b-pricing-desktop.jpg](screens/aitarot/07b-pricing-desktop.jpg) — Free / Plus / Pro + สลับรายเดือน-รายปี
  - [screens/aitarot/08-login-prompt-mobile.jpg](screens/aitarot/08-login-prompt-mobile.jpg) — bottom sheet สมัคร: Google / อีเมล (ไม่ได้กรอก/ส่ง)
  - [screens/aitarot/09-standout-choose-reader-mobile.jpg](screens/aitarot/09-standout-choose-reader-mobile.jpg) — ⭐ เลือกผู้อ่าน (persona) ก่อนจั่ว

### 3.7 AstroNeko — astroneko.com ⚠️ เว็บเปิดปี 2025 (ส่วนที่ใหม่ปี 2026 คือตู้และร้าน)
- **หลักฐาน**: จดโดเมน 2025-07-03; ข่าวเปิดตัวไทยรัฐลงวันที่ 21 ต.ค. 2568 → **เว็บไม่ได้เปิดตัวปี 2026**; ส่วนที่ใหม่ปี 2026 คือ "ตู้ดูดวง AI" ที่ The Empire และงาน MONEY FEST 2026 (Siam Blockchain 9 ก.ย. 2026) ใส่ไว้เพราะเป็นคู่แข่งไทยโดยตรงที่ใช้ AI
- **สไตล์**: แดงเข้ม-ทอง ภาพวาดดิจิทัลเต็มจอ (แมวขาวอ้วนใส่จีวรส้ม ยืนหน้าโทริอิ ใบไม้แดง) **มาสคอตเป็นตัวละครที่พูดคำว่า "ข้า/ท่าน"** — ใช้ persona เป็นแบรนด์
- **flow**: "เริ่มใช้งาน" → "คุณกำลังมองหาอะไร?" 3 ตัวเลือก (ทั่วไป / กราฟวันเกิด 🔒 "ปลดล็อกด้วยการซื้อครั้งเดียว 589฿" / ไพ่ทาโร่ [ใหม่]) → **ทุกตัวเลือกเด้งโมดัลล็อกอินทันที** (Google / LINE / อีเมล+รหัสผ่าน)
- **ร้าน (mu.astroneko.com)**: 43 รายการ — ปลดล็อกผลไพ่ 3 ใบ ฿39, ไพ่ปาจื่อ ฿99, เซียมซีความรัก ฿69, ปาจื่อ×MBTI ฿237, ทักษาความรัก ฿289, วอลเปเปอร์เจิมแล้ว ฿299, ทองคำแท่งลายไพ่ ฿825, รายงาน+ดูดวงออนไซต์ ฿6,444, คอร์สไพ่
- **จุดเด่น**: ราคาปลดล็อกรายครั้งต่ำมาก, วอลเปเปอร์มงคลเป็นสินค้าดิจิทัล (ตรงกับ AI wallpaper ของเรา), มาสคอตจดจำง่าย, ขยายสู่ offline (ตู้)
- **จุดอ่อน**: บังคับล็อกอินก่อนเห็นคุณค่า, ข้อความ disclaimer ตัวเล็กมากท้ายจอ
- **อัปเดตจากรอบถ่ายภาพ**: mu.astroneko.com เปลี่ยนเป็นหน้า hub ธีมสว่าง "รู้ดวง เสริมดวง ครบในที่เดียว" ปุ่ม "ดูดวงฟรี — ไม่ต้องสมัครสมาชิก" + ตัวนับสด (ผู้เข้าชม / จำนวนครั้งที่ดูดวง) + รีวิวเป็นภาพแชท LINE + ร้านรายงาน (เช่น BAZI Bundle ฿1,688, ทักษาความรัก ฿777) — แบนเนอร์ PDPA มีแค่ปุ่ม "ยอมรับ" (ไม่ได้กด)
- **ภาพหน้าจอ**
  - [screens/astroneko/01-landing-desktop.jpg](screens/astroneko/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป: ภาพแมวมาสคอตเต็มจอ (ปฏิเสธคุกกี้ไม่จำเป็นแล้ว)
  - [screens/astroneko/02-landing-mobile.jpg](screens/astroneko/02-landing-mobile.jpg) — หน้าแรกมือถือ
  - [screens/astroneko/03-choose-path-mobile.jpg](screens/astroneko/03-choose-path-mobile.jpg) — "คุณกำลังมองหาอะไร?" แชท / กราฟวันเกิด (589฿) / ไพ่ทาโร่
  - [screens/astroneko/07-pricing-products-mobile.jpg](screens/astroneko/07-pricing-products-mobile.jpg) — การ์ดรายงานพร้อมราคาขีดฆ่า + % ส่วนลด
  - [screens/astroneko/08-login-gate-mobile.jpg](screens/astroneko/08-login-gate-mobile.jpg) — กดไพ่ทาโร่แล้วเด้ง bottom sheet ล็อกอินทันที (Google / LINE / อีเมล)
  - [screens/astroneko/09-standout-mu-hub-live-counter-mobile.jpg](screens/astroneko/09-standout-mu-hub-live-counter-mobile.jpg) — ⭐ ตัวนับสด "93,159 ผู้เข้าชม / 350,117 ครั้งที่ดูดวง" + "ไม่ต้องสมัครสมาชิก"
  - [screens/astroneko/09b-standout-line-chat-reviews-mobile.jpg](screens/astroneko/09b-standout-line-chat-reviews-mobile.jpg) — ⭐ รีวิวเป็นภาพแชท LINE จริง (social proof แบบไทย)

### 3.8 Horachat — horachat.com ⚠️ ยืนยันปี 2026 ไม่ได้
- **หลักฐาน**: จดโดเมน 2025-12-24, footer "© 2025" → น่าจะเปิดปลาย 2025 หรือต้น 2026 ยืนยันไม่ได้
- **สไตล์**: ม่วงเข้ม ไอคอนดอกบัวทอง ปุ่มเหลือง, ตัวอย่าง UI แชทบนหน้าแรก
- **IA/flow**: hero เป็นฟอร์ม "ผูกลัคนาเพื่อรับคำทำนาย" (วัน/เดือน/**ปี พ.ศ.** dropdown, เวลาเกิดและสถานที่ "ไม่บังคับ") → "คุยกับ AI โหราจารย์ เหมือนมีโหรส่วนตัว" → เลือกหมอดู 2 เพอร์โซนา (อาจารย์เทพ — โหราศาสตร์ไทย, แม่หมออลิสา — ไพ่ทาโรต์) → ตารางเปรียบเทียบ Horachat vs เว็บดูดวงทั่วไป vs แชท AI ทั่วไป; ปุ่มทาโรต์ในเมนูพาไป onboarding 3 ขั้น (ชื่อ/อีเมล/รหัสผ่าน หรือ LINE)
- **รายได้**: ฟรีตลอดไป (ปฏิทินดวงรายวัน เกรดรวม + สีมงคล + เลขมงคล, แชทกับ 2 หมอดู, **แชร์ผลให้เพื่อน**) / ลูกดวง ฿99/เดือน, ฿699/ปี ("เฉลี่ยเดือนละ ฿58 — ถูกกว่ากาแฟแก้วเดียว") + ทดลองฟรี 7 วันไม่ต้องผูกบัตร
- **จุดเด่น**: **ปฏิทินดวง** (วัน/สัปดาห์/เดือน + "ย้อนดูเพื่อทดสอบความแม่นยำในอดีต"), ความจำข้ามแชทเป็นฟีเจอร์พรีเมียม, เปรียบเทียบกับ "แชท AI ทั่วไป" ตรงๆ, ปี พ.ศ. ใน dropdown
- **จุดอ่อน**: ทาโรต์บังคับสมัครก่อน, คุกกี้แบนเนอร์บังหน้าจอ
- **อัปเดตจากรอบถ่ายภาพ**: ฟอร์มผูกลัคนาบนหน้าแรกใช้ได้โดยไม่ต้องล็อกอิน (ทดสอบด้วยวันเกิดปลอม 1 ม.ค. 2533) → **ส่วน deterministic ขึ้นทันที** ("ท่านผูกดวงแล้ว อยู่ในลัคนาราศี: ธนู · ธาตุ: ไฟ · สีมงคล · เลขมงคล") พร้อมจุด 3 จุด (typing) ระหว่าง AI เขียน → ข้อความ AI 2 ย่อหน้าแบบแชท → ชิป 8 หัวข้อ (ดวงความรัก/การงาน/การเงิน/…/สิ่งที่ต้องระวัง) + ช่องพิมพ์ถามต่อ "กดส่ง = เริ่มแชทกับอาจารย์เทพ · สมัครฟรี · ไม่ต้องผูกบัตร"
- **ภาพหน้าจอ**
  - [screens/horachat/01-landing-desktop.jpg](screens/horachat/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า, ปฏิเสธคุกกี้แล้ว)
  - [screens/horachat/02-landing-mobile.jpg](screens/horachat/02-landing-mobile.jpg) — หน้าแรกมือถือ: ฟอร์มผูกลัคนาเป็น hero
  - [screens/horachat/03-birth-form-filled-mobile.jpg](screens/horachat/03-birth-form-filled-mobile.jpg) — ฟอร์มวัน/เดือน/ปี พ.ศ. (ข้อมูลปลอม)
  - [screens/horachat/05-loading-deterministic-first-mobile.jpg](screens/horachat/05-loading-deterministic-first-mobile.jpg) — ⭐ สถานะโหลด: ข้อมูลดวงที่คำนวณได้ขึ้นก่อน + จุด typing รอ AI
  - [screens/horachat/06-result-mobile.jpg](screens/horachat/06-result-mobile.jpg) — ผล AI แบบแชท + ชิปหัวข้อ + ช่องถามต่อ (CTA สมัคร)
  - [screens/horachat/07-pricing-mobile.jpg](screens/horachat/07-pricing-mobile.jpg) — หน้าลูกดวงมือถือ (ทดลองฟรี 7 วัน)
  - [screens/horachat/07b-pricing-desktop.jpg](screens/horachat/07b-pricing-desktop.jpg) — ฟรี / ฿99 ต่อเดือน / ฿699 ต่อปี
  - [screens/horachat/08-signup-gate-tarot-mobile.jpg](screens/horachat/08-signup-gate-tarot-mobile.jpg) — onboarding 3 ขั้นก่อนเข้าไพ่ทาโรต์ (ไม่ได้กรอก)

### 3.9 REFFORTUNE — reftirata.life (ของเรา)
- **เป้าหมายของเว็บนี้ (จากเจ้าของ)**: เป็นหน้าให้ลูกดวงเลือกไพ่เองได้สะดวก แทนการวิดีโอคอลให้หมอดูกางไพ่ให้เลือก หมอดูเป็นคนอ่านผล จึงตั้งใจไม่แสดงคำทำนายและไม่มี paywall ในเว็บ — ผลและ Paywall จึงไม่นับคะแนน
- **สำรวจเมื่อ**: 19 ก.ย. 2569 ด้วยวิธีเดียวกับคู่แข่ง (Chrome DevTools CLI, โปรไฟล์ isolated, ไม่ล็อกอิน) — อ่านไพ่ทาโรต์ 1 ครั้ง + เซียมซี 1 ครั้ง
- **สไตล์ภาพ**: พื้นขาว-ม่วงอ่อน การ์ดโค้งมนสีพาสเทล โลโก้ดาวเคราะห์ทอง "REFFORTUNE #ดูดวงกับเรฟ" hero ม่วงไล่เฉด — สะอาดแต่คล้าย template ทั่วไป ไม่มีบรรยากาศ "มู" เท่าคู่แข่งธีมมืด; หน้าเลือกไพ่เป็นพื้นดำ และหน้าเซียมซีเป็นดำ-แดง ภาษาอังกฤษ "PROTOCOL / SACRED CHANCE" → **สามหน้าสามสไตล์ ไม่เป็นระบบเดียวกัน**; เดสก์ท็อปเป็นเลย์เอาต์มือถือยืดเต็มจอ 1440px ไม่มี max-width
- **IA**: หน้าแรก = hero "ค้นหาคำตอบที่คุณตามหา" + ปุ่มเริ่มดูดวง → ทางลัด (ไพ่ประจำวัน / การอ่านของฉัน / วอลเปเปอร์ AI / ดูดวงความรัก / ไพ่เลขมงคล) → "แพ็กเกจแนะนำ" 7 รายการ (บริการดูดวงกับคน ฿39–฿929) → bottom nav 5 แท็บ (หน้าแรก/สำรวจ/ดูดวง/บันทึก/ตั้งค่า); มีไอคอนเฟือง (ลิงก์ `/admin-config-panel`) ให้ผู้ใช้ทั่วไปเห็นบนหน้าแรก (หน้า admin เองกันไว้ "สำหรับผู้ดูแลระบบเท่านั้น")
- **flow ทาโรต์**: `/tarot` เลือกตาม**จำนวนใบ** (1/2/3/4/5/10) → `/tarot/pick` กำแพงไพ่ 78 ใบซ้อนกันแน่น 6 แถว + ปุ่ม "สับไพ่ใหม่" + ตัวนับ "เลือกไพ่ 0/3 ใบ" → ไพ่ที่เลือกกลายเป็นแถบม่วงมีเลข 1/2/3 → "ดูผลทำนาย" — **ไม่มีขั้นเลือกหัวข้อหรือพิมพ์คำถามเลย**, ไม่มีแอนิเมชันพลิกไพ่, ไม่มีสถานะโหลด (ผลขึ้นทันที ภาพไพ่ค่อยๆ โหลดทีละใบ)
- **หน้าผล**: หัวข้ออังกฤษ "Tarot result • 3 cards" + ภาพไพ่ 3 ใบชื่ออังกฤษ → การ์ดแชร์ (ไพ่ 3 ใบซ้ำอีกรอบ + "www.reffortune.com" + "แอดไลน์ @REFFORTUNE") → บันทึกรูป / แชร์ / "Save to Library" / "New Reading" — **ไม่มีคำทำนายหรือความหมายไพ่แสดงเลย** (โค้ดมีคอมเมนต์ `{/* Tarot AI interpretations hidden by config */}` ใน `src/app/tarot/result/ResultClient.tsx`) และ**ไม่มี trust panel** (summary / blocks / evidence-confidence) ตามที่ `SYSTEM_LEAP_BLUEPRINT.md` §4B กำหนด
- **เซียมซี**: หน้าดำ-แดง ปุ่มกลม "เริ่มเขย่า" → ติ้วลอยขึ้น "ใบที่ 28" → ข้อความ "ตอนนี้ระบบอ่านเซียมซีเชิงลึกยังไม่พร้อม น้อมรับคำทำนายหมายเลข 28 ไว้ก่อนนะคะ/ครับ" — API ตอบ `{"ok":true,"fallback":true,"reason":"missing_gemini_api_key"}` แปลว่า **production ไม่มี GEMINI_API_KEY** และ fallback ไม่แสดงคำทำนายพื้นฐานของใบที่ 28 เลย
- **ล็อกอิน**: `/login` มีปุ่มเดียว "เข้าสู่ระบบด้วย LINE" + ข้อความยินยอมข้อกำหนด (ไม่ได้กด) — ไม่มีจุดไหนใน flow ทาโรต์/เซียมซีชวนล็อกอิน
- **รายได้**: ไม่มี paywall หรือเครดิตในหน้าผลเลย; หน้าแรกขายบริการดูดวงกับคน (฿39/฿99 "ถึง 31 ม.ค." ซึ่ง**หมดอายุแล้ว** ณ วันที่สำรวจ, ฿389, ฿489, ฿929); `/pricing` เป็นรายการข้อความ (45 บาท/คำถาม, 3 คำถาม 125, 15 นาที 189…) ราคาไม่ตรงกับหน้าแรก และมีปุ่ม "เปิดหน้าแพ็กเกจ REFFORTUNE" ส่งออกไปที่อื่น — ไม่เห็นแพ็กเครดิตหรือการจ่ายเงินในเว็บ
- **จุดเด่น**: ครอบคลุมศาสตร์มาก (ทาโรต์ 6 แบบ, ไพ่ประจำวัน, ความรัก, เลขมงคล, เซียมซี, วอลเปเปอร์ AI), LINE login พร้อมแล้ว, bottom nav มือถือใช้ง่าย, การ์ดแชร์เป็นรูปพร้อม LINE OA, บันทึกลงคลังได้โดยไม่ต้องล็อกอิน, ตัวนับ "เลือกไพ่ x/3" ชัดเจน
- **จุดอ่อน**: หน้าผลไม่มีเนื้อหาคำทำนาย, AI ปิดใน production (ไม่มี key), ไม่มีคำถาม/หัวข้อก่อนเลือกไพ่, ไม่มี trust panel/disclaimer, ภาษาอังกฤษปนในจุดสำคัญ, โปรหมดอายุค้างบนหน้าแรก, ราคาสองหน้าไม่ตรงกัน, ปุ่มหน้าเลือกไพ่ล้นจอเมื่อเลือกครบ, ไพ่ไม่รองรับคีย์บอร์ด/screen reader
- **ภาพหน้าจอ**
  - [screens/reftirata/01-landing-desktop.jpg](screens/reftirata/01-landing-desktop.jpg) — หน้าแรกเดสก์ท็อป (เต็มหน้า): เลย์เอาต์มือถือยืดเต็ม 1440px + แพ็กเกจ 7 รายการ
  - [screens/reftirata/02-landing-mobile.jpg](screens/reftirata/02-landing-mobile.jpg) — หน้าแรกมือถือ: hero ม่วง + ทางลัด + bottom nav (มุมขวาบนมีเฟือง admin)
  - [screens/reftirata/03-tarot-topic-mobile.jpg](screens/reftirata/03-tarot-topic-mobile.jpg) — `/tarot` เลือกตามจำนวนใบ ไม่มีหัวข้อ/คำถาม
  - [screens/reftirata/04-card-pick-start-mobile.jpg](screens/reftirata/04-card-pick-start-mobile.jpg) — กำแพงไพ่ 78 ใบซ้อนแน่น "เลือกไพ่ 0/3 ใบ"
  - [screens/reftirata/04b-card-pick-1of3-mobile.jpg](screens/reftirata/04b-card-pick-1of3-mobile.jpg) — ระหว่างเลือก (หลังแตะใบแรก)
  - [screens/reftirata/04c-card-pick-3of3-mobile.jpg](screens/reftirata/04c-card-pick-3of3-mobile.jpg) — เลือกครบ 3 ใบ (แถบม่วง 1/2/3) — ปุ่ม "สับไพ่ใหม่" และ "ดูผลทำนาย" ล้นขอบจอ
  - [screens/reftirata/05-no-loading-image-pop-in-mobile.jpg](screens/reftirata/05-no-loading-image-pop-in-mobile.jpg) — ไม่มีสถานะโหลด: หน้าผลขึ้นทันทีแต่ภาพไพ่ใบแรกยังว่าง
  - [screens/reftirata/06-result-top-mobile.jpg](screens/reftirata/06-result-top-mobile.jpg) — หน้าผล: "Tarot result • 3 cards" ชื่อไพ่อังกฤษ ไม่มีคำทำนาย ไม่มี trust panel
  - [screens/reftirata/06b-result-share-card-mobile.jpg](screens/reftirata/06b-result-share-card-mobile.jpg) — การ์ดแชร์ + บันทึกรูป/แชร์/Save to Library/New Reading (โดเมนบนการ์ดเป็น www.reffortune.com)
  - [screens/reftirata/07-pricing-mobile.jpg](screens/reftirata/07-pricing-mobile.jpg) — `/pricing` รายการราคาแบบข้อความ + ลิงก์ออกไปหน้าแพ็กเกจภายนอก
  - [screens/reftirata/08-login-mobile.jpg](screens/reftirata/08-login-mobile.jpg) — `/login` ปุ่ม "เข้าสู่ระบบด้วย LINE" (ไม่ได้กด)
  - [screens/reftirata/09-standout-bad-expired-promo-mobile.jpg](screens/reftirata/09-standout-bad-expired-promo-mobile.jpg) — ⚠️ โปร ฿99 / ฿39 "ถึง 31 ม.ค." ยังแสดงบนหน้าแรกในเดือนกันยายน
  - [screens/reftirata/09b-daily-card-mobile.jpg](screens/reftirata/09b-daily-card-mobile.jpg) — ไพ่ประจำวัน "แตะเพื่อเปิด"
  - [screens/reftirata/10-esiimsi-input-mobile.jpg](screens/reftirata/10-esiimsi-input-mobile.jpg) — เซียมซี: กระบอกแดง 福 + ปุ่ม "เริ่มเขย่า" (หัวข้ออังกฤษ PROTOCOL / SACRED CHANCE)
  - [screens/reftirata/11-esiimsi-result-mobile.jpg](screens/reftirata/11-esiimsi-result-mobile.jpg) — ⚠️ ผลเซียมซีใบที่ 28 = ข้อความ "ระบบยังไม่พร้อม" แทนคำทำนาย (fallback เพราะไม่มี Gemini key)

---

## 4. ไอเดียสำหรับ REFFORTUNE (เรียงตาม impact / effort)

| อันดับ | ไอเดีย | อ้างอิง | Impact | Effort | จุดที่แตะในโค้ดเรา |
|---|---|---|---|---|---|
| 1 | **"Deeper reading" แบบการ์ดเบลอ + กุญแจ 3 ขั้นใต้ผลฟรี** — ปลดล็อกด้วย (ก) ใส่วันเกิด (ข) LINE login (ค) ใช้เครดิต; ส่วนผลฟรีเดิมจาก engine ยังแสดงเต็ม | THAKSA, MuCraft | สูง | ต่ำ–กลาง | result UI ใน `src/components/reading/`, `creditGate()`; บล็อก `cta` ที่มีอยู่แล้วใน `InterpretationBlock` |
| 2 | **ไม่บังคับล็อกอินก่อนเห็นคุณค่า** — คงการใช้งานแบบไม่ล็อกอินไว้ (ตอนนี้เราทำอยู่แล้ว) และให้ LINE login โผล่เฉพาะตอนจะ "บันทึก/อ่านลึก/ใช้เครดิต" ปุ่ม LINE เด่นสุด | MuCraft (ดี) vs AstroNeko/aitarot (แย่) | สูง | ต่ำ | LIFF/OAuth flow ที่มีอยู่ |
| 3 | **Micro-pack เครดิต ฿39–฿99 + "ถามต่อฟรี 1 ครั้ง"** และแสดงราคาเป็นบาทข้างปุ่มปลดล็อกโดยตรง; รองรับ PromptPay/TrueMoney | THAKSA, AstroNeko, MuCraft | สูง | กลาง | `/pricing`, `useConfigStore.packages`, `getCreditCost()` |
| 4 | **Intent-first home** — ช่อง "เรื่องไหนค้างใจอยู่?" + ชิป (ความรัก/งาน/เงิน/สอบ/เบอร์/ไพ่วันนี้) พาไปศาสตร์ที่เหมาะ แทนการเรียงเมนูตามชื่อศาสตร์ 10+ อย่าง | THAKSA, aitarot.pro | สูง | กลาง | หน้าแรก `src/app/page.tsx` |
| 5 | **Daily streak 7 วัน** สำหรับ daily card + เซียมซี + ส่งเตือนผ่าน LINE Messaging (เรามี `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN` แล้ว) | THAKSA, Raka, Horachat | สูง | กลาง | daily-card, `useHistoryStore`, CRM |
| 6 | **ชิปตัวอย่างคำถาม** ใต้ช่องคำถามทาโรต์/เซียมซี (Thai) เช่น "ช่วงนี้ควรโฟกัสเรื่องอะไร", "เขาคิดยังไงกับเรา" | aitarot.pro | กลาง | ต่ำ | ฟอร์มถามก่อน pick |
| 7 | **การ์ดผลทันทีจากช่องกรอกเดียว** บนหน้าแรก (เช่น วันเกิด → ธาตุ/ราศีจีน/เลขชีวิตจาก engine เรา) + ลิงก์ "ดูแบบเต็ม" | MuCraft, Starot | กลาง–สูง | ต่ำ | numerology / chinese-zodiac `baseline.ts` (deterministic อยู่แล้ว) |
| 8 | **เพอร์โซนาผู้อ่าน** (เช่น อาจารย์สายไทย vs แม่หมอไพ่) ที่เปลี่ยนแค่น้ำเสียงใน prompt ไม่เปลี่ยน engine | Horachat, aitarot.pro, Raka, AstroNeko | กลาง | กลาง | `src/lib/ai/templates/*`, `cultural/thai-context.ts` |
| 9 | **ปฏิทินดวงรายวัน/สัปดาห์** (เกรดรวม, สีมงคล, เลขมงคล) จาก natal chart + lucky numbers ที่เรามีอยู่ | Horachat | กลาง–สูง | กลาง–สูง | `src/lib/astrology/`, lucky-numbers |
| 10 | **ตัวนับการแตะเด็ค "แตะเพื่อเปิด 3 ใบ"** + ช่อง Past/Present/Future รอไพ่ และมี **สถานะโหลดชัดเจน** ระหว่างรอ Gemini (AkashicStone ไม่มี ผู้ใช้จึงงง) | AkashicStone | กลาง | ต่ำ | Tarot `PickClient.tsx` (เคารพ `prefers-reduced-motion`) |
| 11 | **ทำให้ trust panel เป็นจุดขาย** — ป้าย "ตัวอย่างจากวันเกิดเท่านั้น / ดวงเต็มต้องใช้เวลาเกิด", ระดับความเชื่อมั่น, PDPA, "ไม่เก็บคำถาม" | MuCraft | กลาง | ต่ำ | evidence/confidence block ที่มีอยู่ (`SYSTEM_LEAP_BLUEPRINT.md` §4B) |
| 12 | **หน้าเครื่องมือเป็น SEO landing** — บทความไทยใต้เครื่องมือ + "เครื่องมือที่เกี่ยวข้อง" ดึงจาก RAG docs ที่เรามี | THAKSA, Starot | กลาง | กลาง | `public/docs/`, หน้าแต่ละ vertical |
| 13 | **ขายวอลเปเปอร์ AI เป็นสินค้าเดี่ยว** (AstroNeko ขายวอลเปเปอร์ ฿299) และ **แชร์การ์ดผลลง IG/LINE** (Raka ใส่ไว้ในแผนรายปี, Horachat ให้แชร์ฟรี) | AstroNeko, Raka, Horachat | กลาง | กลาง | `/api/ai/wallpaper`, result share |
| 14 | สรุปดวงรายปีแบบ "Year Wrapped" จาก library ที่บันทึกไว้ | Raka | ต่ำ–กลาง | กลาง | `src/lib/library/` |

**Quick wins (ทำได้ในสปรินต์เดียว)**: #1, #2, #6, #7, #10, #11
**Bet ใหญ่**: #3 (payment rails), #5 (LINE retention), #9 (ปฏิทินดวง)

---

## ตารางให้คะแนน

> คะแนน 1–5 เป็นความเห็นของผู้วิจัยจากสิ่งที่เห็นจริงในภาพหน้าจอ ให้ทีมให้คะแนนซ้ำได้ · "–" = ไม่มี/ดูไม่ได้ (ไม่นับรวม) · รวม = คะแนนที่ได้ / คะแนนเต็มของเกณฑ์ที่ประเมินได้ และค่าเฉลี่ยในวงเล็บ
> เกณฑ์: **ภาพ** = visual/brand · **Flow** = ความชัดของขั้นตอนการอ่าน · **เลือกไพ่** = interaction การเลือก/กางไพ่ · **ผล** = การนำเสนอหน้าผล · **Paywall** = UX การเก็บเงิน · **มือถือ** · **Trust** = ความโปร่งใส/ความน่าเชื่อถือ · **ไทย** = ความเหมาะกับตลาดไทย

| เว็บ | ภาพ | Flow | เลือกไพ่ | ผล | Paywall | มือถือ | Trust | ไทย | รวม | ควรนำมาใช้กับ REFFORTUNE |
|---|---|---|---|---|---|---|---|---|---|---|
| THAKSA | 5 | 5 | 4 | 4 | 5 | 5 | 3 | 5 | **36/40 (4.5)** | บันได "DEEPER READING" 3 ขั้น + ปลดล็อกด้วยวันเกิดแบบ inline + นับถอยหลังไพ่พรุ่งนี้ + ปุ่ม "ส่งไป LINE" → `src/app/tarot/result/ResultClient.tsx`, `src/app/daily-card/page.tsx`, `src/components/reading/ReadingBlocks.tsx` (บล็อก `cta`) |
| MuCraft | 4 | 4 | – | 4 | 4 | 4 | 5 | 5 | **30/35 (4.3)** | ช่องวันเกิดช่องเดียวบนหน้าแรก → การ์ดผลทันทีจาก engine + ป้าย "ตัวอย่าง vs ดวงเต็ม" + LINE ปุ่มแรก + แถบ "คืนเงิน/ไม่ผูกมัด" → `src/app/page.tsx`, `src/lib/numerology/`/`chinese-zodiac` baseline, `src/app/login/LoginClient.tsx`, `/pricing` |
| AI Tarot (aitarot.pro) | 4 | 4 | 5 | 4 | 4 | 4 | 5 | 1 | **31/40 (3.9)** | ritual เลือกไพ่เต็มจอ + ตัวนับ + พลิกทีละใบ, ป้าย "BASIC MEANING" ตอน fallback, "ไพ่คงเดิมหลังล็อกอิน ไม่จั่วใหม่", ชิปคำถาม, เลือกผู้อ่าน → `src/app/tarot/pick/PickClient.tsx`, result trust panel (fallback), `src/lib/ai/templates/tarot.ts` (persona) |
| Horachat | 3 | 4 | – | 5 | 4 | 4 | 4 | 5 | **29/35 (4.1)** | แสดงผล deterministic (ลัคนา/ธาตุ/สี/เลขมงคล) ก่อน แล้วค่อย stream AI + ชิปหัวข้อถามต่อ + ปฏิทินดวง + ทดลองฟรี 7 วัน → `src/app/astrology/chart/ChartClient.tsx`, loading state ทุก result page, `src/app/lucky-numbers/`, `/pricing` |
| AstroNeko | 5 | 2 | – | – | 3 | 4 | 2 | 5 | **21/30 (3.5)** | มาสคอต/persona แบรนด์, ตัวนับสด "ดูดวงไปแล้ว X ครั้ง", รีวิวภาพแชท LINE, ขายวอลเปเปอร์/รายงานรายชิ้น → `src/app/page.tsx` (social proof), `src/app/wallpaper/`, `/pricing` |
| Raka | 4 | – | – | – | 4 | 4 | 4 | 1 | **17/25 (3.4)** | แผนรายปีรวม "แชร์การ์ดผล + Year Wrapped", ข้อความ disclaimer ชัด → `src/app/library/` (สรุปรายปี), `/pricing`, `src/app/terms/` |
| Starot | 4 | 3 | 2 | 2 | – | 4 | 4 | 1 | **20/35 (2.9)** | วิดเจ็ตฟรีแบบผลขึ้นในการ์ดเดิม (ไม่เปลี่ยนหน้า) เป็น SEO/onboarding → `src/app/explore/`, `src/app/horoscope/`, `src/app/compatibility/` |
| AkashicStone | 3 | 4 | 4 | 4 | 2 | – | 2 | 1 | **20/35 (2.9)** | แตะเด็ค "เปิด 3 ใบ" + ตัวนับ, หัวข้อผลเชิงกวี (Past: The Hidden Roots…) → `src/app/tarot/pick/PickClient.tsx`, `src/lib/ai/templates/tarot.ts` (หัวข้อ section) |
| REFFORTUNE (ของเรา) | 3 | 2 | 3 | – | – | 3 | 1 | 3 | **15/30 (2.5)** | ช่องว่าง 3 อันดับ (ตามเป้าหมาย "ลูกดวงเลือกไพ่เองแทนวิดีโอคอล"): (1) **เลือกไพ่บนมือถือ** — aitarot.pro ใช้ ritual เต็มจอ เลือก/ยกเลิกได้ + พลิกทีละใบ; ของเรา 78 ใบซ้อนแน่นแยกไม่ออก และปุ่ม "สับไพ่ใหม่"/"ดูผลทำนาย" ล้นจอเมื่อเลือกครบ → `src/app/tarot/pick/PickClient.tsx`; (2) **ส่งไพ่ให้หมอดู** — THAKSA มีปุ่ม "ส่งไป LINE" ทันทีหลังเปิดไพ่; ของเรามีการ์ดแชร์แต่โดเมนบนการ์ดผิด (www.reffortune.com) ชื่อไพ่เป็นอังกฤษ และไม่มีคำถาม/ชื่อลูกดวงบนการ์ด → การ์ดแชร์ใน `src/app/tarot/result/ResultClient.tsx`; (3) **คำถามก่อนเลือกไพ่** — THAKSA/aitarot.pro มีชิปหัวข้อ + ช่องคำถาม; หมอดูต้องรู้คำถามอยู่แล้ว ให้ลูกดวงพิมพ์ก่อนแล้วแนบไปกับการ์ดที่ส่ง → `src/app/tarot/page.tsx` |

### หลักฐานรายคะแนน

**THAKSA**
- ภาพ 5 — ไพ่ออกแบบเองโทนดำ-ทอง ทั้งหลังไพ่และหน้าไพ่: `screens/thaksa/04-card-spread-mobile.jpg`, `05-card-revealed-mobile.jpg`
- Flow 5 — เลือกหัวข้อ → แตะ 1 ใบ → เห็นผลทันที ไม่มีขั้นเกิน: `03-topic-form-mobile.jpg` → `05-card-revealed-mobile.jpg`
- เลือกไพ่ 4 — ไพ่ 8 ใบ ใบที่ hover ยกขึ้นมีแสง แต่ไม่มีการสับ/แอนิเมชันกางไพ่ให้เห็น: `04-card-spread-mobile.jpg`
- ผล 4 — ไพ่ใหญ่ + ข้อความสั้น + แชร์/LINE + นับถอยหลัง แต่เนื้อหาฟรีสั้นและเป็น template: `06-result-free-mobile.jpg`, `06b-result-share-mobile.jpg`
- Paywall 5 — ล็อกเป็นขั้น (วันเกิด → ล็อกอิน → ฿49) ใต้ผลฟรี: `06c-result-locked-deeper-mobile.jpg`, `09-standout-birthdate-unlock-modal-mobile.jpg`
- มือถือ 5 — mobile-first, bottom nav, ปุ่มใหญ่: `02-landing-mobile.jpg`
- Trust 3 — ข้อความ "คำอธิษฐานของคุณจะถูกเก็บไว้…" ใต้ช่องคำถาม ไม่มี disclaimer บนหน้าผล: `04-card-spread-mobile.jpg`
- ไทย 5 — อาจารย์คนจริง ราคาบาท OTP เบอร์โทร LINE: `07-paywall-ask-master-mobile.jpg`, `08-login-mobile.jpg`

**MuCraft**
- ภาพ 4 — typographic ดำ-ทอง ดูพรีเมียมแต่ไม่มีภาพประกอบ/ไพ่: `screens/mucraft/01-landing-desktop.jpg`
- Flow 4 — กรอก 1 ช่อง → ผลทันที แต่ปุ่ม "เริ่มอ่านดวงฟรี" ตรงไปหน้าล็อกอิน: `03-input-birthdate-mobile.jpg`, `06-result-free-teaser-mobile.jpg`
- เลือกไพ่ – — ไม่มีไพ่
- ผล 4 — การ์ด Yang Fire + วงธาตุ + หมายเหตุขอบเขต แต่ผลสั้นมาก: `06-result-free-teaser-mobile.jpg`
- Paywall 4 — 4 แผน + ป้ายยอดนิยม + แถบรับประกัน แต่ชื่อแผน (ฤกษ์/ตรีมูรติ) ต้องอ่านเพิ่ม: `07b-pricing-desktop.jpg`
- มือถือ 4 — ใช้ได้ดี แต่ toast "ติดตั้ง MuCraft" บังจอล่าง: `06-result-free-teaser-mobile.jpg`
- Trust 5 — PDPA, คำนวณในเบราว์เซอร์, AES-256 ลบใน 72 ชม., คืนเงิน 7 วัน: `09-standout-privacy-biometric-mobile.jpg`
- ไทย 5 — LINE ปุ่มแรก, PromptPay/TrueMoney, ศาสตร์ไทย+จีน: `08-login-line-first-mobile.jpg`

**AI Tarot (aitarot.pro)**
- ภาพ 4 — ม่วงเข้ม-ทอง serif สม่ำเสมอ หลังไพ่ออกแบบเอง: `screens/aitarot/04c-card-ritual-3picked-mobile.jpg`
- Flow 4 — spread → คำถาม → ผู้อ่าน → ritual → เปิดไพ่ ชัดแต่ยาว 5 ขั้น: `03-question-chips-mobile.jpg` → `04d-reveal-prompt-mobile.jpg`
- เลือกไพ่ 5 — ritual เต็มจอ "0 OF 3 SELECTED" เลือก/ยกเลิกได้ + คว่ำ 3 ใบ + พลิกทีละใบ: `04-card-ritual-spread-mobile.jpg`, `04e-card-flip-mobile.jpg`
- ผล 4 — การ์ดต่อใบ + ป้าย BASIC MEANING + ใบที่ 3 ล็อก แต่ AI preview ล่มตอนทดสอบ: `06-result-preview-fallback-mobile.jpg`
- Paywall 4 — gate อธิบายชัดว่า "ไพ่คงเดิม ไม่จั่วใหม่" แต่ฟรีแค่ 1 ครั้งต่อบัญชี: `06b-result-unlock-gate-mobile.jpg`, `07b-pricing-desktop.jpg`
- มือถือ 4 — ritual เหมาะกับจอมือถือ แต่ตารางไพ่ 30 ใบเล็ก: `04-card-ritual-spread-mobile.jpg`
- Trust 5 — บอกตรงๆ เมื่อ AI ใช้ไม่ได้ + ผลที่เห็นแล้วเก็บไว้คำต่อคำ: `06-result-preview-fallback-mobile.jpg`, `08-login-prompt-mobile.jpg`
- ไทย 1 — อังกฤษล้วน ไม่มี LINE/ราคาบาท: `08-login-prompt-mobile.jpg`

**Horachat**
- ภาพ 3 — ม่วง-เหลือง ใช้ไพ่ Rider–Waite มาตรฐาน ไม่มีเอกลักษณ์มาก: `screens/horachat/02-landing-mobile.jpg`
- Flow 4 — ฟอร์มผูกลัคนาเป็น hero กรอกแล้วได้ผลทันที แต่ dropdown ปี พ.ศ. 100 ตัวเลือกเลื่อนยาว: `03-birth-form-filled-mobile.jpg`
- เลือกไพ่ – — ทาโรต์ต้องสมัครก่อน: `08-signup-gate-tarot-mobile.jpg`
- ผล 5 — ข้อมูลคำนวณขึ้นก่อน + AI แบบแชท + ชิปถามต่อ 8 หัวข้อ: `05-loading-deterministic-first-mobile.jpg`, `06-result-mobile.jpg`
- Paywall 4 — ฟรีใช้ได้จริง + ฿99/เดือน + ทดลอง 7 วันไม่ผูกบัตร: `07b-pricing-desktop.jpg`
- มือถือ 4 — ใช้งานได้ดี ข้อความยาวอ่านง่าย: `06-result-mobile.jpg`
- Trust 4 — อธิบายวิธีคำนวณ (พื้นดวง + ดาวจร) และ "ไม่ผูกบัตร" แต่ไม่มี disclaimer บนผล: `01-landing-desktop.jpg`
- ไทย 5 — ปี พ.ศ., ลัคนา, สีมงคล, เลขมงคล, LINE: `05-loading-deterministic-first-mobile.jpg`

**AstroNeko**
- ภาพ 5 — ภาพวาดแมวมาสคอตคุณภาพสูง จดจำง่าย: `screens/astroneko/01-landing-desktop.jpg`
- Flow 2 — ทุกเส้นทางเด้งล็อกอินทันที: `03-choose-path-mobile.jpg` → `08-login-gate-mobile.jpg`
- เลือกไพ่ – / ผล – — ดูไม่ได้เพราะต้องล็อกอิน
- Paywall 3 — ราคาขีดฆ่า + % ส่วนลดแบบอีคอมเมิร์ซ ชัดแต่กดดัน: `07-pricing-products-mobile.jpg`
- มือถือ 4 — bottom sheet ล็อกอินและ hub ใช้บนมือถือได้ดี: `08-login-gate-mobile.jpg`
- Trust 2 — แบนเนอร์ PDPA มีแค่ "ยอมรับ", ต้องล็อกอินก่อนเห็นคุณค่า: `09-standout-mu-hub-live-counter-mobile.jpg`
- ไทย 5 — LINE, รีวิวแชท LINE, ของมงคลเจิมแล้ว, ทักษา/ปาจื่อ: `09b-standout-line-chat-reviews-mobile.jpg`

**Raka**
- ภาพ 4 — ธีมสว่างครีม-ม่วง ต่างจากตลาด ดูสะอาด: `screens/raka/01-landing-desktop.jpg`
- Flow / เลือกไพ่ / ผล – — อยู่ในแอป
- Paywall 4 — 2 แผนชัด บอกส่วนต่างรายปี: `07-pricing-desktop.jpg`
- มือถือ 4 — หน้า marketing responsive ดี: `02-landing-mobile.jpg`
- Trust 4 — "for self-reflection and education only", ต่ออายุอัตโนมัติแจ้งชัด: `07-pricing-desktop.jpg`
- ไทย 1 — อังกฤษ/ดอลลาร์ ไม่มีช่องทางไทย

**Starot**
- ภาพ 4 — ดำ + มิ้นต์ ดูสงบ ไม่เหมือนหมอดู: `screens/starot/01-landing-desktop.jpg`
- Flow 3 — วิดเจ็ตผลขึ้นในที่เดิม แต่เป็นแค่ตัวอย่าง: `09-standout-free-widgets-desktop.jpg`
- เลือกไพ่ 2 — แตะการ์ดเดียว ไม่มีภาพไพ่: `09-standout-free-widgets-desktop.jpg`
- ผล 2 — ประโยคสั้น 1–2 บรรทัด: `09-standout-free-widgets-desktop.jpg`
- Paywall – — waitlist
- มือถือ 4 — `02-landing-mobile.jpg`
- Trust 4 — "reflective experiences, not medical, legal, financial, or therapeutic advice": `09-standout-free-widgets-desktop.jpg`
- ไทย 1 — อังกฤษ ตลาดอเมริกาเหนือ

**AkashicStone** (ไม่มีภาพ — ถูกระบบกันบอทบล็อกตอนใช้ DevTools CLI คะแนนนี้อ้างอิงการทดลองรอบแรกด้วย Claude in Chrome ใน §3.5)
- ภาพ 3 — hero มืดสวยแต่ header ร้านค้าสีขาวขัดอารมณ์ (§3.5)
- Flow 4 — ถามคำถาม → แตะเด็ค 3 ครั้ง → ผล ไม่ต้องล็อกอิน (§3.5)
- เลือกไพ่ 4 — เด็คเรืองแสง + ตัวนับ "reveal 3 cards" (§3.5)
- ผล 4 — แบ่ง Past/Present/Future/Oracle ชื่อหัวข้อเชิงกวี (§3.5)
- Paywall 2 — ไม่มีการเก็บเงินกับการอ่าน ขายของแทรก ไม่เชื่อมกับผล (§3.5)
- มือถือ – — ไม่ได้ทดสอบ
- Trust 2 — ไม่มี disclaimer บนผล ไม่มีสถานะโหลด (§3.5)
- ไทย 1 — อังกฤษ ร้านค้าสากล

**REFFORTUNE (reftirata.life)** เป้าหมายของเว็บนี้ (จากเจ้าของ): เป็นหน้าให้ลูกดวงเลือกไพ่เองได้สะดวก แทนการวิดีโอคอลให้หมอดูกางไพ่ให้เลือก หมอดูเป็นคนอ่านผล จึงตั้งใจไม่แสดงคำทำนายและไม่มี paywall ในเว็บ — ผลและ Paywall จึงไม่นับคะแนน
- ภาพ 3 — โลโก้สวย ธีมม่วงพาสเทลสะอาดแต่ทั่วไป และสามหน้าหลักใช้สามสไตล์ (ม่วงอ่อน / ดำ / ดำ-แดง): `screens/reftirata/02-landing-mobile.jpg`, `04-card-pick-start-mobile.jpg`, `10-esiimsi-input-mobile.jpg`
- Flow 2 — เลือกได้แค่จำนวนใบ ไม่มีหัวข้อหรือคำถามให้หมอดูรู้ก่อนอ่าน: `03-tarot-topic-mobile.jpg`, `06-result-top-mobile.jpg`
- เลือกไพ่ 3 — มีสับไพ่ + ตัวนับ + เลขลำดับใบ แต่ไพ่ 78 ใบซ้อนแน่นแยกไม่ออก ไม่มีพลิกไพ่ และปุ่มล้นจอเมื่อเลือกครบ: `04c-card-pick-3of3-mobile.jpg`
- ผล – — ไม่นับคะแนน: ตั้งใจไม่แสดงคำทำนาย หมอดูเป็นคนอ่านผลเอง (หน้าผลมีภาพไพ่ชื่ออังกฤษ + การ์ดแชร์): `06-result-top-mobile.jpg`, `06b-result-share-card-mobile.jpg`
- Paywall – — ไม่นับคะแนน: ตั้งใจไม่มี paywall ในเว็บ (ข้อสังเกตที่ยังควรแก้: โปร "ถึง 31 ม.ค." หมดอายุแต่ยังแสดง, ราคาหน้าแรกไม่ตรงกับ `/pricing`): `09-standout-bad-expired-promo-mobile.jpg`, `07-pricing-mobile.jpg`
- มือถือ 3 — bottom nav และการ์ดใช้ง่าย แต่ปุ่มหน้าเลือกไพ่ล้นขอบ และเดสก์ท็อปเป็นเลย์เอาต์มือถือยืดเต็มจอ: `04c-card-pick-3of3-mobile.jpg`, `01-landing-desktop.jpg`
- Trust 1 — ไม่มี trust panel/disclaimer บนผล, เซียมซีขึ้น "ระบบยังไม่พร้อม" แทนคำทำนาย, การ์ดแชร์ใช้โดเมน www.reffortune.com ไม่ตรงกับเว็บจริง: `11-esiimsi-result-mobile.jpg`, `06b-result-share-card-mobile.jpg`
- ไทย 3 — ภาษาไทย + LINE login + เซียมซี แต่หัวข้อหลักเป็นอังกฤษ (Tarot result, Save to Library, SACRED CHANCE) และใช้ "นะคะ/ครับ": `08-login-mobile.jpg`, `06-result-top-mobile.jpg`, `11-esiimsi-result-mobile.jpg`

---

## 5. สิ่งที่ยืนยันไม่ได้ / ข้อจำกัด
- **Horachat**: โดเมน ธ.ค. 2025 + © 2025 — วันเปิดจริงไม่ทราบ
- **AstroNeko**: เว็บเปิดปี 2025 (ต.ค. 2568) ปี 2026 เป็นการขยายสู่ตู้/ร้าน ใส่ไว้เพื่อเทียบคู่แข่งเท่านั้น
- **aitarot.pro**: โดเมนปี 2026 แต่ footer เขียน © 2025 — ถือตามวันจดโดเมน
- **Raka**: เห็นแค่เว็บ marketing การอ่านจริงอยู่ในแอป (ไม่ได้ติดตั้ง)
- **Starot**: ยังเป็น waitlist ไม่มี flow จริงหรือราคา
- **Aistro** (จากรายการเดิม): Product Hunt ไม่แสดงวันเปิดตัว, aistro.ai จดปี 2025 — ตัดออก
- ผลลัพธ์ส่วนลึกที่ต้องล็อกอินหรือจ่ายเงิน (THAKSA, MuCraft, AstroNeko, Horachat, aitarot.pro) ไม่ได้เห็นเพราะห้ามสมัคร/จ่าย
- ภาพหน้าจอถ่ายด้วย Chrome DevTools CLI (Chrome Dev, โปรไฟล์ `--isolated` ชั่วคราว) ที่ 1440×900 (เดสก์ท็อป) และ 390×844 mobile emulation; AkashicStone บล็อก webdriver (X Shield) จึงไม่มีภาพ; Starot/Raka ถ่ายเฉพาะหน้า landing/pricing ตามที่มี
- ไม่ได้ทดสอบ responsive โดยย่อหน้าต่างทุกเว็บ (THAKSA แสดงเลย์เอาต์มือถือสวย; MuCraft ระบุว่า "แนะนำให้ใช้บนมือถือ")
- เว็บดูดวงไทยใหม่ที่เปิดปี 2026 และยืนยันได้มีน้อย การค้นหาส่วนใหญ่เจอเว็บเก่า (sanook, myhora, horoworld, kapook, thairath)

## แหล่งอ้างอิง
- RDAP: rdap.identitydigital.services (.ai), rdap.org (.com), THNIC WHOIS (whois.thnic.co.th) — ตรวจเมื่อ 2026-09-19
- ไทยรัฐ: https://www.thairath.co.th/money/tech_innovation/digital_assets/2890506 (21 ต.ค. 2568)
- Siam Blockchain: https://siamblockchain.com/2026/09/09/astroneko-brings-thailands-first-ai-fortune-telling-booth-to-money-fest-2026-by-thairath-money/
- MuCraft blog: https://mucraft.in.th/th/blog/top-7-fortune-telling-apps-2026 (26 เม.ย. 2569)
