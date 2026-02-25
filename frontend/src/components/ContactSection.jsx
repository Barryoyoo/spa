import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Validation schemas
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  therapist: z.string().optional(),
  notes: z.string().optional(),
});

export const ContactSection = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const bookingForm = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      therapist: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "PPP");
      bookingForm.setValue("date", formattedDate, { shouldValidate: true });
    }
  };

  const onContactSubmit = async (data) => {
    setIsContactSubmitting(true);
    try {
      await axios.post(`${API}/contact`, data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      contactForm.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const onBookingSubmit = async (data) => {
    setIsBookingSubmitting(true);
    try {
      await axios.post(`${API}/booking`, data);
      toast.success("Booking request received! We'll confirm your appointment shortly.");
      bookingForm.reset();
      setSelectedDate(null);
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error("Booking form error:", error);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <section
      id="contact"
      className="section bg-[#1a0b0b] relative"
      data-testid="contact-section"
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
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-title"
            data-testid="contact-title"
          >
            Reserve Your Escape
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-[#dbbac2] max-w-2xl mx-auto"
          >
            Let us pamper you. Book your appointment or reach out with any questions.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Details */}
            <div className="mb-8">
              <h3 className="font-heading text-2xl text-[#d4af37] mb-6">
                Contact Details
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:+254710574902"
                  className="flex items-center gap-4 text-[#fce4ec] hover:text-[#d4af37] transition-colors duration-300"
                  data-testid="contact-phone"
                >
                  <div className="w-12 h-12 rounded-full bg-[#700818]/50 border border-[#d4af37]/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8d6e75]">Call Us</p>
                    <p className="font-body">+254 710 574 902</p>
                  </div>
                </a>

                <a
                  href="mailto:amanitemptressspa@gmail.com"
                  className="flex items-center gap-4 text-[#fce4ec] hover:text-[#d4af37] transition-colors duration-300"
                  data-testid="contact-email"
                >
                  <div className="w-12 h-12 rounded-full bg-[#700818]/50 border border-[#d4af37]/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8d6e75]">Email Us</p>
                    <p className="font-body">amanitemptressspa@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-[#fce4ec]">
                  <div className="w-12 h-12 rounded-full bg-[#700818]/50 border border-[#d4af37]/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8d6e75]">Visit Us</p>
                    <p className="font-body">Kindaruma Rd, Kilimani, Nairobi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="map-container h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63820.71771722101!2d36.791215!3d-1.297796!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1098497ba161%3A0x9d8afd76d92f37a3!2sKindaruma%20Rd%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1770109255307!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Amani Temptress Spa Location"
                data-testid="google-map"
              />
            </div>
          </motion.div>

          {/* Forms */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            {/* Tab Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab("booking")}
                className={`flex-1 py-3 rounded-full font-body text-sm transition-all duration-300 ${
                  activeTab === "booking"
                    ? "bg-[#700818] text-[#f3e5ab] border border-[#d4af37]"
                    : "bg-transparent text-[#dbbac2] border border-[#d4af37]/30 hover:border-[#d4af37]/50"
                }`}
                data-testid="tab-booking"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`flex-1 py-3 rounded-full font-body text-sm transition-all duration-300 ${
                  activeTab === "contact"
                    ? "bg-[#700818] text-[#f3e5ab] border border-[#d4af37]"
                    : "bg-transparent text-[#dbbac2] border border-[#d4af37]/30 hover:border-[#d4af37]/50"
                }`}
                data-testid="tab-contact"
              >
                Send Message
              </button>
            </div>

            {/* Booking Form */}
            {activeTab === "booking" && (
              <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} data-testid="booking-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      {...bookingForm.register("name")}
                      placeholder="Your Name"
                      className="form-input"
                      data-testid="booking-name"
                    />
                    {bookingForm.formState.errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...bookingForm.register("email")}
                      type="email"
                      placeholder="Your Email"
                      className="form-input"
                      data-testid="booking-email"
                    />
                    {bookingForm.formState.errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...bookingForm.register("phone")}
                      placeholder="Phone Number"
                      className="form-input"
                      data-testid="booking-phone"
                    />
                    {bookingForm.formState.errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      {...bookingForm.register("service")}
                      className="form-input bg-transparent cursor-pointer"
                      data-testid="booking-service"
                    >
                      <option value="" className="bg-[#1a0b0b]">Select Service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name} className="bg-[#1a0b0b]">
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {bookingForm.formState.errors.service && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.service.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="form-input text-left flex items-center justify-between"
                          data-testid="booking-date"
                        >
                          <span className={selectedDate ? "text-[#fce4ec]" : "text-[#8d6e75]"}>
                            {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                          </span>
                          <CalendarIcon className="w-5 h-5 text-[#d4af37]" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1a0b0b] border-[#d4af37]/30" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-[#1a0b0b] text-[#fce4ec]"
                        />
                      </PopoverContent>
                    </Popover>
                    {bookingForm.formState.errors.date && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      {...bookingForm.register("time")}
                      className="form-input bg-transparent cursor-pointer"
                      data-testid="booking-time"
                    >
                      <option value="" className="bg-[#1a0b0b]">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time} className="bg-[#1a0b0b]">
                          {time}
                        </option>
                      ))}
                    </select>
                    {bookingForm.formState.errors.time && (
                      <p className="text-red-400 text-xs mt-1">
                        {bookingForm.formState.errors.time.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...bookingForm.register("therapist")}
                      placeholder="Preferred Therapist (Optional)"
                      className="form-input"
                      data-testid="booking-therapist"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      {...bookingForm.register("notes")}
                      placeholder="Special Requests or Notes (Optional)"
                      rows={3}
                      className="form-input resize-none"
                      data-testid="booking-notes"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="btn-primary w-full mt-6"
                  data-testid="booking-submit"
                >
                  {isBookingSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Book Appointment
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Contact Form */}
            {activeTab === "contact" && (
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      {...contactForm.register("name")}
                      placeholder="Your Name"
                      className="form-input"
                      data-testid="contact-name"
                    />
                    {contactForm.formState.errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {contactForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...contactForm.register("email")}
                      type="email"
                      placeholder="Your Email"
                      className="form-input"
                      data-testid="contact-email-input"
                    />
                    {contactForm.formState.errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {contactForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...contactForm.register("phone")}
                      placeholder="Phone Number"
                      className="form-input"
                      data-testid="contact-phone-input"
                    />
                    {contactForm.formState.errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        {contactForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...contactForm.register("subject")}
                      placeholder="Subject"
                      className="form-input"
                      data-testid="contact-subject"
                    />
                    {contactForm.formState.errors.subject && (
                      <p className="text-red-400 text-xs mt-1">
                        {contactForm.formState.errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      {...contactForm.register("message")}
                      placeholder="Your Message"
                      rows={4}
                      className="form-input resize-none"
                      data-testid="contact-message"
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="btn-primary w-full mt-6"
                  data-testid="contact-submit"
                >
                  {isContactSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
