"use client";
import { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {submitted ? (
          <div className="text-green-600 font-semibold text-center">
            Thank you for contacting us!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="border p-2 rounded"
              rows={5}
              required
            />
            <button
              type="submit"
              className="bg-[#006A62] text-white py-2 rounded hover:bg-[#FF8C5A] transition"
            >
              Send
            </button>
          </form>
        )}
        <div className="mt-8 text-gray-700">
          <h2 className="font-bold mb-2">Contact Information</h2>
          <p>Email: info@yourlms.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Main St, City, Country</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
