// Data is now embedded in data.js and loaded as global variables:
// - participantsData (from data.js)
// - resultsData (from data.js)  
// - checkpointsData (from data.js)

// Current race selection
let currentRace = 'tor330'; // Default race

// State
let processedData = [];
let processedDataWithSplits = []; // Pre-calculated split data
let filteredData = [];
let selectedCheckpoint = null; // Track selected checkpoint for sorting and highlighting
let activeFilters = {
  category: '',
  sex: '',
  country: '',
  search: ''
};

// DOM elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessageEl = document.getElementById('error-message');
const contentEl = document.getElementById('content');
const filtersContainerEl = document.getElementById('filters-container');
const searchFilterEl = document.getElementById('search-filter');
const categoryFilterEl = document.getElementById('category-filter');
const sexFilterEl = document.getElementById('sex-filter');
const countryFilterEl = document.getElementById('country-filter');
const resetFiltersEl = document.getElementById('reset-filters');
const distributionToggleEl = document.getElementById('distribution-toggle');
const distributionChartContainerEl = document.getElementById('distribution-chart-container');

// Utility functions
function showLoading() {
  loadingEl.style.display = 'flex';
  errorEl.style.display = 'none';
  contentEl.style.display = 'none';
}

function showError(message) {
  console.error('Error:', message);
  loadingEl.style.display = 'none';
  errorEl.style.display = 'flex';
  contentEl.style.display = 'none';
  errorMessageEl.textContent = message;
}

function showContent() {
  loadingEl.style.display = 'none';
  errorEl.style.display = 'none';
  contentEl.style.display = 'block';
}

