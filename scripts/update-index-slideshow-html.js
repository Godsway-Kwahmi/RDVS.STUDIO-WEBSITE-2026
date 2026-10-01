const fs = require('fs');
const path = require('path');

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Generate 20 slides
let slidesHtml = '';
for (let i = 0; i < 20; i++) {
  const num = String(i + 1).padStart(2, '0');
  const isActive = i === 0;
  slidesHtml += `        <!-- Slide ${num} -->\n`;
  slidesHtml += `        <article class="slide${isActive ? ' active' : ''}" data-index="${i}" ${isActive ? '' : 'aria-hidden="true" '}aria-label="Slide ${num}">\n`;
  slidesHtml += `          <div class="slide-media">\n`;
  slidesHtml += `            <img src="assets/images/hamlet/hamlet-estate.jpg" alt="Featured Work ${num}" class="slide-img" ${isActive ? 'fetchpriority="high"' : 'loading="lazy"'}>\n`;
  slidesHtml += `          </div>\n`;
  slidesHtml += `        </article>\n${i < 19 ? '\n' : ''}`;
}

// Generate 20 caption cards
let captionsHtml = '';
for (let i = 0; i < 20; i++) {
  const num = String(i + 1).padStart(2, '0');
  const isActive = i === 0;
  captionsHtml += `            <!-- Caption ${num} -->\n`;
  captionsHtml += `            <div class="caption-card${isActive ? ' active' : ''}" data-index="${i}">\n`;
  captionsHtml += `              <p class="project-category">Architecture — 2024</p>\n`;
  captionsHtml += `              <${isActive ? 'h1' : 'h2'} class="project-title">Featured Project ${num}</${isActive ? 'h1' : 'h2'}>\n`;
  captionsHtml += `              <div class="project-links">\n`;
  captionsHtml += `                <a href="work.html" class="project-action-link">View project &rarr;</a>\n`;
  captionsHtml += `                <button type="button" class="project-spec-trigger" data-index="${i}">Details</button>\n`;
  captionsHtml += `              </div>\n`;
  captionsHtml += `            </div>\n${i < 19 ? '\n' : ''}`;
}

// Generate 20 pagination bars
let paginationHtml = '              <!-- 20 Hairline Progress Indicators -->\n              <div class="pagination-bars" role="tablist" aria-label="Slide Selection">\n';
for (let i = 0; i < 20; i++) {
  const num = i + 1;
  const isActive = i === 0;
  paginationHtml += `                <button class="pagination-bar${isActive ? ' active' : ''}" data-index="${i}" role="tab" aria-label="Slide ${num}"><span class="pagination-fill"></span></button>\n`;
}
paginationHtml += '              </div>';

// Replace in index.html
// 1. Replace .hero-slider content
const sliderRegex = /(<div class="hero-slider">)[\s\S]*?(<\/div>\s*<!-- Minimalissimo Editorial Lower-Third Captions -->)/;
html = html.replace(sliderRegex, `$1\n${slidesHtml}      $2`);

// 2. Replace .caption-wrapper content
const captionRegex = /(<div class="caption-wrapper" aria-live="polite">)[\s\S]*?(<\/div>\s*<!-- Minimal Controls & Pagination -->)/;
html = html.replace(captionRegex, `$1\n${captionsHtml}          $2`);

// 3. Replace .slide-status
const statusRegex = /<div class="slide-status">[\s\S]*?<\/div>/;
const newStatus = `<div class="slide-status">\n                <span class="status-active">01</span>\n                <span>/</span>\n                <span class="status-total">20</span>\n              </div>`;
html = html.replace(statusRegex, newStatus);

// 4. Replace .pagination-bars
const paginationRegex = /<!-- 10 Hairline Progress Indicators -->[\s\S]*?<\/div>\s*(?=<!-- Understated Step Controls -->)/;
html = html.replace(paginationRegex, `${paginationHtml}\n\n`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Successfully expanded index.html slideshow to 20 slides');
