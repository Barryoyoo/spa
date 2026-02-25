import { useState, useEffect } from "react";
import "@/App.css";
import { Toaster } from "sonner";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { ContactSection } from "./components/ContactSection";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Footer } from "./components/Footer";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    // Apply theme to body
    if (isDarkMode) {
      document.body.classList.remove("light-theme");
      document.body.style.backgroundColor = "#0f0505";
    } else {
      document.body.classList.add("light-theme");
      document.body.style.backgroundColor = "#faf8f5";
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? "" : "light-theme"}`} data-testid="app-container">
      {/* Particle Background */}
      <ParticlesBackground />

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        duration={4000}
        toastOptions={{
          style: {
            background: "#1a0b0b",
            border: "1px solid rgba(212, 175, 55, 0.5)",
            color: "#fce4ec",
            zIndex: 9999,
          },
          className: "font-body",
        }}
      />

      {/* Navigation */}
      <Navigation isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="content-wrapper">
        <HeroSection />
        <ServicesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DaySpa",
          "name": "Amani Temptress Spa",
          "image": "https://ik.imagekit.io/8ax0u09f2/amani%20logo.png",
          "description": "Nairobi's premier luxury spa offering Swedish, Thai, Deep Tissue, Sensual, and Body to Body massages in Kilimani.",
          "url": "https://amanitemptressspa.com",
          "telephone": "+254710574902",
          "email": "amanitemptressspa@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kindaruma Road",
            "addressLocality": "Kilimani",
            "addressRegion": "Nairobi",
            "addressCountry": "KE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -1.297796,
            "longitude": 36.791215
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "09:00",
            "closes": "22:00"
          },
          "priceRange": "KES 3,500 - KES 15,000",
          "sameAs": [
            "https://wa.me/254710574902"
          ]
        })}
      </script>
    </div>
  );
}

export default App;
