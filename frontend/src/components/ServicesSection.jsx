import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ServiceModal } from "./ServiceModal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // Fallback services if API fails
        setServices([
          {
            id: "swedish",
            name: "Swedish Massage",
            tagline: "Gentle strokes, deep relaxation",
            description: "Our signature Swedish massage combines long, flowing strokes with gentle kneading to release tension and promote total relaxation.",
            benefits: ["Reduces stress & anxiety", "Improves circulation", "Relieves muscle tension", "Promotes deep relaxation"],
            duration: "60 / 90 min",
            price: "From KES 5,000",
            image: "https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "deep-tissue",
            name: "Deep Tissue Massage",
            tagline: "Intense relief for chronic tension",
            description: "Targeting the deeper layers of muscle tissue, this therapeutic massage uses firm pressure and slow strokes to release chronic patterns of tension.",
            benefits: ["Releases chronic muscle tension", "Breaks up scar tissue", "Improves posture", "Reduces inflammation"],
            duration: "60 / 90 min",
            price: "From KES 6,000",
            image: "https://images.pexels.com/photos/5793699/pexels-photo-5793699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "thai",
            name: "Thai Massage",
            tagline: "Ancient healing art",
            description: "An ancient healing system combining acupressure, Indian Ayurvedic principles, and assisted yoga postures.",
            benefits: ["Increases flexibility", "Boosts energy levels", "Improves range of motion", "Balances energy flow"],
            duration: "90 / 120 min",
            price: "From KES 7,000",
            image: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "sensual",
            name: "Sensual Massage",
            tagline: "Awaken your senses",
            description: "A tantalizing journey designed to awaken every nerve ending with feather-light touches and warm oil.",
            benefits: ["Heightens body awareness", "Releases emotional tension", "Promotes intimacy", "Creates deep relaxation"],
            duration: "60 / 90 min",
            price: "From KES 8,000",
            image: "https://images.pexels.com/photos/6187255/pexels-photo-6187255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "exotic",
            name: "Exotic Bodywork",
            tagline: "Beyond ordinary boundaries",
            description: "An exclusive experience that transcends traditional massage, combining Eastern traditions with modern techniques.",
            benefits: ["Full body rejuvenation", "Mind-body connection", "Stress elimination", "Sensory awakening"],
            duration: "90 / 120 min",
            price: "From KES 10,000",
            image: "https://images.pexels.com/photos/3865792/pexels-photo-3865792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "body-to-body",
            name: "Body to Body",
            tagline: "Ultimate connection",
            description: "An intimate experience where our therapist uses their entire body to massage yours with warm oils.",
            benefits: ["Complete muscle relaxation", "Enhanced sensory experience", "Deep emotional release", "Ultimate stress relief"],
            duration: "60 / 90 min",
            price: "From KES 12,000",
            image: "https://images.pexels.com/photos/6663366/pexels-photo-6663366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "four-hands",
            name: "Four Hands Massage",
            tagline: "Double the indulgence",
            description: "Two therapists work in perfect synchronization to deliver double the pleasure in harmony.",
            benefits: ["Doubles the relaxation", "Overwhelms the mind", "Synchronized bliss", "Ultimate luxury"],
            duration: "60 / 90 min",
            price: "From KES 15,000",
            image: "https://images.pexels.com/photos/5793696/pexels-photo-5793696.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          },
          {
            id: "back-massage",
            name: "Back Massage",
            tagline: "Focused relief",
            description: "Perfect for those short on time, this targeted treatment focuses entirely on the back, shoulders, and neck.",
            benefits: ["Quick tension relief", "Improves posture", "Reduces back pain", "Perfect for busy schedules"],
            duration: "30 / 45 min",
            price: "From KES 3,500",
            image: "https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      id="services"
      className="section bg-[#0f0505] relative"
      data-testid="services-section"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-accent text-2xl text-[#d4af37] mb-2"
          >
            Our Offerings
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-title"
            data-testid="services-title"
          >
            Indulgent Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-[#dbbac2] max-w-2xl mx-auto"
          >
            Each experience is crafted to transport you to a realm of pure bliss. 
            Choose your journey to relaxation.
          </motion.p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="service-card h-80 animate-pulse bg-[#1a0b0b]"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="service-card cursor-pointer"
                onClick={() => setSelectedService(service)}
                data-testid={`service-card-${service.id}`}
              >
                <div className="service-card-image">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                  />
                  <div className="service-card-overlay" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-[#fce4ec] mb-1">
                    {service.name}
                  </h3>
                  <p className="font-body text-sm text-[#d4af37] italic mb-3">
                    {service.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d6e75] text-sm">
                      {service.duration}
                    </span>
                    <button
                      className="text-[#d4af37] text-sm font-medium hover:text-[#f3e5ab] transition-colors duration-300"
                      data-testid={`service-btn-${service.id}`}
                    >
                      Find Out More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
};
