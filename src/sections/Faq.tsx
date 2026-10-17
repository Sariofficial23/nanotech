import Accordion, { type AccordionItem } from '../components/ui/Accordion';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';

const FAQ: AccordionItem[] = [
  {
    question: 'NanoTech nima bilan shug‘ullanadi?',
    answer:
      'NanoTech — ixcham yoqilg‘i quyish shoxobchalarini yaratish va rivojlantirishga qaratilgan loyiha. Biz shaharlar va avtomobil yo‘llari uchun zamonaviy yechimlarni rivojlantirishga intilamiz.',
  },
  {
    question: 'Ixcham AYOQSH qayerda joylashtirilishi mumkin?',
    answer:
      'Shahar ichidagi maydonlar va avtomobil yo‘llari bo‘yidagi joylar ko‘rib chiqilishi mumkin. Aniq joy maydonning xususiyatlari, texnik shartlar va zarur ruxsatnomalar asosida baholanadi.',
  },
  {
    question: 'Hamkorlikni qanday boshlash mumkin?',
    answer:
      'Sahifa pastidagi shakl orqali so‘rov qoldiring: ismingiz, telefon raqamingiz va qiziqish yo‘nalishingizni ko‘rsating. So‘rovingiz ko‘rib chiqilgach, siz bilan bog‘lanamiz.',
  },
  {
    question: 'Loyihani amalga oshirish qanday belgilanadi?',
    answer:
      'Har bir loyiha alohida ko‘rib chiqiladi: maydon o‘rganiladi, texnik shartlar va zarur ruxsatnomalar aniqlanadi, so‘ng tomonlar shartlarni kelishib oladi. Narxlar, muddatlar va boshqa shartlar oldindan belgilanmagan — ular har bir holatda alohida muhokama qilinadi.',
  },
];

export default function Faq() {
  return (
    <Section id="savol-javob" tone="soft" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          id="faq-title"
          eyebrow="Savol-javob"
          title="Ko‘p beriladigan savollar"
          lead="Javob topa olmadingizmi? Savolingizni so‘rov shaklida yozib qoldiring."
        />
        <Reveal delay={0.1}>
          <Accordion items={FAQ} />
        </Reveal>
      </div>
    </Section>
  );
}
