'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/Badge';

// Timeline data for regulatory changes
const REGULATORY_TIMELINE = [
  {
    date: '2024-01-01',
    region: 'US',
    change: 'FDA announces review of artificial food dyes',
    additives: ['Red 3', 'Yellow 5', 'Yellow 6'],
    impact: 'Under review for potential restrictions'
  },
  {
    date: '2024-10-01',
    region: 'US',
    change: 'FDA bans brominated vegetable oil',
    additives: ['Brominated Vegetable Oil'],
    impact: 'Complete ban implemented'
  },
  {
    date: '2027-01-01',
    region: 'CA',
    change: 'California AB 418 takes effect',
    additives: ['Red 3', 'Potassium Bromate', 'Brominated Vegetable Oil', 'Propylparaben'],
    impact: 'Banned in all California food products'
  },
  {
    date: '2025-07-01',
    region: 'EU',
    change: 'Updated titanium dioxide regulations',
    additives: ['Titanium Dioxide'],
    impact: 'Further restrictions on nanoparticle forms'
  },
  {
    date: '2026-01-01',
    region: 'US',
    change: 'Proposed PFAS regulations',
    additives: ['PFAS compounds'],
    impact: 'Potential restrictions on food packaging'
  },
  {
    date: '2028-01-01',
    region: 'EU',
    change: 'Enhanced novel food regulations',
    additives: ['Novel synthetic additives'],
    impact: 'Stricter approval process for new additives'
  }
];

