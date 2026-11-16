import React from 'react';
import {
  UploadCloud,
  Cpu,
  Target,
  Send,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Resume',
      desc: 'Upload your existing PDF or DOCX resume. Our parser converts document tokens into structured candidate attributes.',
      icon: UploadCloud,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
      step: '02',
      title: 'Natural Language Skill Extraction',
      desc: 'Our NLP taxonomy extracts your technical frameworks, programming languages, database systems, degrees, and soft skills.',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
    {
      step: '03',
      title: 'TF-IDF Compatibility Scoring',
      desc: 'The matching engine computes a weighted compatibility percentage across all live jobs, identifying skill overlaps and missing gaps.',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      step: '04',
      title: 'Apply & Track Status',
      desc: 'Submit targeted applications with 1 click. Follow your hiring status across all 6 ATS stages from Under Review to Selected.',
      icon: Send,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          The Process
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          How VJOBAI Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          From document upload to interview shortlisting: our intelligent pipeline removes ambiguity and streamlines matching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
            >
              <span className="text-4xl font-black text-slate-100 dark:text-slate-800 absolute right-4 top-4 select-none">
                {s.step}
              </span>
              <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition"
        >
          Explore Jobs Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;

