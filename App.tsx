
import React, { useState } from 'react';
import { analyzeHealthData } from './services/geminiService';
import { HealthData, GuardianResponse } from './types';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  RefreshCcw,
  Stethoscope,
  LayoutDashboard,
  BrainCircuit,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

type Page = 'monitoring' | 'analysis' | 'wellness';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('monitoring');
  const [formData, setFormData] = useState<HealthData>({
    symptoms: '',
    duration: '',
    intensity: 'moderate',
    age: '',
    gender: 'Other',
    history: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuardianResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeHealthData(formData);
      setResult(data);
      setCurrentPage('analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Analysis Engine Offline. Ensure your API_KEY environment variable is set in Vercel.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setCurrentPage('monitoring');
    setFormData({
      symptoms: '',
      duration: '',
      intensity: 'moderate',
      age: '',
      gender: 'Other',
      history: ''
    });
  };

  const renderStepper = () => {
    const steps = [
      { id: 'monitoring', label: 'Monitor', icon: LayoutDashboard },
      { id: 'analysis', label: 'Analyze', icon: BrainCircuit },
      { id: 'wellness', label: 'Wellness', icon: ClipboardList },
    ];

    return (
      <div className="max-w-3xl mx-auto mb-12 px-4">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ 
              width: currentPage === 'monitoring' ? '0%' : currentPage === 'analysis' ? '50%' : '100%' 
            }}
          ></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentPage === step.id;
            const isCompleted = (currentPage === 'analysis' && idx === 0) || (currentPage === 'wellness' && idx <= 1);
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isActive ? 'bg-blue-600 border-blue-100 text-white scale-110 shadow-lg ring-4 ring-white' : 
                    isCompleted ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentPage('monitoring')}>
            <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg group-hover:rotate-6 transition-transform">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Guardian <span className="text-blue-600">Sentinel</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               AI ENGINE ACTIVE
             </div>
             <button 
              onClick={resetForm}
              className="text-slate-400 hover:text-blue-600 transition-all p-2 rounded-xl hover:bg-blue-50"
              title="Reset Diagnostic"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {renderStepper()}

        {currentPage === 'monitoring' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Health Monitoring</h2>
                  <p className="text-sm text-slate-500">Stage 1: Symptom & History Logging</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Patient Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 30" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-semibold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Biological Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-semibold appearance-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Symptoms</label>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Describe your physical state (e.g. chronic cough, shortness of breath, joint pain...)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all min-h-[160px] font-semibold leading-relaxed" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 5 days" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-semibold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Severity</label>
                  <div className="flex gap-2">
                    {(['low', 'moderate', 'high'] as const).map((level) => (
                      <button key={level} type="button" onClick={() => setFormData(f => ({ ...f, intensity: level }))} className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all capitalize ${formData.intensity === level ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Chronic History</label>
                  <textarea name="history" value={formData.history} onChange={handleInputChange} placeholder="Existing conditions (e.g. Asthma, Diabetes), allergies, or medications..." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all h-28 font-semibold" />
                </div>

                {error && <div className="md:col-span-2 p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-4"><AlertCircle className="w-6 h-6 flex-shrink-0" /><p className="text-sm font-bold">{error}</p></div>}

                <button type="submit" disabled={loading} className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
                  {loading ? <><Activity className="w-6 h-6 animate-spin" /> SENTINEL ANALYZING...</> : <><Stethoscope className="w-6 h-6" /> START DIAGNOSTIC</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {currentPage === 'analysis' && result && (
          <div className="animate-fade-in space-y-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-2">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">Stage 2: Differential Diagnosis</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Diagnostic Analysis</h2>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentPage('monitoring')} className="px-6 py-4 rounded-2xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 flex items-center gap-2 transition-all uppercase text-xs tracking-widest"><ArrowLeft className="w-4 h-4" /> Edit Profile</button>
                <button onClick={() => setCurrentPage('wellness')} className="px-6 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 flex items-center gap-2 shadow-2xl shadow-blue-100 transition-all uppercase text-xs tracking-widest">Care Plan <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.analysis.map((item, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 p-4 rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.3em] ${item.urgency === 'High' || item.urgency === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.urgency}</div>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Potential Match</p>
                       <h4 className="text-2xl font-black text-slate-900 leading-tight">{item.condition}</h4>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                    <div className="pt-8 border-t border-slate-100 space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentinel Markers</p>
                      <ul className="space-y-3">
                        {item.keyInsights.map((insight, i) => (
                          <li key={i} className="text-xs text-slate-800 flex items-start gap-3 font-semibold"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0 shadow-sm" /> {insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-[2.5rem] p-10 border-2 border-amber-100/50 flex flex-col md:flex-row items-center gap-8 shadow-sm">
               <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 flex-shrink-0">
                 <AlertCircle className="w-10 h-10" />
               </div>
               <div className="space-y-3 text-center md:text-left">
                 <h4 className="text-xl font-black text-amber-900">Professional Verification Required</h4>
                 <p className="text-sm text-amber-800/80 font-medium leading-relaxed max-w-3xl">
                   The conditions listed above represent AI-driven probabilities based on common medical patterns. This sentinel engine cannot perform physical examinations or blood work. <b>Contact your local GP to formalize this triage.</b>
                 </p>
               </div>
            </div>
          </div>
        )}

        {currentPage === 'wellness' && result && (
          <div className="animate-fade-in space-y-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-2">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">Stage 3: Holistic Recovery</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Care Roadmap</h2>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentPage('analysis')} className="px-6 py-4 rounded-2xl border-2 border-slate-200 font-black text-slate-500 hover:bg-slate-50 flex items-center gap-2 transition-all uppercase text-xs tracking-widest"><ArrowLeft className="w-4 h-4" /> View Diagnostics</button>
                <button onClick={resetForm} className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 flex items-center gap-2 shadow-2xl transition-all uppercase text-xs tracking-widest"><RefreshCcw className="w-4 h-4" /> New Session</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-emerald-600"><div className="p-3 bg-emerald-50 rounded-2xl"><Heart className="w-7 h-7" /></div><h4 className="font-black text-2xl">Lifestyle</h4></div>
                    <ul className="space-y-5">
                      {result.wellnessPlan.lifestyleChanges.map((c, i) => <li key={i} className="text-sm text-slate-700 flex gap-4 font-bold items-start group"><span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">{i+1}</span> {c}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-blue-600"><div className="p-3 bg-blue-50 rounded-2xl"><ClipboardList className="w-7 h-7" /></div><h4 className="font-black text-2xl">Dietary</h4></div>
                    <ul className="space-y-5">
                      {result.wellnessPlan.dietaryAdvice.map((d, i) => <li key={i} className="text-sm text-slate-700 flex gap-4 font-bold items-start group"><span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all flex-shrink-0">{i+1}</span> {d}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-indigo-100 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                  <div className="space-y-3 text-center md:text-left">
                    <h4 className="font-black text-3xl">Expert Link</h4>
                    <p className="text-indigo-100 font-medium">Verify your AI report with a licensed professional.</p>
                  </div>
                  <a href="https://www.google.com/maps/search/medical+specialists+near+me" target="_blank" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl uppercase text-xs tracking-widest"><ExternalLink className="w-5 h-5" /> Consult Specialists</a>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-slate-900 text-white p-10 rounded-[3rem] space-y-10 shadow-2xl">
                  <h4 className="font-black text-xl flex items-center gap-3 text-blue-400 uppercase tracking-widest"><ShieldCheck className="w-6 h-6" /> Prevention</h4>
                  <div className="space-y-6">
                    {result.wellnessPlan.preventativeMeasures.map((m, i) => <div key={i} className="flex gap-4 items-start group"><CheckCircle2 className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" /><p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{m}</p></div>)}
                  </div>
                </div>
                <div className="p-8 bg-slate-200/50 rounded-[2rem] border-2 border-white text-[10px] text-slate-500 font-bold leading-relaxed text-center">
                  DIAGNOSTIC CORE v4.0.12 - GEMINI ARCHITECTURE
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-black text-slate-900 uppercase tracking-tighter text-xl">Sentinel <span className="text-blue-600">AI</span></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase">Built for Chrome Precision</p>
            <div className="flex gap-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
               <a href="#" className="hover:text-blue-600 transition-colors">Safety Protocol</a>
               <a href="#" className="hover:text-blue-600 transition-colors">Data Privacy</a>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500">
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
}
