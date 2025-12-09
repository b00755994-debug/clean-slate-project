import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import SlackIntegration from "@/components/SlackIntegration";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import BetaBanner from "@/components/BetaBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BetaBanner />
      <Hero />
      <ProblemSolution />
      <SlackIntegration />
      <Features />
      <Testimonial />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
