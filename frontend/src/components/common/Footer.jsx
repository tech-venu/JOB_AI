import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} HireMatch AI. All rights reserved.</p>
        <p className="text-[11px] text-slate-400">Intelligent Recruitment & Career Matching Platform</p>
      </div>
    </footer>
  );
};

export default Footer;
