const fs = require('fs');

// 1. Update about.html text
let aboutHtml = fs.readFileSync('about.html', 'utf8');

const newAboutText = `<div class="editorial-text">
        <p class="editorial-lead">Designing and making things since 2009, Revival Design + VFX Studios (RDVS) is an independent, remote-first multidisciplinary studio. Originating in Accra, Ghana, our distributed practice transcends physical borders to undertake private residential estates, contemporary commercial headquarters, institutional landmarks, and cultural installations across West Africa and internationally.</p>
        
        <div class="editorial-body">
          <p>We are founded on the belief that spatial design cannot be detached from its physical reality. RDVS bridges the gap between speculative 3D conceptualization and tactile, site-built execution. We operate simultaneously as computational visualizers, spatial designers, and general contractors—seamlessly collaborating with licensed architects when a project's scale and vision demand it.</p>
          
          <h2 style="font-size: 1.125rem; font-weight: 400; margin: 32px 0 16px; color: var(--foreground);">The Closed-Loop Methodology</h2>
          <p>Our remote-first infrastructure empowers a truly closed-loop methodology. It ensures that every detail conceptualized within our digital studio environments is engineered with acoustic, structural, and material integrity long before breaking ground on site.</p>
          <p>Working collaboratively across technical disciplines from wherever we are, our team delivers turnkey projects that embody spatial clarity, quiet elegance, and enduring construction craft. Whether we are constructing physical spaces, rendering photorealistic virtual environments, or designing a brand's digital footprint, our work is intentionally designed to move the needle.</p>
        </div>
      </div>`;

// Replace the old editorial-text block
aboutHtml = aboutHtml.replace(/<div class="editorial-text">[\s\S]*?<\/div>\s*<\/div>/, newAboutText);

// Also replace Digital Illustration -> Digital Art in about.html
aboutHtml = aboutHtml.replace(/<h3>digital illustration\.<\/h3>/, '<h3>digital art.</h3>');

fs.writeFileSync('about.html', aboutHtml);
console.log('✓ Updated about.html');

// 2. Change "Digital Illustration/ Art" to "Digital Art" in work.html
let workHtml = fs.readFileSync('work.html', 'utf8');
workHtml = workHtml.replace(/>Digital Illustration\/ Art<\/button>/g, '>Digital Art</button>');
fs.writeFileSync('work.html', workHtml);
console.log('✓ Updated work.html');

// 3. Change in expertise.html
let expertiseHtml = fs.readFileSync('expertise.html', 'utf8');
expertiseHtml = expertiseHtml.replace(/>Digital Illustration\/ Art<\/a>/g, '>Digital Art</a>');
// Also update the description text block number 05 title comment
expertiseHtml = expertiseHtml.replace(/<!-- 05. Digital Illustration\/ Art -->/g, '<!-- 05. Digital Art -->');
fs.writeFileSync('expertise.html', expertiseHtml);
console.log('✓ Updated expertise.html');

// 4. Change in studio/schemas/project.ts
let projectTs = fs.readFileSync('studio/schemas/project.ts', 'utf8');
projectTs = projectTs.replace(/'Digital Illustration\/ Art'/g, "'Digital Art'");
fs.writeFileSync('studio/schemas/project.ts', projectTs);
console.log('✓ Updated project.ts');

