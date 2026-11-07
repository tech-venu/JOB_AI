import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
  Bookmark,
  Building,
  MapPin,
  ChevronRight,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [meRes, resumesRes, recsRes, appsRes, savedRes] = await Promise.allSettled([
          api.get('/auth/me'),
          api.get('/resumes'),
          api.get('/recommendations/jobs'),
          api.get('/applications/my'),
          api.get('/jobs/saved'),
        ]);

        if (meRes.status === 'fulfilled' && meRes.value.success) {
          setProfile(meRes.value.data.profile);
        }
        if (resumesRes.status === 'fulfilled' && resumesRes.value.success) {
          setResumes(resumesRes.value.data || []);
        }
        if (recsRes.status === 'fulfilled' && recsRes.value.success) {
          setRecommendations(recsRes.value.data);
        }
        if (appsRes.status === 'fulfilled' && appsRes.value.success) {
          setApplications(appsRes.value.data || []);
        }
        if (savedRes.status === 'fulfilled' && savedRes.value.success) {
          setSavedJobs(savedRes.value.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    let score = 20; // Basic signup
    if (primaryResume) score += 30;
    if (profile?.primarySkills && profile.primarySkills.length > 0) score += 20;
    if (profile?.education && profile.education.length > 0) score += 15;
    if (profile?.location) score += 15;
    return Math.min(score, 100);
  };

  const completionRate = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-28 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 leading-relaxed">
            {profile?.headline || 'Your AI-powered career dashboard is actively matching your skills.'}
          </p>

          {/* Profile Completion Bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2 bg-indigo-950/60 rounded-full overflow-hidden border border-indigo-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-200">{completionRate}% Profile Completed</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link
            to="/jobseeker/resume"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-indigo-900 bg-white hover:bg-indigo-50 shadow-md transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            {primaryResume ? 'Manage Resume' : 'Upload Resume'}
          </Link>
          <Link
            to="/jobseeker/skill-gap"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/40 transition flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" /> Analyze Skill Gap
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Applied Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {applications.length}
          </p>
          <Link to="/jobseeker/applications" className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mt-1 block">
            View tracking timeline →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>High Matches</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {recommendations?.bestMatches?.length || 0}
          </p>
          <Link to="/jobseeker/recommendations" className="text-[11px] text-emerald-600 font-semibold hover:underline mt-1 block">
            Jobs matching &gt;65% →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Saved Jobs</span>
            <Bookmark className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {savedJobs.length}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">Bookmarked opportunities</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Resume Quality Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {primaryResume?.analysisResult?.overallScore || 0}%
          </p>
          <Link to="/jobseeker/resume" className="text-[11px] text-amber-600 font-semibold hover:underline mt-1 block">
            {primaryResume ? 'ATS optimization tips →' : 'Upload to score →'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Primary Resume Analysis & AI Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Primary Resume Snapshot */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Primary Resume Snapshot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {primaryResume ? primaryResume.originalFileName : 'No active resume uploaded yet'}
                </p>
              </div>
              <Link
                to="/jobseeker/resume"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Full Analysis <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {primaryResume ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Completeness</span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                      {primaryResume.analysisResult?.completenessScore || 0}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Readability</span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                      {primaryResume.analysisResult?.formattingScore || 0}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Skills Extracted</span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                      {primaryResume.parsedData?.technicalSkills?.length || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Key Extracted Technical Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(primaryResume.parsedData?.technicalSkills || []).slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Upload your resume to unlock automated compatibility scoring and skill gap analysis.
                </p>
                <Link
                  to="/jobseeker/resume"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Upload Resume
                </Link>
              </div>
            )}
          </div>

          {/* AI Recommended Jobs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> Best Matching Job Opportunities
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmically ranked based on your extracted resume profile.
                </p>
              </div>
              <Link
                to="/jobseeker/recommendations"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {(recommendations?.bestMatches || recommendations?.recommendedJobs || []).slice(0, 3).map((job) => (
                <div
                  key={job._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-300 transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        {job.workplaceType}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {job.company}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Match</span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                        {job.matchScore}%
                      </span>
                    </div>
                    <Link
                      to={`/jobs`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Applications Tracker & Quick AI Shortcuts */}
        <div className="space-y-8">
          {/* Recent Applications Tracking */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Active Applications
              </h3>
              <Link to="/jobseeker/applications" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                You have not submitted any applications yet.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app._id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {app.job?.title}
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{app.job?.company}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Match: <strong className="text-indigo-600 dark:text-indigo-400">{app.matchScore}%</strong></span>
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI Assistant Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Career Assistant
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask questions on interview preparation, resume enhancement, salary negotiation, or modern technical learning paths.
            </p>
            <Link
              to="/jobseeker/assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Start Career Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