// Format time from seconds to HH:MM:SS
function formatTime(seconds) {
  if (!seconds || seconds === 0) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format timestamp to time of day (HH:MM:SS) - add 1 hour for Italy time
function formatTimeOfDay(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  // Add 1 hour (3600000 milliseconds) to convert from UTC to Italy time
  date.setTime(date.getTime() + 3600000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Convert string to title case
// Map ISO country codes to friendly names (includes both ISO codes and Italian abbreviations)
const countryNameMap = {
  it: 'Italy',
  fr: 'France',
  jp: 'Japan',
  cn: 'China',
  gb: 'United Kingdom',
  us: 'United States',
  es: 'Spain',
  de: 'Germany',
  be: 'Belgium',
  ch: 'Switzerland',
  at: 'Austria',
  nl: 'Netherlands',
  ru: 'Russia',
  pl: 'Poland',
  cz: 'Czech Republic',
  sk: 'Slovakia',
  hu: 'Hungary',
  pt: 'Portugal',
  se: 'Sweden',
  fi: 'Finland',
  no: 'Norway',
  dk: 'Denmark',
  ie: 'Ireland',
  ua: 'Ukraine',
  ro: 'Romania',
  bg: 'Bulgaria',
  gr: 'Greece',
  tr: 'Turkey',
  il: 'Israel',
  au: 'Australia',
  ca: 'Canada',
  mx: 'Mexico',
  ar: 'Argentina',
  br: 'Brazil',
  cl: 'Chile',
  za: 'South Africa',
  in: 'India',
  kr: 'South Korea',
  hk: 'Hong Kong',
  sg: 'Singapore',
  th: 'Thailand',
  id: 'Indonesia',
  my: 'Malaysia',
  ph: 'Philippines',
  nz: 'New Zealand',
  ee: 'Estonia',
  lv: 'Latvia',
  lt: 'Lithuania',
  si: 'Slovenia',
  hr: 'Croatia',
  rs: 'Serbia',
  md: 'Moldova',
  by: 'Belarus',
  ge: 'Georgia',
  // Italian abbreviations
  ba: 'Bosnia and Herzegovina',
  co: 'Colombia',
  cr: 'Costa Rica',
  // Additional countries
  ad: 'Andorra',
  ae: 'United Arab Emirates',
  ec: 'Ecuador',
  gf: 'French Guiana',
  gt: 'Guatemala',
  ir: 'Iran',
  is: 'Iceland',
  jo: 'Jordan',
  lu: 'Luxembourg',
  ma: 'Morocco',
  mk: 'North Macedonia',
  np: 'Nepal',
  pe: 'Peru',
  pk: 'Pakistan',
  re: 'Réunion',
  sa: 'Saudi Arabia',
  sm: 'San Marino',
  uy: 'Uruguay',
  ve: 'Venezuela',
  vn: 'Vietnam',
  ao: 'Angola',
  kh: 'Cambodia',
  tw: 'Taiwan',
  unknown: 'Unknown'
};

function getCountryName(isoCode) {
  if (!isoCode) return 'Unknown';
  const code = isoCode.toLowerCase();
  return countryNameMap[code] || toTitleCase(code);
}
function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Get checkpoint name by rank/postazione number
function getCheckpointName(checkpointRank) {
  const checkpoints = window.checkpointsArray || [];
  const checkpoint = checkpoints.find(cp => cp.rank === checkpointRank);
  return checkpoint ? checkpoint.text : `CP${checkpointRank}`;
}

// Load embedded data (data.js provides global variables)
function loadData() {
  try {
    showLoading();
    console.log('Loading embedded data...');
    
    // Data is already loaded from data.js as global variables
    // Just need to extract the nested structures
    const participants = participantsData.iscritti || [];
    console.log('Participants data loaded:', participants.length, 'participants');
    if (participants.length > 0) {
      console.log('Sample participant:', participants[0]);
    }

    const results = (resultsData[0] && resultsData[0].result) || [];
    console.log('Results data loaded:', results.length, 'results');
    if (results.length > 0) {
      console.log('Sample result:', results[0]);
    }

    const checkpoints = checkpointsData.postazioni || [];
    console.log('Checkpoints data loaded:', checkpoints.length, 'checkpoints');
    if (checkpoints.length > 0) {
      console.log('Sample checkpoint:', checkpoints[0]);
    }

    // Store in module-level for access by other functions
    window.participantsArray = participants;
    window.resultsArray = results;
    window.checkpointsArray = checkpoints;

    return true;
  } catch (error) {
    showError(error.message);
    return false;
  }
}

// Process data to create visualization dataset
function processData() {
  console.log('Processing data...');
  
  // Use the extracted arrays
  const participants = window.participantsArray;
  const results = window.resultsArray;
  const checkpoints = window.checkpointsArray;
  
  // Create a map of participants by bib number (pettorale field)
  const participantsMap = new Map();
  participants.forEach(p => {
    // Convert boolean sesso to readable format (True = Male, False = Female based on convention)
    let sexLabel = 'Unknown';
    if (p.sesso === true) sexLabel = 'Male';
    else if (p.sesso === false) sexLabel = 'Female';
    
    participantsMap.set(p.pettorale, {
      bib: p.pettorale,
      name: `${p.nome} ${p.cognome}`,
      category: p.categoria || 'Unknown',
      sex: sexLabel,
  country: (p.nazionalita || p.nazione ||  'Unknown').toLowerCase()
    });
  });

  // Process results with timing data
  // The crono array contains timestamps, we need to calculate time from start
  processedData = results
    .filter(r => r.crono && Array.isArray(r.crono) && r.crono.length > 0)
    .map(result => {
      const participant = participantsMap.get(String(result.bib)) || {
        bib: result.bib,
        name: `Participant ${result.bib}`,
        category: 'Unknown',
        sex: 'Unknown',
        country: 'Unknown'
      };

      // Calculate elapsed time from start for each checkpoint
      const startTime = new Date(result.crono[0].tempo);
      const timings = result.crono.map((checkpoint, index) => {
        const checkpointTime = new Date(checkpoint.tempo);
        const elapsedSeconds = (checkpointTime - startTime) / 1000;
        
        return {
          checkpoint: checkpoint.postazione,
          time: elapsedSeconds,
          timestamp: checkpoint.tempo
        };
      });

      return {
        ...participant,
        position: result.posizione,
        totalTime: result.total_time,
        timings: timings
      };
    });

  console.log('Processed data:', processedData.length, 'participants with timing data');
  if (processedData.length > 0) {
    console.log('Sample participant data:', processedData[0]);
  }
  
  return processedData;
}

// Initialize filters with unique values from data
function initializeFilters() {
  // Get unique values
  const categories = [...new Set(processedData.map(p => p.category))].sort();
  const sexes = [...new Set(processedData.map(p => p.sex))].sort();
  const countries = [...new Set(processedData.map(p => p.country))].sort();

  // Populate category filter
  categoryFilterEl.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilterEl.appendChild(option);
  });

  // Populate sex filter
  sexFilterEl.innerHTML = '<option value="">All</option>';
  sexes.forEach(sex => {
    const option = document.createElement('option');
    option.value = sex;
    option.textContent = sex;
    sexFilterEl.appendChild(option);
  });

  // Populate country filter (sorted by display name)
  countryFilterEl.innerHTML = '<option value="">All Countries</option>';
  const countryOptions = countries.map(countryCode => ({
    code: countryCode,
    name: getCountryName(countryCode)
  })).sort((a, b) => a.name.localeCompare(b.name));
  
  countryOptions.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    countryFilterEl.appendChild(option);
  });

  // Add event listeners
  searchFilterEl.addEventListener('input', applyFilters);
  categoryFilterEl.addEventListener('change', applyFilters);
  sexFilterEl.addEventListener('change', applyFilters);
  countryFilterEl.addEventListener('change', applyFilters);
  resetFiltersEl.addEventListener('click', resetFilters);
}

