import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Contract from "@/components/Contract";
import Timeline from "@/components/Timeline";
import CodeSection from "@/components/CodeSection";
import CutSection from "@/components/CutSection";
import FamilySection from "@/components/FamilySection";
import RegistrationSection from "@/components/RegistrationSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Contract />
        <Timeline />
        <CodeSection />
        <CutSection />
        <FamilySection />
        <RegistrationSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}