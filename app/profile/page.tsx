'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/Badge';

interface ProfileData {
  name: string;
  restrictions: string[];
  allergenSensitivity: 'low' | 'medium' | 'high';
  novaPreference: number; // Maximum acceptable NOVA group
  additiveBlacklist: string[];
  jurisdictionPref: 'US' | 'CA' | 'EU' | 'strict';
  scoreThreshold: number;
  notifications: {
    newRegulations: boolean;
    recallAlerts: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    shareUsage: boolean;
    trackAnalytics: boolean;
  };
}

const DEFAULT_PROFILE: ProfileData = {
  name: '',
  restrictions: [],
  allergenSensitivity: 'medium',
  novaPreference: 4,
  additiveBlacklist: [],
  jurisdictionPref: 'US',
  scoreThreshold: 6.0,
  notifications: {
    newRegulations: true,
    recallAlerts: true,
    weeklyDigest: false
  },
  privacy: {
    shareUsage: false,
    trackAnalytics: false
  }
};

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Kosher', 'Halal',
  'Keto', 'Paleo', 'Low-Sodium', 'Sugar-Free', 'Organic-Only', 'Non-GMO'
];

const COMMON_ADDITIVES = [
  'red 3', 'yellow 5', 'yellow 6', 'blue 1', 'blue 2',
  'bht', 'bha', 'tbhq', 'potassium bromate', 'brominated vegetable oil',
  'carrageenan', 'msg', 'aspartame', 'sucralose', 'high fructose corn syrup',
  'artificial flavors', 'artificial colors', 'preservatives', 'nitrates', 'nitrites'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('labelLensProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  const saveProfile = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('labelLensProfile', JSON.stringify(profile));
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const toggleRestriction = (restriction: string) => {
    const newRestrictions = profile.restrictions.includes(restriction)
      ? profile.restrictions.filter(r => r !== restriction)
      : [...profile.restrictions, restriction];
    updateProfile({ restrictions: newRestrictions });
  };

  const toggleAdditive = (additive: string) => {
    const newBlacklist = profile.additiveBlacklist.includes(additive)
      ? profile.additiveBlacklist.filter(a => a !== additive)
      : [...profile.additiveBlacklist, additive];
    updateProfile({ additiveBlacklist: newBlacklist });
  };

  const exportProfile = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `labellens-profile-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setProfile({ ...DEFAULT_PROFILE, ...imported });
        setHasChanges(true);
      } catch (error) {
        alert('Invalid profile file');
      }
    };
    reader.readAsText(file);
  };

  const resetProfile = () => {
    if (confirm('Reset all profile settings to defaults?')) {
      setProfile(DEFAULT_PROFILE);
      setHasChanges(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Your Profile</h1>
        <p className="text-slate-400">
          Customize LabelLens to match your dietary preferences, allergen sensitivities, 
          and regulatory concerns. Changes apply to all future analysis.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Display Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your name"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-300 mb-2">
                Primary Jurisdiction
              </label>
              <select
                id="jurisdiction"
                value={profile.jurisdictionPref}
                onChange={(e) => updateProfile({ jurisdictionPref: e.target.value as any })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States (FDA)</option>
                <option value="CA">Canada (Health Canada)</option>
                <option value="EU">European Union (EFSA)</option>
                <option value="strict">Most Restrictive (All jurisdictions)</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Determines which regulatory warnings are prioritized
              </p>
            </div>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Dietary Restrictions</h2>
          <p className="text-slate-400 text-sm mb-4">
            Select all that apply. LabelLens will flag ingredients that conflict with your diet.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {DIETARY_RESTRICTIONS.map((restriction) => (
              <button
                key={restriction}
                onClick={() => toggleRestriction(restriction)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  profile.restrictions.includes(restriction)
                    ? 'bg-green-600 text-white border border-green-500'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                }`}
                aria-pressed={profile.restrictions.includes(restriction)}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        {/* Sensitivity Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Sensitivity & Thresholds</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Allergen Alert Sensitivity
              </label>
              <div className="flex gap-4">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="allergenSensitivity"
                      value={level}
                      checked={profile.allergenSensitivity === level}
                      onChange={(e) => updateProfile({ allergenSensitivity: e.target.value as any })}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-white capitalize">{level}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Higher sensitivity shows warnings for trace amounts and cross-contamination
              </p>
            </div>

            <div>
              <label htmlFor="novaPreference" className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Acceptable NOVA Group: {profile.novaPreference}
              </label>
              <input
                id="novaPreference"
                type="range"
                min="1"
                max="4"
                value={profile.novaPreference}
                onChange={(e) => updateProfile({ novaPreference: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 - Unprocessed</span>
                <span>2 - Processed</span>
                <span>3 - Processed</span>
                <span>4 - Ultra-processed</span>
              </div>
            </div>

            <div>
              <label htmlFor="scoreThreshold" className="block text-sm font-medium text-slate-300 mb-2">
                Minimum Acceptable Score: {profile.scoreThreshold.toFixed(1)}
              </label>
              <input
                id="scoreThreshold"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={profile.scoreThreshold}
                onChange={(e) => updateProfile({ scoreThreshold: parseFloat(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0 - Any score</span>
                <span>5 - Moderate</span>
                <span>10 - Excellent only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additive Blacklist */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Personal Additive Blacklist</h2>
          <p className="text-slate-400 text-sm mb-4">
            Select additives you want to avoid completely. Products containing these will be flagged.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {COMMON_ADDITIVES.map((additive) => (
              <button
                key={additive}
                onClick={() => toggleAdditive(additive)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  profile.additiveBlacklist.includes(additive)
                    ? 'bg-red-600 text-white border border-red-500'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                }`}
                aria-pressed={profile.additiveBlacklist.includes(additive)}
              >
                {additive}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
          
          <div className="space-y-4">
            {Object.entries(profile.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    {key === 'newRegulations' && 'New Regulation Updates'}
                    {key === 'recallAlerts' && 'Food Recall Alerts'}
                    {key === 'weeklyDigest' && 'Weekly Analysis Digest'}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {key === 'newRegulations' && 'Get notified when new food safety regulations are enacted'}
                    {key === 'recallAlerts' && 'Alerts for products you\'ve analyzed that are recalled'}
                    {key === 'weeklyDigest' && 'Summary of your weekly analysis activity'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateProfile({
                    notifications: { ...profile.notifications, [key]: e.target.checked }
                  })}
                  className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
          
          <div className="space-y-4">
            {Object.entries(profile.privacy).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    {key === 'shareUsage' && 'Share Anonymous Usage Data'}
                    {key === 'trackAnalytics' && 'Enable Analytics Tracking'}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {key === 'shareUsage' && 'Help improve LabelLens by sharing anonymized usage patterns'}
                    {key === 'trackAnalytics' && 'Allow tracking for performance optimization'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateProfile({
                    privacy: { ...profile.privacy, [key]: e.target.checked }
                  })}
                  className="ml-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Profile Management */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Profile Management</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={saveProfile}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

            <button
              onClick={exportProfile}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              📁 Export Profile
            </button>

            <label className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors cursor-pointer">
              📂 Import Profile
              <input
                type="file"
                accept=".json"
                onChange={importProfile}
                className="hidden"
              />
            </label>

            <button
              onClick={resetProfile}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              🔄 Reset to Defaults
            </button>
          </div>

          {hasChanges && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
              <div className="text-amber-400 text-sm">
                [!] You have unsaved changes. Don't forget to save your profile!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