// Apply filters to data
let filterTimeout;
function applyFilters() {
  // Show a subtle loading indicator
  const chartContainer = document.querySelector('.chart-container');
  chartContainer.style.opacity = '0.5';
  
  // Debounce to avoid rendering while user is still selecting
  clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => {
    activeFilters.search = searchFilterEl.value.trim();
    activeFilters.category = categoryFilterEl.value;
    activeFilters.sex = sexFilterEl.value;
    activeFilters.country = countryFilterEl.value;

    // Parse search terms (comma-separated)
    const searchTerms = activeFilters.search
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(term => term.length > 0);

    filteredData = processedData.filter(p => {
      // If search terms exist, participant must match at least one
      if (searchTerms.length > 0) {
        const nameMatch = searchTerms.some(term => 
          p.name.toLowerCase().includes(term)
        );
        const bibMatch = searchTerms.some(term => 
          p.bib.toString() === term
        );
        if (!nameMatch && !bibMatch) return false;
      }
      
      // Apply other filters
      if (activeFilters.category && p.category !== activeFilters.category) return false;
      if (activeFilters.sex && p.sex !== activeFilters.sex) return false;
      if (activeFilters.country && p.country !== activeFilters.country) return false;
      return true;
    });

    console.log(`Filtered data: ${filteredData.length} of ${processedData.length} participants`);
    renderVisualization();
    
    // Restore opacity after render
    chartContainer.style.opacity = '1';
  }, 150); // 150ms debounce
}

// Reset all filters
function resetFilters() {
  searchFilterEl.value = '';
  categoryFilterEl.value = '';
  sexFilterEl.value = '';
  countryFilterEl.value = '';
  activeFilters = {
    search: '',
    category: '',
    sex: '',
    country: ''
  };
  filteredData = processedData;
  renderVisualization();
}

