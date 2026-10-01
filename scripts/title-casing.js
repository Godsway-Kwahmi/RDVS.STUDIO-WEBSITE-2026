const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Known acronyms and abbreviations that MUST remain fully uppercase
const abbreviations = new Set([
  'AFG', 'DYV', 'ABL', 'MTN', 'PURC', 'HFC', 'WCIGL', 'HQ', 'VFX', 'CGI',
  'TVC', 'VR', 'IGL', 'NPA', 'RLG', '2GS', '5AAP', 'EIC', 'ERT', 'BFA',
  'RDVS', 'SMSGH', 'DETAILS', 'C25', 'B1', 'DRW', 'EHR', 'ACM', 'WHM',
  'KDMRD', 'HVL', 'MOTY', 'MIG', 'AV', 'LED', 'FF&E', 'GH', 'USA', 'UK'
]);

function toStudioTitleCase(title) {
  if (!title) return '';
  // Normalize punctuation/spacing: replace underscores with spaces, ensure + has surrounding spaces
  let text = title.replace(/_/g, ' ').replace(/\s*\+\s*/g, ' + ').replace(/\s+/g, ' ').trim();
  
  // Format each space-separated segment
  return text.split(' ').map(word => {
    if (word.includes('-')) {
      return word.split('-').map(part => formatSingleWord(part)).join('-');
    }
    return formatSingleWord(word);
  }).join(' ');
}

function formatSingleWord(word) {
  if (!word) return '';
  const cleanUpper = word.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (abbreviations.has(cleanUpper)) {
    return word.replace(new RegExp(cleanUpper, 'i'), cleanUpper);
  }
  // Pure numbers like 2012, 2024, 002, 41
  if (/^\d+$/.test(word)) {
    return word;
  }
  // Title Case: first letter capital, rest lowercase
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

console.log('Testing Title Casing examples:');
const testCases = [
  'YAO+YAA',
  'WEST_HILLS_MALL',
  'WEST_CANTONMENTS_IGL_PRESENTATION',
  'ADENTAN TOWNHOUSES',
  'ACCESS BANK IRIS',
  'AFG Executive Headquarters',
  '41 BARHAM',
  '2GS CONSTRUCTION+LOGISTICS',
  '5AAP',
  'B1 HQ LAGOS AVE',
  'DRW FURNART',
  'HFC TVC',
  'K LINE ARCHITECTS BAOBAB HOTEL INTERIORS PRESENTATION',
  'MTN ENV GRAPHICS',
  'NPA RECEPTION RENDERS',
  'ONEHIVE',
  'SMSGH HUBTEL',
  'VR PHOTOS',
  'VR SHOWCASE',
  'WCIGL'
];
testCases.forEach(t => console.log(`  ${t} -> ${toStudioTitleCase(t)}`));

// Export helper for next execution
module.exports = { toStudioTitleCase, abbreviations };
