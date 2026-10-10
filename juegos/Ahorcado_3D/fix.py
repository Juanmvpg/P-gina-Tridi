import sys
content = open('index.html', encoding='utf8').read()
content = content.replace('\\`', '`').replace('\\${', '${')
open('index.html', 'w', encoding='utf8').write(content)
print('Fixed!')