// Render distribution chart
function renderDistributionChart() {
  const svg = d3.select('#distribution-chart');
  const container = document.getElementById('distribution-chart-container');
  
  console.log('Rendering distribution chart, container width:', container.clientWidth);
  console.log('Total processed data:', processedData.length);
  console.log('Sample participant:', processedData[0]);
  
  // Filter only finishers (those with totalTime AND a valid position - not DNF)
  const finishers = processedData.filter(d => {
    const hasTime = d.totalTime && d.totalTime !== null && d.totalTime !== undefined;
    const hasPosition = d.position !== null && d.position !== undefined;
    return hasTime && hasPosition;
  });
  
  console.log('Finishers found:', finishers.length);
  if (finishers.length > 0) {
    console.log('Sample finisher totalTime:', finishers[0].totalTime, 'type:', typeof finishers[0].totalTime);
    console.log('Sample finisher position:', finishers[0].position);
  }
  
  if (finishers.length === 0) {
    svg.selectAll('*').remove();
    svg.append('text')
      .attr('x', '50%')
      .attr('y', '50%')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted-foreground)')
      .text('No finisher data available');
    return;
  }
  
  // Convert times to hours and bin them
  const hourlyData = {};
  finishers.forEach((participant, idx) => {
    // totalTime is in format "X days HH:MM:SS.mmm" or "HH:MM:SS.mmm"
    let totalSeconds = 0;
    if (typeof participant.totalTime === 'string') {
      const timeStr = participant.totalTime;
      
      // Check if it includes days
      if (timeStr.includes('days') || timeStr.includes('day')) {
        const dayMatch = timeStr.match(/(\d+)\s+days?/);
        const timeMatch = timeStr.match(/(\d+):(\d+):(\d+)/);
        
        if (dayMatch && timeMatch) {
          const days = parseInt(dayMatch[1]);
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const seconds = parseInt(timeMatch[3]);
          
          totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
          
          // Debug first finisher
          if (idx === 0) {
            console.log('First finisher raw time:', timeStr);
            console.log('Parsed - days:', days, 'hours:', hours, 'minutes:', minutes, 'seconds:', seconds);
            console.log('Total seconds:', totalSeconds);
            console.log('Calculated hour bucket:', Math.floor(totalSeconds / 3600));
          }
        }
      } else {
        // Just "HH:MM:SS" format
        const parts = timeStr.split(':');
        if (parts.length >= 3) {
          totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
        }
      }
    } else {
      totalSeconds = participant.totalTime;
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    hourlyData[hours] = (hourlyData[hours] || 0) + 1;
  });
  
  // Find the range of hours (from 0 to max hour with finishers)
  const maxHour = Math.max(...Object.keys(hourlyData).map(h => parseInt(h)));
  
  console.log('Hour 65 count:', hourlyData[65]);
  console.log('Hour 66 count:', hourlyData[66]);
  console.log('All hours with data:', Object.keys(hourlyData).sort((a, b) => a - b));
  
  // Create complete data array from 0 to maxHour, filling in zeros for empty slots
  const data = [];
  for (let hour = 0; hour <= maxHour; hour++) {
    data.push({
      hour: hour,
      count: hourlyData[hour] || 0
    });
  }
  
  console.log('Distribution data (with gaps filled):', data);
  console.log('Data entries 64-67:', data.slice(64, 68));
  
  // Dimensions - use a minimum width if container width is 0
  const containerWidth = container.clientWidth || 800;
  const width = Math.max(containerWidth - 40, 400);
  const height = 300;
  const margin = { top: 20, right: 40, bottom: 60, left: 60 }; // Increased bottom margin for rotated labels
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Clear previous chart
  svg.selectAll('*').remove();
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.hour))
    .range([0, chartWidth])
    .padding(0.2);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([chartHeight, 0]);
  
  // Axes
  const xAxis = d3.axisBottom(xScale)
    .tickValues(data.filter((d, i) => i % 5 === 0).map(d => d.hour))
    .tickFormat(d => `${d}`);
  
  const yAxis = d3.axisLeft(yScale)
    .ticks(5);
  
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '11px')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '.5em')
    .attr('transform', 'rotate(-90)');
  
  g.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', '12px');
  
  // Axis labels
  g.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', chartHeight + 50)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', '600')
    .style('fill', 'var(--foreground)')
    .text('Finish Time (hours)');
  
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -chartHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', '600')
    .style('fill', 'var(--foreground)')
    .text('Number of Finishers');
  
  // Bars
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.hour))
    .attr('y', d => yScale(d.count))
    .attr('width', xScale.bandwidth())
    .attr('height', d => chartHeight - yScale(d.count))
    .attr('fill', 'var(--primary)')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .on('mouseenter', function(event, d) {
      d3.select(this)
        .attr('opacity', 1)
        .attr('fill', 'var(--accent)');
    })
    .on('mouseleave', function() {
      d3.select(this)
        .attr('opacity', 0.8)
        .attr('fill', 'var(--primary)');
    });
  
  // Bar labels
  g.selectAll('.bar-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('x', d => xScale(d.hour) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.count) - 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('fill', 'var(--foreground)')
    .text(d => d.count);
}

