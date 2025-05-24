import React from "react";
import { FaInstagram, FaFacebookF, FaTelegramPlane, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-black text-white pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8">
          {/* First column */}
          <div>
            <h2 className="text-2xl font-bold">VOGUEISH</h2>
            <p className="text-gray-300 mt-2">
              Specializes in providing high-quality, stylish products
            </p>
            <p className="text-gray-400 mt-2">info.voguish.live</p>
          </div>

          {/* Second column - Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400">8819 Ohio St. South Gate, CA 90280</p>
            <p className="text-gray-400">Ourstudio@hello.com</p>
            <p className="text-gray-400">+1 386-688-3295</p>
          </div>

          {/* Third column - Policies and Socials */}
          <div>
            <h3 className="text-xl font-bold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-gray-300">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-300">Terms & Condition</a></li>
            </ul>
            <div className="flex gap-4 mt-4">
              <FaInstagram className="text-gray-400 text-xl hover:text-white" />
              <FaFacebookF className="text-gray-400 text-xl hover:text-white" />
              <FaTelegramPlane className="text-gray-400 text-xl hover:text-white" />
              <FaTwitter className="text-gray-400 text-xl hover:text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-6 text-gray-400">
        Copyright @ 2024 Voguish. All right reserved
      </div>
    </div>
  );
};

export default Footer;
