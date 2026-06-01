const fs = require('fs');
const path = require('path');

const files = ['index.html', 'recursos.html', 'lineamientos.html', 'panel.html', 'login.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const envs = {
      'URL_NEWSLETTER': process.env.URL_NEWSLETTER || 'https://proyectotridi.my.canva.site/',
      'URL_TINKERCAD': process.env.URL_TINKERCAD || 'https://www.tinkercad.com/',
      'URL_FILMINAS': process.env.URL_FILMINAS || 'https://canva.link/kuge1m3si5tnzl6',
      'URL_VIDEOTUTORIALES': process.env.URL_VIDEOTUTORIALES || 'https://drive.google.com/drive/folders/1O82aKVfCP3JqR8bUhE4y9Jy9My5HXZmu?usp=sharing',
      'URL_PRESENTACIONES': process.env.URL_PRESENTACIONES || 'https://docs.google.com/document/d/133DJ-1A8vmaM4WfvWOOMq3ZHMEIoHd3sP47rxDQYvY8/edit?usp=sharing',
      'URL_CONTENIDO_COMPLETO': process.env.URL_CONTENIDO_COMPLETO || 'https://drive.google.com/drive/folders/1Z8ams6Vv-Mt8fqJnFdD2GGf4McPxVfRF?usp=sharing',
      'URL_SPREADSHEET': process.env.URL_SPREADSHEET || 'https://docs.google.com/spreadsheets/d/1SxucJUDXjgqRuSRcbtFh-zy4OnVYOoqsz67SCetbN0A/export?format=csv',
      'URL_CRONOGRAMA': process.env.URL_CRONOGRAMA || 'https://docs.google.com/spreadsheets/d/1e3bOS0IgtFsuKGqu28vhPJORfwWV29A7wyfTYnGibEA/export?format=csv',
      'URL_REPORTE_FALLAS': process.env.URL_REPORTE_FALLAS || 'https://docs.google.com/forms/d/e/1FAIpQLSca1WG1YBkjE8jMsJWqLb9yDkMH1VgWLalM_NMo5jezxbMOzQ/viewform?usp=publish-editor'
    };

    console.log(`Processing ${file}...`);
    Object.keys(envs).forEach(key => {
      const placeholder = `%${key}%`;
      const value = envs[key];
      content = content.split(placeholder).join(value);
      console.log(`  Replacing ${placeholder} with: ${value}`);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully injected environment variables into ${file}\n`);
  }
});
