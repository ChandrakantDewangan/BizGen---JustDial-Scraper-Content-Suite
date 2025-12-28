
import React, { useState } from 'react';
import { gemini } from './services/geminiService';
import { AppStatus, BusinessDetails } from './types';
import { JUSTDIAL_IMAGES } from './constants';

const DEWANGAN_DETAILS: BusinessDetails = {
  name: "Dewangan Cycle and Electronics",
  rating: "4.8",
  address: "Main Road, Bilaspur, Chhattisgarh, India",
  contact: "+91 98271 XXXXX",
  tags: ["Electronics Showroom", "Bicycles", "Home Appliances", "Cycle Shop"],
  reviewsCount: "500+"
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedAsset, setSelectedAsset] = useState(JUSTDIAL_IMAGES[0]);
  const [promoImage, setPromoImage] = useState<string | null>(null);
  const [style, setStyle] = useState('Premium Modern');
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePromoImage = async () => {
    setError(null);
    setStatus(AppStatus.GENERATING_IMAGE);
    try {
      const generated = await gemini.generatePromotionalImage(
        DEWANGAN_DETAILS, 
        selectedAsset.description, 
        style
      );
      setPromoImage(generated);
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError("AI generation failed. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">D</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Dewangan Ads Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Engine Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Create Professional Promotions</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Instantly generate high-resolution marketing graphics for <span className="text-indigo-600 font-bold">{DEWANGAN_DETAILS.name}</span>. 
            Choose a visual theme and click generate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="md:col-span-5 space-y-6">
            <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">1. Choose Visual Reference</h3>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {JUSTDIAL_IMAGES.map((asset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAsset(asset)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                      selectedAsset.url === asset.url ? 'border-indigo-600 scale-95 ring-4 ring-indigo-50' : 'border-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <img src={asset.url} alt="Reference" className="w-full h-full object-cover aspect-square" />
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">2. Select Poster Style</h3>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
              >
                <option>Premium Modern</option>
                <option>Cinematic Luxury</option>
                <option>High-Energy Sale</option>
                <option>Minimalist Aesthetic</option>
                <option>Vibrant & Bright</option>
              </select>

              <button
                onClick={handleGeneratePromoImage}
                disabled={status === AppStatus.GENERATING_IMAGE}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg text-white transition-all shadow-xl flex items-center justify-center gap-3 ${
                  status === AppStatus.GENERATING_IMAGE 
                    ? 'bg-slate-400 cursor-not-allowed translate-y-1' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] shadow-indigo-200'
                }`}
              >
                {status === AppStatus.GENERATING_IMAGE ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI Composing...
                  </>
                ) : (
                  <>✨ Generate AI Promo Image</>
                )}
              </button>
              {error && <p className="mt-4 text-red-500 text-xs font-bold text-center">{error}</p>}
            </section>
          </div>

          {/* Result Viewport */}
          <div className="md:col-span-7">
            {promoImage ? (
              <section className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                   <div>
                     <h3 className="text-xl font-black tracking-tight uppercase">Ready Asset</h3>
                     <p className="text-slate-400 text-[10px] font-bold mt-0.5">Custom Render for {DEWANGAN_DETAILS.name}</p>
                   </div>
                   <a 
                     href={promoImage} 
                     download="dewangan-promotion.png"
                     className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                   >
                     Download 4K
                   </a>
                </div>
                <div className="p-8 bg-slate-100 flex justify-center">
                   <div className="w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl ring-[12px] ring-white">
                     <img src={promoImage} alt="Generated Promo" className="w-full h-auto" />
                   </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-100">
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                     "This design integrates {DEWANGAN_DETAILS.name} brand identity with a {style} visual language. Optimized for social media engagement."
                   </p>
                </div>
              </section>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Poster Viewport</h3>
                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                  Click the button to start the AI generation process. Your custom business graphic will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 px-6 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Business Context Loaded
            </span>
          </div>
          <span>© 2024 Dewangan AI Studio</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
