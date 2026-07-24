import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const TERMS = [
  { id: 'tesla', name: 'Tesla', color: '#3B82F6' },
  { id: 'bmw', name: 'BMW', color: '#EAB308' },
  { id: 'porsche', name: 'Porsche', color: '#8B5CF6' }
];

const DATE_PRESETS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '1y', days: 365 }
];

const getGranularityOptions = (days) => {
  if (days <= 1) return ['minute', 'hourly', 'daily'];
  if (days <= 7) return ['hourly', 'daily'];
  if (days <= 30) return ['daily', 'weekly'];
  if (days <= 90) return ['daily', 'weekly', 'monthly'];
  return ['daily', 'weekly', 'monthly'];
};

const getDefaultGranularity = (days) => {
  if (days <= 1) return 'hourly';
  if (days <= 30) return 'daily';
  if (days <= 90) return 'weekly';
  return 'monthly';
};

const generateMockData = (termName, startDate, endDate, granularity) => {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  let bucketCount;
  let bucketSize;

  switch (granularity) {
    case 'minute':
      bucketCount = Math.min(daysDiff * 24 * 60, 1440);
      bucketSize = 60 * 1000;
      break;
    case 'hourly':
      bucketCount = Math.min(daysDiff * 24, 168);
      bucketSize = 60 * 60 * 1000;
      break;
    case 'weekly':
      bucketCount = Math.ceil(daysDiff / 7);
      bucketSize = 7 * 24 * 60 * 60 * 1000;
      break;
    case 'monthly':
      bucketCount = Math.ceil(daysDiff / 30);
      bucketSize = 30 * 24 * 60 * 60 * 1000;
      break;
    case 'daily':
    default:
      bucketCount = daysDiff;
      bucketSize = 24 * 60 * 60 * 1000;
  }

  const baseVolume = Math.floor(Math.random() * 5000) + 1000;

  // Special case: Tesla starts with 0 values to demonstrate indexed mode edge case
  const zeroStartDays = termName === 'Tesla' ? 2 : 0;

  for (let i = 0; i < bucketCount; i++) {
    const bucketDate = new Date(start.getTime() + i * bucketSize);

    let volume;
    if (termName === 'Tesla' && i < zeroStartDays) {
      // Tesla starts with 0 mentions for first 2 days
      volume = 0;
    } else {
      const variance = Math.random() * 0.4 - 0.2;
      const trend = Math.sin(i / bucketCount * Math.PI * 2) * 0.3;
      volume = Math.floor(baseVolume * (1 + variance + trend));
    }

    data.push({
      date: bucketDate,
      volume,
      bucketIndex: i
    });
  }

  return data;
};

const formatDate = (date, granularity) => {
  const d = new Date(date);
  switch (granularity) {
    case 'minute':
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    case 'hourly':
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
    case 'weekly':
      return `${d.getMonth() + 1}/${d.getDate()}`;
    case 'monthly':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    case 'daily':
    default:
      return `${d.getMonth() + 1}/${d.getDate()}`;
  }
};

const formatRelativeLabel = (index, granularity) => {
  const num = index + 1;
  switch (granularity) {
    case 'minute':
      return `Min ${num}`;
    case 'hourly':
      return `Hour ${num}`;
    case 'weekly':
      return `Week ${num}`;
    case 'monthly':
      return `Month ${num}`;
    case 'daily':
    default:
      return `Day ${num}`;
  }
};

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

