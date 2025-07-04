import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const profileLinks = [
  { label: 'Profile', href: '#' },
  { label: 'Settings', href: '#' },
  { label: 'Logout', href: '#' },
];

const Navbar = () => {
  const logoRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current.children,
        { y: 40, opacity: 0, rotate: -30 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
  }, []);

  return (
    <nav className="w-full h-20 bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 flex items-center justify-between px-4 md:px-6 shadow-2xl sticky top-0 z-50">
      {/* Left: Animated AKASH or Hamburger */}
      <div className="flex items-center">
        <div className="md:hidden mr-2">
          <button
            className="text-white text-3xl focus:outline-none"
            onClick={() => setShowMobileMenu((v) => !v)}
            aria-label="Open Menu"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
        <div ref={logoRef} className="hidden md:flex space-x-1 select-none">
          {'AKASH'.split('').map((char, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-widest animate-pulse hover:text-yellow-200 transition duration-300"
              style={{ textShadow: '0 2px 12px #f472b6' }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      {/* Center: Paper Generator */}
      <div className="flex-1 flex justify-center">
        <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-yellow-100 tracking-widest bg-pink-600/70 px-2 xs:px-4 py-1 xs:py-2 rounded-full shadow animate-bounce text-center" style={{letterSpacing:'0.18em'}}>
          PAPER GENERATOR
        </span>
      </div>
      {/* Right: Profile */}
      <div className="relative flex items-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-10 xs:w-12 h-10 xs:h-12 rounded-full border-4 border-pink-300 shadow-lg cursor-pointer object-cover hover:scale-105 transition"
          onClick={() => setShowMenu((v) => !v)}
        />
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 xs:w-48 bg-white rounded-xl shadow-xl border border-pink-100 py-2 z-50 animate-fadeIn">
            {profileLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 xs:px-6 py-2 xs:py-3 text-pink-700 font-semibold hover:bg-pink-50 hover:text-pink-900 rounded-xl transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg flex flex-col items-stretch px-4 py-2 z-50 animate-fadeIn">
          <div className="flex space-x-1 mb-4 justify-center">
            {'AKASH'.split('').map((char, i) => (
              <span
                key={i}
                className="text-2xl font-extrabold text-pink-500 drop-shadow-lg tracking-widest animate-pulse hover:text-yellow-400 transition duration-300"
                style={{ textShadow: '0 2px 12px #f472b6' }}
              >
                {char}
              </span>
            ))}
          </div>
          <span className="text-base font-bold text-yellow-700 tracking-widest bg-pink-100/80 px-2 py-1 rounded-full shadow mb-4 text-center" style={{letterSpacing:'0.15em'}}>PAPER GENERATOR</span>
          <div className="flex flex-col gap-2">
            {profileLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-pink-700 font-semibold hover:bg-pink-50 hover:text-pink-900 rounded-xl transition-all duration-200 text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