const ADDITIVE_STATUS_TIMELINE = {
  'Red 3': {
    '2024-01-01': { US: 'allowed', CA: 'allowed', EU: 'allowed' },
    '2027-01-01': { US: 'allowed', CA: 'banned', EU: 'allowed' },
    '2028-01-01': { US: 'restricted', CA: 'banned', EU: 'allowed' }
  },
  'Brominated Vegetable Oil': {
    '2024-01-01': { US: 'restricted', CA: 'allowed', EU: 'banned' },
    '2024-10-01': { US: 'banned', CA: 'allowed', EU: 'banned' },
    '2027-01-01': { US: 'banned', CA: 'banned', EU: 'banned' }
  },
  'Potassium Bromate': {
    '2024-01-01': { US: 'allowed', CA: 'allowed', EU: 'banned' },
    '2027-01-01': { US: 'allowed', CA: 'banned', EU: 'banned' },
    '2028-01-01': { US: 'restricted', CA: 'banned', EU: 'banned' }
  },
  'Titanium Dioxide': {
    '2024-01-01': { US: 'allowed', CA: 'allowed', EU: 'restricted' },
    '2025-07-01': { US: 'allowed', CA: 'allowed', EU: 'restricted' },
    '2027-01-01': { US: 'allowed', CA: 'allowed', EU: 'restricted' }
  }
};

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState('2025-01-01');
  const [pinnedDate, setPinnedDate] = useState<string | null>(null);
  const [selectedAdditive, setSelectedAdditive] = useState<string | null>(null);
  const router = useRouter();

  const minDate = '2024-01-01';
  const maxDate = '2028-12-31';

  // Convert date to display format
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status for an additive at a specific date
  const getStatusAtDate = (additive: string, date: string) => {
    const timeline = ADDITIVE_STATUS_TIMELINE[additive as keyof typeof ADDITIVE_STATUS_TIMELINE];
    if (!timeline) return null;

    const dates = Object.keys(timeline).sort();
    let applicableDate = dates[0];

    for (const timelineDate of dates) {
      if (timelineDate <= date) {
        applicableDate = timelineDate;
      } else {
        break;
      }
    }

    return timeline[applicableDate as keyof typeof timeline];
  };

  // Get changes happening on or around a date
  const getChangesForDate = (date: string) => {
    const targetDate = new Date(date);
    const window = 30; // 30 days before/after

    return REGULATORY_TIMELINE.filter(change => {
      const changeDate = new Date(change.date);
      const diffDays = Math.abs((targetDate.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= window;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed': return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'banned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const additives = Object.keys(ADDITIVE_STATUS_TIMELINE);
  const changesForDate = getChangesForDate(selectedDate);

  const handleExportSnapshot = () => {
    const params = new URLSearchParams({
      date: selectedDate,
      snapshot: 'true'
    });
    router.push(`/report?${params}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        const currentDate = new Date(selectedDate);
        currentDate.setMonth(currentDate.getMonth() - 1);
        if (currentDate >= new Date(minDate)) {
          setSelectedDate(currentDate.toISOString().split('T')[0]);
        }
      }
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        const currentDate = new Date(selectedDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate <= new Date(maxDate)) {
          setSelectedDate(currentDate.toISOString().split('T')[0]);
        }
      }
      if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
          e.preventDefault();
          setPinnedDate(pinnedDate === selectedDate ? null : selectedDate);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, pinnedDate, minDate, maxDate]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Regulatory Time Machine</h1>
        <p className="text-slate-400 mb-4">
          See how changing food regulations affect ingredient status across different jurisdictions over time. 
          Use the slider to explore past and future regulatory landscapes.
        </p>
        <div className="text-sm text-slate-500">
          ← → Arrow keys to navigate months | Space to pin date | Current view: {formatDate(selectedDate)}
        </div>
      </div>

      {/* Time Slider */}
      <div className="mb-8 bg-slate-800 rounded-lg p-8">
        <div className="mb-6">
          <label htmlFor="date-slider" className="block text-lg font-medium text-white mb-4">
            Timeline: {formatDate(selectedDate)}
            {pinnedDate && (
              <span className="ml-3 text-sm text-blue-400">📌 Pinned</span>
            )}
          </label>
          
          <div className="relative">
            <input
              id="date-slider"
              type="range"
              min={new Date(minDate).getTime()}
              max={new Date(maxDate).getTime()}
              value={new Date(selectedDate).getTime()}
              onChange={(e) => {
                const timestamp = parseInt(e.target.value);
                const date = new Date(timestamp);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              aria-valuetext={formatDate(selectedDate)}
            />
            
            {/* Timeline markers */}
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>2024</span>
              <span>2025</span>
              <span>2026</span>
              <span>2027</span>
              <span>2028</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setPinnedDate(pinnedDate === selectedDate ? null : selectedDate)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pinnedDate === selectedDate 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {pinnedDate === selectedDate ? '📌 Unpin Date' : '📌 Pin Date'}
          </button>
          
          <button
            onClick={handleExportSnapshot}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          >
            📄 Export Snapshot
          </button>
        </div>
      </div>

      {/* Regulatory Changes for Selected Date */}
      {changesForDate.length > 0 && (
        <div className="mb-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">
            Regulatory Changes Near {formatDate(selectedDate)}
          </h2>
          <div className="space-y-4">
            {changesForDate.map((change, index) => (
              <div key={index} className="bg-blue-800/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-blue-300">{formatDate(change.date)}</div>
                    <div className="text-sm text-blue-400">{change.region}</div>
                  </div>
                  <Badge text={change.region} tone="ok" />
                </div>
                <div className="text-white font-medium mb-2">{change.change}</div>
                <div className="text-blue-200 text-sm mb-2">{change.impact}</div>
                <div className="flex flex-wrap gap-2">
                  {change.additives.map((additive, idx) => (
                    <Badge key={idx} text={additive} tone="warn" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additive Status Table */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Additive Status at {formatDate(selectedDate)}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-3 text-white font-medium">Additive</th>
                <th className="text-center p-3 text-white font-medium">United States</th>
                <th className="text-center p-3 text-white font-medium">California</th>
                <th className="text-center p-3 text-white font-medium">European Union</th>
                <th className="text-center p-3 text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {additives.map((additive) => {
                const status = getStatusAtDate(additive, selectedDate);
                return (
                  <tr key={additive} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedAdditive(selectedAdditive === additive ? null : additive)}
                        className="text-left text-white font-medium hover:text-blue-400 transition-colors"
                      >
                        {additive}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      {status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.US)}`}>
                          {status.US.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.CA)}`}>
                          {status.CA.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.EU)}`}>
                          {status.EU.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const sampleIngredient = `Water, sugar, ${additive.toLowerCase()}, salt`;
                          const params = new URLSearchParams({ 
                            q: sampleIngredient,
                            date: selectedDate 
                          });
                          router.push(`/results?${params}`);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                        title="Analyze sample with this additive"
                      >
                        🔬 Analyze
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additive Timeline Detail */}
      {selectedAdditive && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedAdditive} Timeline
          </h3>
          
          <div className="space-y-4">
            {Object.entries(ADDITIVE_STATUS_TIMELINE[selectedAdditive as keyof typeof ADDITIVE_STATUS_TIMELINE] || {})
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, status]) => (
                <div key={date} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg">
                  <div className="text-white font-medium min-w-[120px]">
                    {formatDate(date)}
                  </div>
                  <div className="flex gap-2 flex-1">
                    <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(status.US)}`}>
                      US: {status.US.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(status.CA)}`}>
                      CA: {status.CA.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(status.EU)}`}>
                      EU: {status.EU.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor('allowed')}`}>
              ALLOWED
            </span>
            <span className="text-slate-400 text-sm">Generally permitted for use</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor('restricted')}`}>
              RESTRICTED
            </span>
            <span className="text-slate-400 text-sm">Limited use or pending changes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor('banned')}`}>
              BANNED
            </span>
            <span className="text-slate-400 text-sm">Prohibited for use in food</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
          <p>
            <strong>Note:</strong> This timeline represents general regulatory trends and major policy changes. 
            Actual implementation dates and specific restrictions may vary. Always consult official regulatory 
            sources for current requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
