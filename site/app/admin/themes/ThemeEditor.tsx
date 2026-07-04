"use client";
import React, { useState, useEffect } from 'react';
import { apiPath, browserApiFetch } from '@/lib/api/browserApi';
 
import { Save, UploadCloud, AlertCircle } from 'lucide-react';

interface ThemeRow {
  id: string;
  name: string;
  is_active: boolean;
}

type TabType = 'woods' | 'metals' | 'fabrics' | 'lighting';

export function ThemeEditor() {
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('woods');
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await browserApiFetch(apiPath('/api/admin/themes'));
        const data = await res.json();
        if (data.success && Array.isArray(data.themes)) {
          setThemes(data.themes);
        }
      } catch (_err) {
        setThemes([]);
      } finally {
        setLoading(false);
      }
    }
    loadThemes();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-100 rounded-xl" />;
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const dummyTokens = {
        "wsSurfaceBase": "var(--color-ecru-300)",
        "wsSurfaceGrain": "var(--color-ecru-400)",
        "wsEdgeBanding": "var(--color-ecru-500)",
        "shadowColorHeavy": "var(--shadow-tint-pdp-28)"
      };
      
      const res = await browserApiFetch(apiPath('/api/admin/themes/publish'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeName: 'premium-light', tokens: dummyTokens })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Success! Theme deployed to Edge CDN:\n${data.url}`);
      } else {
        alert(`Error publishing: ${data.error}`);
      }
    } catch (_err) {
      alert(`Network error`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-3 space-y-4">
        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition">
          + Create New Theme
        </button>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {themes.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No themes found in database. Please run the Supabase migration.</div>
          ) : (
             themes.map(t => (
               <div key={t.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition">
                 <span className="font-medium text-slate-800">{t.name}</span>
                 {t.is_active && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">Live</span>}
               </div>
             ))
          )}
        </div>
      </div>

      <div className="col-span-9">
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 p-4 flex justify-between items-center">
               <h2 className="text-lg font-semibold text-slate-800">Edit Theme Tokens</h2>
               <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition">
                    <Save size={16} /> Save Draft
                  </button>
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-700 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <UploadCloud size={16} /> 
                    {isPublishing ? "Publishing..." : "Publish to Planners"}
                  </button>
               </div>
            </div>
            
            <div className="flex border-b border-slate-200 px-4">
               {['woods', 'metals', 'fabrics', 'lighting'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as TabType)}
                   className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="p-6 min-h-[31.25rem]">
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3 text-blue-800">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm">
                    <strong>Architecture Note:</strong> Modifying these tokens will update the 3D meshes and 2D canvas dynamically across Buddy Planner and Oando Planner.
                  </p>
               </div>

               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                 <p className="italic">Material property editor UI components will render here...</p>
                 <p className="text-sm mt-2">Waiting for Database Sync to populate JSON dictionary.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}