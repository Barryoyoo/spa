import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/8ax0u09f2/amani%20logo.png"
              alt="Amani Temptress Spa"
              className="h-10 w-auto"
            />
            <div>
              <p className="font-accent text-xl text-[#d4af37]">
                Amani Temptress
              </p>
              <p className="text-[#8d6e75] text-sm">
                © {currentYear} — Kilimani, Nairobi
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="text-[#dbbac2] hover:text-[#d4af37] transition-colors duration-300 text-sm"
              data-testid="footer-home"
            >
              Home
            </a>
            <span className="text-[#8d6e75]">|</span>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("services");
              }}
              className="text-[#dbbac2] hover:text-[#d4af37] transition-colors duration-300 text-sm"
              data-testid="footer-services"
            >
              Services
            </a>
            <span className="text-[#8d6e75]">|</span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="text-[#dbbac2] hover:text-[#d4af37] transition-colors duration-300 text-sm"
              data-testid="footer-contact"
            >
              Contact
            </a>
            <span className="text-[#8d6e75]">|</span>
            <a
              href="https://wa.me/254710574902"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#dbbac2] hover:text-[#d4af37] transition-colors duration-300 text-sm"
              data-testid="footer-whatsapp"
            >
              WhatsApp
            </a>
          </nav>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-[#8d6e75] italic text-sm mt-8"
        >
          "Where Desire Meets Indulgence"
        </motion.p>
      </div>
    </footer>
  );
};
