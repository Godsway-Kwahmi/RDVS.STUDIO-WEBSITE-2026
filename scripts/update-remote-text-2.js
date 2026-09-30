const fs = require('fs');

let aboutHtml = fs.readFileSync('about.html', 'utf8');

const newAboutText = `<div class="editorial-text">
        <p class="editorial-lead">Designing and making things since 2009, Revival Design + VFX Studios (RDVS) is an independent, remote-first multidisciplinary studio. Originating in Accra, Ghana, our distributed practice transcends physical borders to undertake private residential estates, contemporary commercial headquarters, institutional landmarks, and cultural installations across West Africa and internationally.</p>
        
        <div class="editorial-body">
          <p>Spearheaded by its three founders—Kofi Tetteh, Jude Abbey, and Jude Nyoagbe—who share deep architectural backgrounds, RDVS is built on the belief that spatial design cannot be detached from its physical reality. We bridge the gap between speculative 3D conceptualization and tactile, site-built execution, operating simultaneously as computational visualizers, spatial designers, and general contractors—seamlessly collaborating with licensed architects when a project's scale and vision demand it.</p>
          
          <h2 style="font-size: 1.125rem; font-weight: 400; margin: 32px 0 16px; color: var(--foreground);">The Closed-Loop Methodology</h2>
          <p>Our remote-first infrastructure empowers a truly closed-loop methodology. It ensures that every detail conceptualized within our digital studio environments is engineered with acoustic, structural, and material integrity long before breaking ground on site.</p>
          <p>Working collaboratively across technical disciplines from wherever we are, our team delivers turnkey projects that embody spatial clarity, quiet elegance, and enduring construction craft. Whether we are constructing physical spaces, rendering photorealistic virtual environments, or designing a brand's digital footprint, our work is intentionally designed to move the needle.</p>
        </div>
      </div>`;

aboutHtml = aboutHtml.replace(/<div class="editorial-text">[\s\S]*?<\/div>\s*<\/div>/, newAboutText);

fs.writeFileSync('about.html', aboutHtml);
console.log('✓ Updated about.html with founders text');
