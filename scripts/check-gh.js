const https = require('https');

https.get('https://api.github.com/repos/Godsway-Kwahmi/RDVS.STUDIO-WEBSITE-2026/commits?per_page=5', {
  headers: { 'User-Agent': 'node' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('GitHub commits response:');
      if (Array.isArray(json)) {
        json.forEach(c => console.log(c.sha, '|', c.commit.message, '|', c.commit.author.date));
      } else {
        console.log(json);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
