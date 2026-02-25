import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navigation = ({ isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0f0505]/90 backdrop-blur-lg border-b border-[#d4af37]/20"
            : "bg-transparent"
        }`}
        data-testid="navigation"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              data-testid="nav-logo"
            >
              <img
                src="https://ik.imagekit.io/8ax0u09f2/amani%20logo.png"
                alt="Amani Temptress Spa"
                className="h-12 w-auto"
              />
              <span className="font-accent text-2xl md:text-3xl text-[#d4af37] hover:text-[#f3e5ab] transition-colors duration-300">
                Amani Temptress
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
                className="nav-link font-body text-sm uppercase tracking-widest"
                data-testid="nav-home"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                className="nav-link font-body text-sm uppercase tracking-widest"
                data-testid="nav-services"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="nav-link font-body text-sm uppercase tracking-widest"
                data-testid="nav-contact"
              >
                Contact
              </a>
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
                data-testid="theme-toggle"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-[#d4af37]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#d4af37]" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
                data-testid="theme-toggle-mobile"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-[#d4af37]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#d4af37]" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="theme-toggle"
                aria-label="Toggle menu"
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#d4af37]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#d4af37]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#0f0505]/95 backdrop-blur-lg border-b border-[#d4af37]/20 md:hidden"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                }}
                className="nav-link font-body text-lg py-2"
                data-testid="mobile-nav-home"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                className="nav-link font-body text-lg py-2"
                data-testid="mobile-nav-services"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                className="nav-link font-body text-lg py-2"
                data-testid="mobile-nav-contact"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
