import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Edit3,
  Trash2,
  Download,
  Award,
  BookOpen,
  Briefcase,
  X,
  Plus,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import api from '../../services/api';

const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);

  // Manual correction modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    technicalSkills: '',
    softSkills: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes');
      if (res.success) {
        setResumes(res.data);
        if (res.data.length > 0) {
          setSelectedResume(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['pdf', 'docx', 'doc'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadError('Invalid file format. Please upload a PDF or DOCX resume.');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
        setResumes((prev) => [res.data, ...prev]);
        setSelectedResume(res.data);
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload and parse resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      const updated = resumes.filter((r) => r._id !== id);
      setResumes(updated);
      setSelectedResume(updated[0] || null);
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const openEditModal = () => {
    if (!selectedResume) return;
    const parsed = selectedResume.parsedData || {};
    setEditFormData({
      name: parsed.name || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      location: parsed.location || '',
      technicalSkills: (parsed.technicalSkills || []).join(', '),
      softSkills: (parsed.softSkills || []).join(', '),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveManualCorrection = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const updatedParsedData = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        location: editFormData.location,
        technicalSkills: editFormData.technicalSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
        softSkills: editFormData.softSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
      };

      const res = await api.put(`/resumes/${selectedResume._id}/parsed-data`, {
        parsedData: updatedParsedData,
      });

      if (res.success) {
        setSelectedResume(res.data);
        setResumes((prev) => prev.map((r) => (r._id === res.data._id ? res.data : r)));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save edits');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Intelligent Resume Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload PDF/DOCX resumes for NLP entity extraction, ATS quality scoring, and manual verification.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition">
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Parsing Resume...' : 'Upload New Resume'}</span>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 font-medium">
          {uploadError}
        </div>
      )}

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ) : resumes.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Resume Uploaded Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload your PDF or DOCX resume to test our AI entity parser and automated ATS screening engine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Resumes List selector (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Uploaded Documents ({resumes.length})
            </h3>
            <div className="space-y-2.5">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => setSelectedResume(resume)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedResume?._id === resume._id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center uppercase font-bold text-xs">
                      {resume.fileType}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {resume.originalFileName}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {(resume.fileSize / 1024).toFixed(0)} KB • {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteResume(resume._id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Parsed Entities & AI Quality Report (col 8) */}
          {selectedResume && (
            <div className="lg:col-span-8 space-y-6">
              {/* Top Banner: Score & Manual Edit Trigger */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    AI Resume Quality Score
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {selectedResume.analysisResult?.overallScore || 0}%
                    </span>
                    <span className="text-xs text-slate-500">
                      (Completeness: {selectedResume.analysisResult?.completenessScore || 0}%, Formatting: {selectedResume.analysisResult?.formattingScore || 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openEditModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Correct Extracted Details
                  </button>
                </div>
              </div>

              {/* Parsed Contact & Profile Details */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Contact Information Identified
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResume.parsedData?.name || 'Not detected'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {selectedResume.parsedData?.email || 'Not detected'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResume.parsedData?.phone || 'Not detected'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResume.parsedData?.location || 'Not detected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Technical & Soft Skills Extracted
                </h3>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-2">Technical Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedResume.parsedData?.technicalSkills || []).map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      >
                        {s}
                      </span>
                    ))}
                    {(selectedResume.parsedData?.technicalSkills || []).length === 0 && (
                      <span className="text-xs text-slate-400 italic">No technical skills detected.</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-2">Soft Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedResume.parsedData?.softSkills || []).map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                    {(selectedResume.parsedData?.softSkills || []).length === 0 && (
                      <span className="text-xs text-slate-400 italic">No soft skills detected.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Improvement Assistant Findings */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI Resume Improvement Suggestions
                </h3>

                {/* Measurable Achievements */}
                <div className="flex items-center gap-2 text-xs">
                  {selectedResume.analysisResult?.measurableAchievementsFound ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Quantifiable metrics & achievements detected.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                      <AlertTriangle className="w-4 h-4" /> Few quantifiable metrics detected. Add percentages or scale numbers.
                    </span>
                  )}
                </div>

                {/* Suggestions List */}
                <div className="space-y-2 pt-2">
                  {(selectedResume.analysisResult?.suggestedImprovements || []).map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Correction Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Correct Parsed Resume Details
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualCorrection} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={editFormData.technicalSkills}
                  onChange={(e) => setEditFormData({ ...editFormData, technicalSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Soft Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={editFormData.softSkills}
                  onChange={(e) => setEditFormData({ ...editFormData, softSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  {saveLoading ? 'Saving...' : 'Save & Re-Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
