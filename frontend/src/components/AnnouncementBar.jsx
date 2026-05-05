import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[#0F172A] overflow-hidden py-2">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex gap-8 text-xs font-medium text-white/90">
          <span>✨ 💎 ✨ In-House Manchester Lab ✨ 💎 ✨ Free UK Delivery Over £50 · £3.99 Standard Delivery ✨ 💎 ✨ 140+ 5-Star Reviews ✨ 💎 ✨ Save Money by Reglazing Your Own Frames ✨ 💎 ✨ 14-Day Money-Back Guarantee 💎</span>
          <span>✨ 💎 ✨ In-House Manchester Lab ✨ 💎 ✨ Free UK Delivery Over £50 · £3.99 Standard Delivery ✨ 💎 ✨ 140+ 5-Star Reviews ✨ 💎 ✨ Save Money by Reglazing Your Own Frames ✨ 💎 ✨ 14-Day Money-Back Guarantee 💎</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
