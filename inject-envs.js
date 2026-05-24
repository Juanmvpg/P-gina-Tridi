const fs = require('fs');
const path = require('path');

const files = ['index.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const envs = {
      'URL_NEWSLETTER': process.env.URL_NEWSLETTER || 'https://proyectotridi.my.canva.site/',
      'URL_TINKERCAD': process.env.URL_TINKERCAD || 'https://www.tinkercad.com/',
      'URL_FILMINAS': process.env.URL_FILMINAS || 'https://canva.link/kuge1m3si5tnzl6'
    };

    console.log(`Processing ${file}...`);
    Object.keys(envs).forEach(key => {
      const placeholder = `%${key}%`;
      const value = envs[key];
      // Use split/join to replace all occurrences safely across Node versions
      content = content.split(placeholder).join(value);
      console.log(`  Replacing ${placeholder} with: ${value}`);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully injected environment variables into ${file}\n`);
  }
});
