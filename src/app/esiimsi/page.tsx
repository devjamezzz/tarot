import EsiimsiClient from "./EsiimsiClient";

export const metadata = {
  title: "เซียมซีเสี่ยงทาย",
  description:
    "ตั้งจิตอธิษฐาน เขย่ากระบอกเซียมซี รับบทกลอนและคำทำนายจากตำรา 28 ใบ พร้อมส่งผลให้หมอดูทาง LINE",
};

export default function EsiimsiPage() {
  return <EsiimsiClient />;
}
