'use client';

import { useState, useEffect } from 'react';

interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  region: 'US' | 'CA' | 'EU' | 'global';
  units: 'metric' | 'imperial';
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  analysis: {
    autoSave: boolean;
    showConfidence: boolean;
    enableExperimental: boolean;
    strictMode: boolean;
    showSources: boolean;
  };
  performance: {
    enableCaching: boolean;
    prefetchData: boolean;
    backgroundSync: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    usageStats: boolean;
    storeLocally: boolean;
  };
  notifications: {
    enabled: boolean;
    regulatory: boolean;
    recalls: boolean;
    updates: boolean;
  };
  exports: {
    defaultFormat: 'json' | 'csv' | 'pdf';
    includeMetadata: boolean;
    compressionLevel: number;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  region: 'US',
  units: 'metric',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  },
  analysis: {
    autoSave: true,
    showConfidence: true,
    enableExperimental: false,
    strictMode: false,
    showSources: true
  },
  performance: {
    enableCaching: true,
    prefetchData: true,
    backgroundSync: false
  },
  privacy: {
    analytics: false,
    crashReporting: true,
    usageStats: false,
    storeLocally: true
  },
  notifications: {
    enabled: true,
    regulatory: true,
    recalls: true,
    updates: false
  },
  exports: {
    defaultFormat: 'json',
    includeMetadata: true,
    compressionLevel: 1
  }
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState('general');

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('labelLensSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  const updateSettings = (updates: any) => {
    setSettings(prev => {
      const updated = { ...prev };
      
      // Handle nested updates
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          (updated as any)[key] = { ...(updated as any)[key], ...updates[key] };
        } else {
          (updated as any)[key] = updates[key];
        }
      });
      
      return updated;
    });
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('labelLensSettings', JSON.stringify(settings));
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', settings.theme);
      
      // Apply accessibility settings
      if (settings.accessibility.reducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }
      
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      setHasChanges(true);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `labellens-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...DEFAULT_SETTINGS, ...imported });
        setHasChanges(true);
      } catch (error) {
        alert('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { id: 'general', label: 'General', icon: '*' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'analysis', label: 'Analysis', icon: '🔬' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'exports', label: 'Export', icon: '📁' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
        <p className="text-slate-400">
          Customize LabelLens to match your preferences and workflow.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 sticky top-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span className="mr-3 text-lg">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSettings({ theme: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSettings({ language: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Regional Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Primary Region
                    </label>
                    <select
                      value={settings.region}
                      onChange={(e) => updateSettings({ region: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="EU">European Union</option>
                      <option value="global">Global</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Units
                    </label>
                    <select
                      value={settings.units}
                      onChange={(e) => updateSettings({ units: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="metric">Metric (g, mg, °C)</option>
                      <option value="imperial">Imperial (oz, lb, °F)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accessibility */}
          {activeSection === 'accessibility' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Accessibility Options</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.accessibility).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {key === 'highContrast' && 'High Contrast Mode'}
                        {key === 'largeText' && 'Large Text'}
                        {key === 'reducedMotion' && 'Reduce Motion'}
                        {key === 'screenReader' && 'Screen Reader Optimizations'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {key === 'highContrast' && 'Increase contrast for better visibility'}
                        {key === 'largeText' && 'Increase font sizes throughout the app'}
                        {key === 'reducedMotion' && 'Minimize animations and transitions'}
                        {key === 'screenReader' && 'Enhanced compatibility with screen readers'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings({
                        accessibility: { [key]: e.target.checked }
                      })}
                      className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Analysis */}
          {activeSection === 'analysis' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Analysis Behavior</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.analysis).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {key === 'autoSave' && 'Auto-save Analyses'}
                        {key === 'showConfidence' && 'Show Confidence Scores'}
                        {key === 'enableExperimental' && 'Enable Experimental Features'}
                        {key === 'strictMode' && 'Strict Analysis Mode'}
                        {key === 'showSources' && 'Show Data Sources'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {key === 'autoSave' && 'Automatically save analyses to history'}
                        {key === 'showConfidence' && 'Display AI confidence percentages'}
                        {key === 'enableExperimental' && 'Access beta features and algorithms'}
                        {key === 'strictMode' && 'Use strictest regulatory interpretations'}
                        {key === 'showSources' && 'Display regulatory and scientific sources'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings({
                        analysis: { [key]: e.target.checked }
                      })}
                      className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
          {activeSection === 'performance' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance Options</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.performance).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {key === 'enableCaching' && 'Enable Caching'}
                        {key === 'prefetchData' && 'Prefetch Common Data'}
                        {key === 'backgroundSync' && 'Background Sync'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {key === 'enableCaching' && 'Cache analyses for faster loading'}
                        {key === 'prefetchData' && 'Download common ingredients offline'}
                        {key === 'backgroundSync' && 'Sync data when app is in background'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings({
                        performance: { [key]: e.target.checked }
                      })}
                      className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Privacy Controls</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.privacy).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {key === 'analytics' && 'Anonymous Analytics'}
                        {key === 'crashReporting' && 'Crash Reporting'}
                        {key === 'usageStats' && 'Usage Statistics'}
                        {key === 'storeLocally' && 'Store Data Locally'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {key === 'analytics' && 'Help improve the app with anonymous usage data'}
                        {key === 'crashReporting' && 'Send crash reports to help fix bugs'}
                        {key === 'usageStats' && 'Share feature usage patterns'}
                        {key === 'storeLocally' && 'Keep all data on your device'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings({
                        privacy: { [key]: e.target.checked }
                      })}
                      className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {key === 'enabled' && 'Enable Notifications'}
                        {key === 'regulatory' && 'Regulatory Updates'}
                        {key === 'recalls' && 'Food Recalls'}
                        {key === 'updates' && 'App Updates'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {key === 'enabled' && 'Allow browser notifications from LabelLens'}
                        {key === 'regulatory' && 'New food safety regulations and bans'}
                        {key === 'recalls' && 'Recalls for products you\'ve analyzed'}
                        {key === 'updates' && 'New features and improvements'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings({
                        notifications: { [key]: e.target.checked }
                      })}
                      className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Export */}
          {activeSection === 'exports' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Export Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Default Export Format
                  </label>
                  <select
                    value={settings.exports.defaultFormat}
                    onChange={(e) => updateSettings({
                      exports: { defaultFormat: e.target.value }
                    })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Include Metadata</div>
                    <div className="text-slate-400 text-sm">
                      Include analysis timestamp, version, and other metadata
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.exports.includeMetadata}
                    onChange={(e) => updateSettings({
                      exports: { includeMetadata: e.target.checked }
                    })}
                    className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Compression Level: {settings.exports.compressionLevel}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={settings.exports.compressionLevel}
                    onChange={(e) => updateSettings({
                      exports: { compressionLevel: parseInt(e.target.value) }
                    })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>None</span>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Controls */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Settings Management</h2>
              <div className="flex gap-3">
                <button
                  onClick={exportSettings}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                >
                  📁 Export
                </button>
                
                <label className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  📂 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={resetSettings}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                Changes are saved automatically when you modify settings
              </div>
              <button
                onClick={saveSettings}
                disabled={!hasChanges || saveStatus === 'saving'}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  hasChanges
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {saveStatus === 'saving' && '⏳ Saving...'}
                {saveStatus === 'saved' && '[OK] Saved!'}
                {saveStatus === 'error' && '[ERROR] Error'}
                {saveStatus === 'idle' && (hasChanges ? 'Save Changes' : 'No Changes')}
              </button>
            </div>

            {hasChanges && (
              <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
                <div className="text-amber-400 text-sm">
                  [!] You have unsaved changes that will be lost if you navigate away.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
