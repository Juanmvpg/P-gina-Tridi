import sys
import re

file_path = 'C:/Users/gian9/.gemini/antigravity/scratch/Juegos_HTML_Taller/Ahorcado_3D/index.html'
content = open(file_path, 'r', encoding='utf-8').read()

new_func = '''        function addPrintedLayer() {
            const piece = document.getElementById('printed-piece');
            const layer = document.createElement('div');
            layer.className = 'printed-layer';
            
            if (errors > 0) {
                const shiftX = (Math.random() * errors * 1.5 + errors * 0.5);
                const rot = (Math.random() * errors * 1.5 + errors * 0.5);
                cumulativeShiftX += driftDirectionX * shiftX;
                cumulativeRot += driftDirectionRot * rot;
            }
            
            layer.style.setProperty('--tx', `${cumulativeShiftX}px`);
            layer.style.setProperty('--tr', `${cumulativeRot}deg`);

            piece.appendChild(layer);

            const xAxis = document.getElementById('printer-x-axis');
            let currentTop = parseInt(xAxis.style.top || 40);
            if (currentTop > 5) {
                xAxis.style.top = (currentTop - 4) + 'px';
            }
        }'''

# Extract the old function
old_func = re.search(r'        function addPrintedLayer\(\) \{[\s\S]*?        \}', content).group(0)
content = content.replace(old_func, new_func)

# Also fix addFilamentBlob
old_blob = re.search(r'        function addFilamentBlob\(\) \{[\s\S]*?        \}', content).group(0)
new_blob = '''        function addFilamentBlob() {
            const container = document.getElementById('filament-blobs');
            const blob = document.createElement('div');
            blob.className = 'blob';
            blob.style.setProperty('--b-scale', 1 + (errors * 0.15));
            const shiftX = (Math.random() * 10) - 5;
            blob.style.marginLeft = `${shiftX}px`;
            
            container.appendChild(blob);
        }'''
content = content.replace(old_blob, new_blob)

# Also fix endGame giant blob
content = content.replace("giantBlob.style.transform = 'scale(1)';", "giantBlob.style.setProperty('--b-scale', 1);")

open(file_path, 'w', encoding='utf-8').write(content)
print('Done!')
