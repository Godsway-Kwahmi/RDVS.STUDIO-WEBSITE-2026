const fs = require('fs');
let html = fs.readFileSync('expertise.html', 'utf8');

const targetStr = `      <!-- 09. Turnkey Build -->
      <article class="expertise-row">
        <h2 class="expertise-name"><a href="work.html?service=turnkey-build" class="expertise-link">Design + Build</a></h2>
        <div class="expertise-desc">
          <p>Direct physical translation of digital architecture. As general contractors with integrated carpentry and fabrication shops, we oversee on-site trade coordination, custom timber milling, metalwork fabrication, and structural execution. We ensure what was visualized in 3D is realized identically in the physical world.</p>
          <a href="work.html?service=turnkey-build" class="expertise-view-link">View turnkey build projects &rarr;</a>
        </div>
      </article>`;

const competitionsHtml = `
      <!-- 10. Competitions -->
      <article class="expertise-row">
        <h2 class="expertise-name"><a href="work.html?service=competitions" class="expertise-link">Competitions</a></h2>
        <div class="expertise-desc">
          <p>Speculative architectural proposals, international design competitions, and conceptual masterplanning. We engage in theoretical and competitive architecture to explore innovative structural typologies, push environmental sustainability limits, and develop bold, unconstrained modernist interventions that shape the future of the built environment.</p>
          <a href="work.html?service=competitions" class="expertise-view-link">View competition entries &rarr;</a>
        </div>
      </article>`;

html = html.replace(targetStr, targetStr + '\n' + competitionsHtml);

fs.writeFileSync('expertise.html', html);
console.log('✓ expertise.html updated with Competitions');
