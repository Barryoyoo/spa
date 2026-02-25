import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Check } from "lucide-react";

export const ServiceModal = ({ service, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const scrollToBooking = () => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
        data-testid="service-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          data-testid="service-modal-content"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
            data-testid="service-modal-close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-64 md:h-auto">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a0b0b] hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b0b] to-transparent md:hidden" />
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-10">
              <p className="font-accent text-xl text-[#d4af37] mb-2">
                {service.tagline}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-[#fce4ec] mb-4">
                {service.name}
              </h2>

              <p className="font-body text-[#dbbac2] leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Duration & Price */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Clock className="w-5 h-5" />
                  <span className="font-body">{service.duration}</span>
                </div>
                <div className="text-[#f3e5ab] font-heading text-xl">
                  {service.price}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h4 className="font-heading text-lg text-[#d4af37] mb-3">
                  Benefits
                </h4>
                <ul className="space-y-2">
                  {service.benefits?.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#dbbac2]"
                    >
                      <Check className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                      <span className="font-body">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToBooking}
                className="btn-primary w-full"
                data-testid="service-modal-book-btn"
              >
                Book This Experience
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
