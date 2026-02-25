import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="hero-section"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/7303269/pexels-photo-7303269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Luxury spa ambiance"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay" />
      </div>

      {/* Burgundy glow overlay */}
      <div 
        className="absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(112,8,24,0.3) 0%, rgba(15,5,5,0) 60%)"
        }}
      />

      {/* Content */}
      <div className="hero-content">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-accent text-2xl md:text-4xl text-[#d4af37] mb-4"
          data-testid="hero-tagline"
        >
          Amani Temptress Spa
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#fce4ec] mb-6 leading-tight"
          data-testid="hero-headline"
        >
          Where Desire<br />
          <span className="text-gold-gradient">Meets Indulgence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-base md:text-lg text-[#dbbac2] max-w-2xl mx-auto mb-10 leading-relaxed"
          data-testid="hero-description"
        >
          Surrender to the whispers of silk and the warmth of candlelight. 
          Experience Nairobi's most seductive sanctuary of relaxation and pleasure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={scrollToContact}
            className="btn-primary gold-glow"
            data-testid="hero-cta-btn"
          >
            Reserve Your Indulgence
          </button>
          <button
            onClick={scrollToServices}
            className="btn-secondary"
            data-testid="hero-services-btn"
          >
            Explore Our Services
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="scroll-indicator"
        data-testid="scroll-indicator"
      >
        <span className="uppercase">Scroll</span>
        <div className="scroll-indicator-line" />
        <ChevronDown className="w-4 h-4 text-[#d4af37] animate-bounce" />
      </motion.div>
    </section>
  );
};
