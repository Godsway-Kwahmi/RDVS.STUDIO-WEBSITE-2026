const fs = require('fs');
let ts = fs.readFileSync('studio/schemas/project.ts', 'utf8');

const disciplinesStart = ts.indexOf('const DISCIPLINES = [');
const disciplinesEnd = ts.indexOf(']', disciplinesStart);

if (disciplinesStart !== -1 && disciplinesEnd !== -1) {
  const newDisciplines = `const DISCIPLINES = [
  {title: 'Architecture', value: 'architecture-planning'},
  {title: 'Competitions', value: 'competitions'},
  {title: 'Design + Build', value: 'turnkey-build'},
  {title: 'Digital & Web Design', value: 'web-design'},
  {title: 'Digital Illustration/ Art', value: 'digital-art'},
  {title: 'Graphic Design', value: 'graphic-design'},
  {title: 'Industrial & Furniture Design', value: 'industrial-design'},
  {title: 'Interior Architecture', value: 'interior-architecture'},
  {title: 'Interior Design', value: 'interior-design'},
  {title: 'Motion Design', value: 'motion-design'},
  {title: 'Visual Effects (VFX) & CGI', value: 'vfx-cgi'},
`;
  ts = ts.substring(0, disciplinesStart) + newDisciplines + ts.substring(disciplinesEnd);
  fs.writeFileSync('studio/schemas/project.ts', ts);
  console.log('✓ project.ts updated with alphabetical services');
} else {
  console.log('Failed to find DISCIPLINES in project.ts');
}