function ChipDropdown({ term, onToggleOverride, onRemove, onOpenCalendar }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: term.selected ? term.color : '#E5E7EB',
          color: term.selected ? 'white' : '#6B7280',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: term.selected ? 'white' : term.color
        }} />
        {term.name}
        {term.hasOverride && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
            <CalendarIcon />
          </div>
        )}
        <ChevronDown />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '4px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #E5E7EB',
          minWidth: '200px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <button
            onClick={() => {
              if (term.hasOverride) {
                // If already has override, just toggle it off
                onToggleOverride();
              } else {
                // If no override, enable it and open calendar
                onToggleOverride();
                setTimeout(() => {
                  onOpenCalendar();
                }, 50);
              }
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: 'none',
              backgroundColor: 'white',
              textAlign: 'left',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <CalendarIcon />
            {term.hasOverride ? 'Remove Override Date' : 'Override Date'}
          </button>

          {term.hasOverride && (
            <button
              onClick={() => {
                onOpenCalendar();
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'white',
                textAlign: 'left',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.15s',
                borderTop: '1px solid #F3F4F6'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Select Date Range
            </button>
          )}

          <button
            onClick={() => {
              onRemove();
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: 'none',
              backgroundColor: 'white',
              textAlign: 'left',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.15s',
              color: '#EF4444',
              borderTop: '1px solid #F3F4F6'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function DateRangeModal({ isOpen, onClose, term, onSave }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  useEffect(() => {
    if (isOpen && term) {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - (term.overrideDays || 7));

      setStartDate(formatDateInput(start));
      setEndDate(formatDateInput(today));
      setStartTime(term.startTime || '00:00');
      setEndTime(term.endTime || '23:59');
    }
  }, [isOpen, term]);

  const formatDateInput = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Select date range
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#6B7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              From
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              To
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              border: '1px solid #D1D5DB',
              backgroundColor: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              onSave(startDate, endDate, startTime, endTime);
              onClose();
            }}
            style={{
              padding: '10px 24px',
              border: 'none',
              backgroundColor: '#14B8A6',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              color: 'white'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrendChart() {
  const [globalDateRange, setGlobalDateRange] = useState(7);
  const [selectedTerms, setSelectedTerms] = useState(
    TERMS.map(term => ({
      ...term,
      selected: true,
      hasOverride: false,
      overrideDays: 7,
      startTime: '00:00',
      endTime: '23:59'
    }))
  );
  const [granularity, setGranularity] = useState('daily');
  const [viewMode, setViewMode] = useState('absolute'); // 'absolute' or 'indexed'
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTerm, setActiveTerm] = useState(null);

  const isNormalizedMode = selectedTerms.some(t => t.selected && t.hasOverride);

  const maxDaysInView = useMemo(() => {
    const activeDays = selectedTerms
      .filter(t => t.selected)
      .map(t => t.hasOverride ? t.overrideDays : globalDateRange);
    return Math.max(...activeDays, globalDateRange);
  }, [selectedTerms, globalDateRange]);

  const availableGranularities = useMemo(
    () => getGranularityOptions(maxDaysInView),
    [maxDaysInView]
  );

  React.useEffect(() => {
    const defaultGran = getDefaultGranularity(maxDaysInView);
    if (!availableGranularities.includes(granularity)) {
      setGranularity(defaultGran);
    }
  }, [maxDaysInView, availableGranularities, granularity]);

  const chartData = useMemo(() => {
    const today = new Date();
    const termsData = selectedTerms
      .filter(t => t.selected)
      .map(term => {
        const days = term.hasOverride ? term.overrideDays : globalDateRange;
        const endDate = new Date(today);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days);

        const data = generateMockData(term.name, startDate, endDate, granularity);

        return {
          termId: term.id,
          termName: term.name,
          color: term.color,
          data,
          startDate,
          endDate,
          days
        };
      });

    if (termsData.length === 0) return [];

    if (isNormalizedMode) {
      const maxBuckets = Math.max(...termsData.map(t => t.data.length));
      const normalized = [];

      for (let i = 0; i < maxBuckets; i++) {
        const bucket = {
          bucketIndex: i,
          relativeLabel: formatRelativeLabel(i, granularity)
        };

        let totalVolume = 0;
        termsData.forEach(term => {
          if (i < term.data.length) {
            const point = term.data[i];
            bucket[`${term.termId}_volume`] = point.volume;
            bucket[`${term.termId}_date`] = point.date;
            totalVolume += point.volume;
          }
        });

        termsData.forEach(term => {
          if (i < term.data.length && totalVolume > 0) {
            const volume = bucket[`${term.termId}_volume`];
            bucket[`${term.termId}_share`] = ((volume / totalVolume) * 100).toFixed(1);
          }
        });

        normalized.push(bucket);
      }

      const result = { mode: 'normalized', data: normalized, termsData };

      // Apply indexing if in indexed view mode
      if (viewMode === 'indexed') {
        applyIndexing(result);
      }

      return result;
    } else {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - globalDateRange);

      const buckets = new Map();

      termsData.forEach(term => {
        term.data.forEach(point => {
          const key = formatDate(point.date, granularity);
          if (!buckets.has(key)) {
            buckets.set(key, {
              dateLabel: key,
              date: point.date
            });
          }
          const bucket = buckets.get(key);
          bucket[`${term.termId}_volume`] = point.volume;
        });
      });

      buckets.forEach(bucket => {
        let totalVolume = 0;
        termsData.forEach(term => {
          const volume = bucket[`${term.termId}_volume`];
          if (volume) totalVolume += volume;
        });

        termsData.forEach(term => {
          const volume = bucket[`${term.termId}_volume`];
          if (volume && totalVolume > 0) {
            bucket[`${term.termId}_share`] = ((volume / totalVolume) * 100).toFixed(1);
          }
        });
      });

      const calendar = Array.from(buckets.values()).sort((a, b) => a.date - b.date);

      const result = { mode: 'calendar', data: calendar, termsData };

      // Apply indexing if in indexed view mode
      if (viewMode === 'indexed') {
        applyIndexing(result);
      }

      return result;
    }

    // Helper function to index the data
    function applyIndexing(result) {
      const { data, termsData } = result;

      // Get base values (first NON-ZERO value for each term)
      const baseValues = {};
      const baseIndices = {};

      termsData.forEach(term => {
        const firstNonZeroIndex = data.findIndex(bucket => {
          const vol = bucket[`${term.termId}_volume`];
          return vol && vol > 0;
        });

        if (firstNonZeroIndex !== -1) {
          baseValues[term.termId] = data[firstNonZeroIndex][`${term.termId}_volume`];
          baseIndices[term.termId] = firstNonZeroIndex;
        }
      });

      // Index all values - trim leading zeros by setting them to null
      data.forEach((bucket, index) => {
        termsData.forEach(term => {
          const volume = bucket[`${term.termId}_volume`];

          if (volume !== undefined && volume !== null) {
            // Check if we've reached the baseline yet
            const hasBaseline = baseIndices[term.termId] !== undefined;
            const reachedBaseline = hasBaseline && index >= baseIndices[term.termId];

            if (reachedBaseline && baseValues[term.termId] > 0) {
              // Calculate indexed value relative to first non-zero baseline
              bucket[`${term.termId}_indexed`] = ((volume / baseValues[term.termId]) * 100).toFixed(2);
            } else {
              // TRIM: Set to null so line doesn't appear before first non-zero value
              bucket[`${term.termId}_indexed`] = null;
            }
          }
        });
      });
    }
  }, [selectedTerms, globalDateRange, granularity, isNormalizedMode, viewMode]);

  const toggleOverride = (termId) => {
    setSelectedTerms(prev =>
      prev.map(t => t.id === termId ? { ...t, hasOverride: !t.hasOverride } : t)
    );
  };

  const removeTerm = (termId) => {
    setSelectedTerms(prev =>
      prev.map(t => t.id === termId ? { ...t, selected: false } : t)
    );
  };

  const openCalendarModal = (termId) => {
    const term = selectedTerms.find(t => t.id === termId);
    setActiveTerm(term);
    setModalOpen(true);
  };

  const handleDateSave = (start, end, startTime = '00:00', endTime = '23:59') => {
    // Date range calculation with time support
    const startParts = start.split('/');
    const endParts = end.split('/');
    if (startParts.length === 3 && endParts.length === 3) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      const startDate = new Date(startParts[2], startParts[1] - 1, startParts[0], startHour, startMin);
      const endDate = new Date(endParts[2], endParts[1] - 1, endParts[0], endHour, endMin);

      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (activeTerm) {
        setSelectedTerms(prev =>
          prev.map(t => t.id === activeTerm.id ? {
            ...t,
            overrideDays: diffDays,
            startTime,
            endTime
          } : t)
        );
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const totalVolume = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #3B82F6',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '280px'
      }}>
        {/* Title */}
        <div style={{
          fontWeight: 700,
          marginBottom: '12px',
          fontSize: '16px',
          color: '#1F2937'
        }}>
          {label}
        </div>

        {/* Terms */}
        {payload.map((entry, idx) => {
          const termId = entry.dataKey.replace('_volume', '').replace('_indexed', '');
          const term = chartData.termsData.find(t => t.termId === termId);
          if (!term) return null;

          const actualVolume = entry.payload[`${termId}_volume`];
          const indexedValue = entry.payload[`${termId}_indexed`];
          const displayValue = viewMode === 'indexed' ? indexedValue : actualVolume;
          const share = entry.payload[`${termId}_share`];
          const realDate = isNormalizedMode
            ? entry.payload[`${termId}_date`]
            : entry.payload.date;

          return (
            <div key={idx} style={{ marginBottom: '12px' }}>
              {/* Term name with dot */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: entry.color,
                  borderRadius: '50%'
                }} />
                <span style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#1F2937'
                }}>
                  {term.termName}
                </span>
              </div>

              {/* Date and metrics row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: '18px'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontWeight: 500
                }}>
                  Date: {formatDate(realDate, granularity)}
                </span>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {viewMode === 'indexed'
                      ? parseFloat(displayValue).toFixed(1)
                      : actualVolume?.toLocaleString() || '0'}
                  </span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {share}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const totalMentions = useMemo(() => {
    if (!chartData.termsData) return {};

    const totals = {};
    chartData.termsData.forEach(term => {
      const total = term.data.reduce((sum, point) => sum + point.volume, 0);
      totals[term.termId] = total;
    });
    return totals;
  }, [chartData]);

  // Calculate Y-axis max for indexed mode
  const yAxisDomain = useMemo(() => {
    if (viewMode !== 'indexed' || !chartData.data) {
      return [0, 'auto'];
    }

    // Find max indexed value across all terms
    let maxIndexed = 100; // Start at baseline
    chartData.data.forEach(bucket => {
      selectedTerms
        .filter(t => t.selected)
        .forEach(term => {
          const indexedValue = parseFloat(bucket[`${term.id}_indexed`]);
          if (indexedValue && !isNaN(indexedValue)) {
            maxIndexed = Math.max(maxIndexed, indexedValue);
          }
        });
    });

    // Add 20% padding
    const maxWithPadding = Math.ceil(maxIndexed * 1.2);
    return [0, maxWithPadding];
  }, [viewMode, chartData, selectedTerms]);

  return (
    <div style={{ padding: '0', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: '#6B7280' }}>
            Untitled Compare
          </h1>
          <select
            value={globalDateRange}
            onChange={(e) => setGlobalDateRange(Number(e.target.value))}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            <option value={0}>Today</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
        <button style={{
          backgroundColor: '#D946EF',
          color: 'white',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Save
        </button>
      </div>

      {/* Search Chips Bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {selectedTerms.filter(t => t.selected).map(term => (
          <ChipDropdown
            key={term.id}
            term={term}
            onToggleOverride={() => toggleOverride(term.id)}
            onRemove={() => removeTerm(term.id)}
            onOpenCalendar={() => openCalendarModal(term.id)}
          />
        ))}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px dashed #14B8A6',
          backgroundColor: 'transparent',
          color: '#14B8A6',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add
        </button>
      </div>

      {/* Chart Area */}
      <div style={{ padding: '24px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          border: '1px solid #E5E7EB'
        }}>
          {/* Chart Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, marginBottom: '12px' }}>
                Mentions Trend
              </h2>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {selectedTerms.filter(t => t.selected).map(term => (
                  <div key={term.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: term.color
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                      {term.name}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                      {((totalMentions[term.id] || 0) / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* View Mode: Absolute / Indexed */}
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option value="absolute">Absolute</option>
                <option value="indexed">Indexed</option>
              </select>

              {/* Granularity */}
              <select
                value={granularity}
                onChange={(e) => setGranularity(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  textTransform: 'capitalize'
                }}
              >
                {availableGranularities.map(gran => (
                  <option key={gran} value={gran}>
                    {gran.charAt(0).toUpperCase() + gran.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey={isNormalizedMode ? 'relativeLabel' : 'dateLabel'}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                angle={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                domain={yAxisDomain}
                tickFormatter={(value) =>
                  viewMode === 'indexed'
                    ? `${value.toFixed(0)}`
                    : `${(value / 1000).toFixed(0)}k`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedTerms
                .filter(t => t.selected)
                .map(term => {
                  // Find the last data point for this term
                  const termData = chartData.termsData.find(t => t.termId === term.id);
                  const lastIndex = termData ? termData.data.length - 1 : -1;

                  const dataKey = viewMode === 'indexed'
                    ? `${term.id}_indexed`
                    : `${term.id}_volume`;

                  return (
                    <Line
                      key={term.id}
                      type="monotone"
                      dataKey={dataKey}
                      name={term.name}
                      stroke={term.color}
                      strokeWidth={2}
                      dot={(props) => {
                        // Show dot only at the last point of this term's data
                        const checkKey = `${term.id}_volume`; // Always check volume for existence
                        if (props.payload[checkKey]) {
                          const isLastPoint = isNormalizedMode
                            ? props.index === lastIndex
                            : props.index === chartData.data.length - 1 ||
                              !chartData.data[props.index + 1]?.[checkKey];

                          if (isLastPoint) {
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={5}
                                fill={term.color}
                                stroke="white"
                                strokeWidth={2}
                              />
                            );
                          }
                        }
                        return null;
                      }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      connectNulls
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DateRangeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        term={activeTerm}
        onSave={handleDateSave}
      />
    </div>
  );
}