// Generate color for participant line
function getParticipantColor(index, total) {
  const hue = (index / total) * 360;
  return d3.hsl(hue, 0.7, 0.5).toString();
}

// Render the D3 visualization
function renderVisualization() {
  const svg = d3.select('#chart');
  const container = document.querySelector('.chart-container');
  
  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  const width = isMobile 
    ? container.clientWidth - 20  // No extra width on mobile
    : (container.clientWidth - 20) * 1.4; // 40% wider on desktop
  
  // Use filtered data for rendering - always use filteredData once filters have been initialized
  const dataToRender = filteredData;
  
  // Dynamic height based on number of participants
  const barHeight = 20;
  const barPadding = 4;
  const participantHeight = barHeight + barPadding;
  const chartHeight = dataToRender.length * participantHeight;
  const height = chartHeight + 100; // Add space for axes
  
  const margin = { 
    top: 40, 
    right: isMobile ? 20 : 200, 
    bottom: 60, 
    left: isMobile ? 150 : 300  // Smaller left margin on mobile
  };
  const chartWidth = width - margin.left - margin.right;

  svg.selectAll('*').remove();
  svg.attr('viewBox', `0 0 ${width} ${height}`);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Check if there are no results
  if (dataToRender.length === 0) {
    g.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted-foreground)')
      .style('font-size', '1.2rem')
      .text('No participants match the selected filters');
    
    g.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 130)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted-foreground)')
      .style('font-size', '0.9rem')
      .text('Try adjusting your filters or click "Reset Filters"');
    return;
  }

  // Sort participants by highest checkpoint reached (descending), then by total time (ascending)
  // DNF participants (null position) go to the end
  const sortedData = [...dataToRender].sort((a, b) => {
    const aIsDNF = a.position === null || a.position === undefined;
    const bIsDNF = b.position === null || b.position === undefined;
    
    // DNF participants always go after finishers
    if (aIsDNF && !bIsDNF) return 1;
    if (!aIsDNF && bIsDNF) return -1;
    
    // Get the highest checkpoint number reached by each participant
    const aMaxCheckpoint = Math.max(...a.timings.map(t => t.checkpoint));
    const bMaxCheckpoint = Math.max(...b.timings.map(t => t.checkpoint));
    
    // First sort by highest checkpoint reached (higher checkpoint first)
    if (bMaxCheckpoint !== aMaxCheckpoint) {
      return bMaxCheckpoint - aMaxCheckpoint;
    }
    
    // Then sort by total elapsed time (faster first)
    const aTime = a.timings[a.timings.length - 1]?.time || 0;
    const bTime = b.timings[b.timings.length - 1]?.time || 0;
    return aTime - bTime;
  });

  // Calculate split times (time between consecutive checkpoints)
  const dataWithSplits = sortedData.map(participant => {
    const splits = [];
    // Sort by timestamp to handle out-of-order checkpoint recordings
    const sortedTimings = [...participant.timings].sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeA - timeB;
    });
    
    // Filter out checkpoints that are out of chronological order
    // (e.g., passing back through a checkpoint after finishing)
    const filteredTimings = [];
    let lastTime = 0;
    
    for (let i = 0; i < sortedTimings.length; i++) {
      const timing = sortedTimings[i];
      
      // If this is the last checkpoint (highest checkpoint number), always include it
      const isFinishCheckpoint = timing.checkpoint === Math.max(...participant.timings.map(t => t.checkpoint));
      
      if (isFinishCheckpoint) {
        // For finish checkpoint, use it and stop processing further checkpoints
        filteredTimings.push(timing);
        break;
      } else if (timing.time >= lastTime) {
        // Only include if time is progressing forward
        filteredTimings.push(timing);
        lastTime = timing.time;
      } else {
        console.log(`Filtering out anomalous checkpoint for bib ${participant.bib}: CP${timing.checkpoint} at ${timing.timestamp}`);
      }
    }
    
    // Now calculate splits from filtered timings
    for (let i = 0; i < filteredTimings.length; i++) {
      const currentTime = filteredTimings[i].time;
      const previousTime = i > 0 ? filteredTimings[i - 1].time : 0;
      const splitTime = Math.max(0, currentTime - previousTime); // Ensure non-negative split time
      
      splits.push({
        checkpoint: filteredTimings[i].checkpoint,
        splitTime: splitTime,
        cumulativeTime: currentTime,
        timestamp: filteredTimings[i].timestamp
      });
    }
    
    return {
      ...participant,
      splits: splits,
      totalElapsed: filteredTimings.length > 0 ? filteredTimings[filteredTimings.length - 1].time : 0,
      checkpointCount: filteredTimings.length,
      maxCheckpoint: Math.max(...filteredTimings.map(t => t.checkpoint))
    };
  });

  // If a checkpoint is selected, re-sort by that checkpoint's split time
  if (selectedCheckpoint !== null) {
    dataWithSplits.sort((a, b) => {
      const aSplit = a.splits.find(s => s.checkpoint === selectedCheckpoint);
      const bSplit = b.splits.find(s => s.checkpoint === selectedCheckpoint);
      
      // Participants without this checkpoint go to the end
      if (!aSplit && !bSplit) return 0;
      if (!aSplit) return 1;
      if (!bSplit) return -1;
      
      // Sort by split time at this checkpoint (faster first)
      return aSplit.splitTime - bSplit.splitTime;
    });
  }

  // Get all unique checkpoints
  const allCheckpoints = [...new Set(processedData.flatMap(p => p.timings.map(t => t.checkpoint)))].sort((a, b) => a - b);
  
  // Create scales
  const yScale = d3.scaleBand()
    .domain(dataWithSplits.map((d, i) => i))
    .range([0, chartHeight])
    .padding(0.1);

  const maxTime = d3.max(dataWithSplits, d => d.totalElapsed);
  const xScale = d3.scaleLinear()
    .domain([0, maxTime])
    .range([0, chartWidth]);

  // Color function for checkpoints
  // Rest sections (OUT checkpoints) = deep red
  // Racing sections = shades of green
  function getCheckpointColor(checkpointRank) {
    const checkpointName = getCheckpointName(checkpointRank);
    const isRestSection = checkpointName.includes('OUT');
    
    if (isRestSection) {
      // Deep red for all rest sections
      return '#b71c1c';
    } else {
      // Shades of green for racing sections
      const greens = [
        '#2d5016', '#3d6b1f', '#4d8629', '#5ea032', '#6ebb3c',
        '#7fd645', '#90f04f', '#a5f570', '#baf991', '#cffcb2',
        '#1a4d0a', '#2a6314', '#3a791e', '#4a8f28', '#5aa532',
        '#6abb3c', '#7ad146', '#8ae750', '#9afd5a', '#aafe70'
      ];
      return greens[checkpointRank % greens.length];
    }
  }

  // Add grid lines
  g.append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(xScale.ticks(10))
    .enter()
    .append('line')
    .attr('class', 'grid-line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', chartHeight);

  // Add axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d => formatTime(d));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d, i) => {
      const participant = dataWithSplits[i];
      const position = participant.position !== null && participant.position !== undefined ? `${participant.position}. ` : '';
      const dnf = participant.position === null || participant.position === undefined ? ' DNF' : '';
      return `${position}${participant.name} (${participant.bib})${dnf}`;
    });

  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(xAxis);

  g.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '10px' : '14px')
    .each(function(d, i) {
      const participant = dataWithSplits[i];
      const isDNF = participant.position === null || participant.position === undefined;
      
      if (isDNF) {
        // Color the DNF part in red using tspan
        const text = d3.select(this);
        const fullText = text.text();
        const textBeforeDNF = fullText.replace(' DNF', '');
        
        text.text(''); // Clear the text
        
        // Add the main text
        text.append('tspan')
          .text(textBeforeDNF);
        
        // Add DNF in red
        text.append('tspan')
          .style('fill', '#b71c1c')
          .style('font-weight', 'bold')
          .text(' DNF');
      }
    });

  // Add axis labels
  g.append('text')
    .attr('class', 'axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', chartWidth / 2)
    .attr('y', chartHeight + 50)
    .text('Elapsed Time from Start');

  // Get or create tooltip (reuse existing one)
  let tooltip = d3.select('body').select('.tooltip');
  if (tooltip.empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

  // Add hover events to y-axis labels to show all splits
  g.select('.axis')
    .selectAll('text')
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      const i = d; // d is the index
      const participant = dataWithSplits[i];
      
      // Build tooltip content with all splits
      let splitsHTML = participant.splits.map(split => {
        const checkpointName = getCheckpointName(split.checkpoint);
        return `
          <div style="display: flex; justify-content: space-between; gap: 1rem; margin: 0.25rem 0;">
            <span><strong>${checkpointName}</strong> (CP${split.checkpoint})</span>
            <span>Split: ${formatTime(split.splitTime)} | Cumulative: ${formatTime(split.cumulativeTime)} | Time: ${formatTimeOfDay(split.timestamp)}</span>
          </div>
        `;
      }).join('');
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      
      tooltip.html(`
        <div class="tooltip-name">#${participant.bib} ${participant.name}${participant.position === null || participant.position === undefined ? ' [DNF]' : ''}</div>
        <div class="tooltip-time">Category: ${participant.category} | Sex: ${participant.sex} | Country: ${getCountryName(participant.country)}</div>
        <div class="tooltip-time">Position: ${participant.position !== null && participant.position !== undefined ? participant.position : 'DNF'}</div>
        <div class="tooltip-time">Max Checkpoint: ${participant.maxCheckpoint}</div>
        <div class="tooltip-time">Checkpoints Recorded: ${participant.checkpointCount}</div>
        <div style="margin-top: 0.5rem; border-top: 1px solid var(--border); padding-top: 0.5rem;">
          <strong>All Splits:</strong>
          ${splitsHTML}
        </div>
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });

  // Draw stacked bars for each participant
  dataWithSplits.forEach((participant, index) => {
    let cumulativeX = 0;
    
    participant.splits.forEach((split, splitIndex) => {
      const checkpointIndex = allCheckpoints.indexOf(split.checkpoint);
      const color = getCheckpointColor(split.checkpoint);
      const barWidth = Math.max(0, xScale(split.splitTime)); // Ensure non-negative width
      
      // Only draw if width is positive
      if (barWidth > 0) {
        g.append('rect')
          .attr('class', 'bar-segment')
          .attr('x', cumulativeX)
          .attr('y', yScale(index))
          .attr('width', barWidth)
          .attr('height', yScale.bandwidth())
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5)
          .attr('data-bib', participant.bib)
          .attr('data-checkpoint', split.checkpoint)
          .style('opacity', 0.8)
          .style('cursor', 'pointer')
          .on('click', function(event) {
            const clickedCheckpoint = split.checkpoint;
            
            // Toggle selection
            if (selectedCheckpoint === clickedCheckpoint) {
              selectedCheckpoint = null;
            } else {
              selectedCheckpoint = clickedCheckpoint;
            }
            
            // Re-render to apply new sorting
            renderVisualization();
            
            event.stopPropagation();
          })
          .on('mouseover', function(event) {
            d3.select(this)
              .attr('stroke', '#000')
              .attr('stroke-width', 2);
            
            tooltip.transition()
              .duration(200)
              .style('opacity', 1);
            
            tooltip.html(`
              <div class="tooltip-name">#${participant.bib} ${participant.name}${participant.position === null || participant.position === undefined ? ' [DNF]' : ''}</div>
              <div class="tooltip-time">Category: ${participant.category} | Sex: ${participant.sex} | Country: ${participant.country}</div>
              <div class="tooltip-time">Position: ${participant.position !== null && participant.position !== undefined ? participant.position : 'DNF'}</div>
              <div class="tooltip-time">Max Checkpoint: ${participant.maxCheckpoint}</div>
              <div class="tooltip-time">Checkpoints Recorded: ${participant.checkpointCount}</div>
              <div class="tooltip-time"><strong>${getCheckpointName(split.checkpoint)}</strong> (CP${split.checkpoint})</div>
              <div class="tooltip-time">Split: ${formatTime(split.splitTime)}</div>
              <div class="tooltip-time">Cumulative: ${formatTime(split.cumulativeTime)}</div>
              <div class="tooltip-time">Time of Day: ${formatTimeOfDay(split.timestamp)}</div>
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--muted-foreground);">Click to compare this checkpoint across all participants</div>
            `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mouseout', function() {
            // Only reset stroke if not selected
            if (selectedCheckpoint !== split.checkpoint) {
              d3.select(this)
                .attr('stroke', 'white')
                .attr('stroke-width', 0.5);
            }
            
            tooltip.transition()
              .duration(200)
              .style('opacity', 0);
          });
      }
      
      cumulativeX += barWidth;
    });
  });

  // Apply highlighting if a checkpoint is selected
  if (selectedCheckpoint !== null) {
    // Dim all segments
    d3.selectAll('.bar-segment')
      .style('opacity', 0.3)
      .attr('stroke-width', 0.5)
      .attr('stroke', 'white');
    // Highlight matching checkpoint across all participants
    d3.selectAll(`.bar-segment[data-checkpoint="${selectedCheckpoint}"]`)
      .style('opacity', 1)
      .attr('stroke-width', 2)
      .attr('stroke', '#000');
  }

  console.log('Stacked bar visualization rendered successfully');
}

// Render legend
function renderLegend() {
  // Get all unique checkpoints
  const allCheckpoints = [...new Set(processedData.flatMap(p => p.timings.map(t => t.checkpoint)))].sort((a, b) => a - b);

  legendEl.innerHTML = `
    <div class="legend-title">Checkpoint Colors</div>
    <div style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
      <span style="color: #2d5016; font-weight: 600;">■</span> Green shades = Racing sections &nbsp;&nbsp;
      <span style="color: #ff4444; font-weight: 600;">■</span> Red shades = Rest sections (OUT checkpoints)
    </div>
    <div class="legend-items">
      ${allCheckpoints.map((checkpoint) => {
        const color = getCheckpointColor(checkpoint);
        const name = getCheckpointName(checkpoint);
        return `
          <div class="legend-item">
            <div class="legend-color" style="background-color: ${color}"></div>
            <div class="legend-name">${name} (CP${checkpoint})</div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--muted-foreground);">
      Each horizontal bar shows a participant's race progress. Bar segments represent time spent between checkpoints (split times).
    </div>
  `;
}

// Initialize app
function init() {
  console.log('Initializing TOR2025 Stats App...');
  
  const success = loadData();
  if (!success) return;

  const processed = processData();
  if (!processed || processed.length === 0) {
    showError('No timing data available');
    return;
  }

  showContent();
  
  // Initialize filters and set initial filtered data to all data
  filteredData = processedData;
  initializeFilters();
  setupDistributionToggle();
  renderVisualization();
  
  console.log('App initialized successfully!');
}

// Setup distribution chart toggle
function setupDistributionToggle() {
  distributionToggleEl.addEventListener('click', () => {
    const isExpanded = distributionChartContainerEl.style.display !== 'none';
    
    if (isExpanded) {
      // Collapse
      distributionChartContainerEl.style.display = 'none';
      distributionToggleEl.classList.remove('expanded');
    } else {
      // Expand
      distributionChartContainerEl.style.display = 'block';
      distributionToggleEl.classList.add('expanded');
      // Use setTimeout to ensure container is visible and has dimensions
      setTimeout(() => renderDistributionChart(), 10);
    }
  });
}

// Handle race toggle
function setupRaceToggle() {
  const toggleBtns = document.querySelectorAll('.race-toggle-btn');
  
  // Check URL parameter for race selection
  const urlParams = new URLSearchParams(window.location.search);
  const raceParam = urlParams.get('race') || 'tor330';
  currentRace = raceParam;
  
  // Update active button based on current race
  toggleBtns.forEach(btn => {
    if (btn.dataset.race === currentRace) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Add click handlers
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const race = btn.dataset.race;
      if (race === currentRace) return; // Already selected
      
      // Reload page with new race parameter
      const url = new URL(window.location);
      url.searchParams.set('race', race);
      window.location.href = url.toString();
    });
  });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (processedData.length > 0) {
      renderVisualization();
    }
  }, 250);
});

// Start the app
setupRaceToggle();
init();
