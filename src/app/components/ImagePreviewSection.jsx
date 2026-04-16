'use client';

import { useState, useEffect, useRef } from 'react';
import { IoShareSocialOutline } from 'react-icons/io5';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
  FaTwitter,
  FaTumblr,
  FaInstagram,
  FaSnapchat
} from 'react-icons/fa';
import { MdContentCopy, MdEmail } from 'react-icons/md';

export default function SharePopup() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const text = "Check this out!";

  const baseClass =
    "w-12 h-12 flex items-center justify-center rounded-full text-white text-lg shadow-lg hover:scale-110 transition duration-200";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="relative" ref={ref}>
      
      {/* Top Share Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-100 p-2 rounded-full shadow hover:shadow-md transition"
      >
        <IoShareSocialOutline size={20} />
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
          
          <div className="grid grid-cols-4 gap-4 justify-items-center">

            {/* Facebook */}
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank"
              className={`${baseClass} bg-gradient-to-br from-blue-500 to-indigo-600`}>
              <FaFacebookF />
            </a>

            {/* Twitter / X */}
            <a href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`} target="_blank"
              className={`${baseClass} bg-black`}>
              <FaTwitter />
            </a>

            {/* Instagram */}
            <button
              onClick={() => window.open('https://www.instagram.com/', '_blank')}
              className={`${baseClass} bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600`}
            >
              <FaInstagram />
            </button>

            {/* WhatsApp */}
            <a href={`https://wa.me/?text=${text} ${url}`} target="_blank"
              className={`${baseClass} bg-green-500`}>
              <FaWhatsapp />
            </a>

            {/* Snapchat */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: text, url });
                } else {
                  alert("Sharing not supported");
                }
              }}
              className={`${baseClass} bg-yellow-400 text-black`}
            >
              <FaSnapchat className="text-xl" />
            </button>

            {/* Email */}
            <a href={`mailto:?subject=${text}&body=${url}`}
              className={`${baseClass} bg-red-500`}>
              <MdEmail />
            </a>

            {/* LinkedIn */}
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank"
              className={`${baseClass} bg-blue-700`}>
              <FaLinkedinIn />
            </a>

            {/* Tumblr */}
            <a href={`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}`} target="_blank"
              className={`${baseClass} bg-indigo-700`}>
              <FaTumblr />
            </a>

            {/* Telegram */}
            <a href={`https://t.me/share/url?url=${url}&text=${text}`} target="_blank"
              className={`${baseClass} bg-gradient-to-br from-blue-400 to-blue-600`}>
              <FaTelegramPlane />
            </a>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className={`${baseClass} ${copied ? 'bg-emerald-600' : 'bg-gray-700'}`}
              title={copied ? 'Copied!' : 'Copy link'}
            >
              <MdContentCopy />
            </button>

          </div>
          <button
            onClick={copyToClipboard}
            className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
              copied ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}