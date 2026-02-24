import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import BetaBanner from "@/components/BetaBanner";
import BackgroundGrid from "@/components/BackgroundGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundGrid />
      <div className="relative z-10">
        <Header />
        <BetaBanner />
        <Hero />
        <ProblemSolution />
        <Features />
        <Testimonial />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
