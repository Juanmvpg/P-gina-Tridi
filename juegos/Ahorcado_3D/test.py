import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)
driver.get("file:///C:/Users/gian9/.gemini/antigravity/scratch/Juegos_HTML_Taller/Ahorcado_3D/index.html")

time.sleep(1)

# Press a wrong letter
driver.execute_script("document.getElementById('letter-input').value = 'Z'; guess();")
driver.execute_script("document.getElementById('letter-input').value = 'X'; guess();")

# Press correct letters
word = driver.execute_script("return currentWord;")
print("Word is:", word)

unique_letters = list(set(word.replace(" ", "")))
for letter in unique_letters:
    driver.execute_script(f"document.getElementById('letter-input').value = '{letter}'; guess();")
    time.sleep(0.5)
    layer = driver.execute_script("return document.querySelector('.printed-layer')")
    if layer:
        print(f"Layer appeared after guessing {letter}")
        break

time.sleep(1)

# Check computed transform of the printed-layer
transform = driver.execute_script("""
    const layer = document.querySelector('.printed-layer');
    if (!layer) return null;
    return window.getComputedStyle(layer).transform;
""")
print("Computed transform:", transform)

inline_transform = driver.execute_script("""
    const layer = document.querySelector('.printed-layer');
    if (!layer) return null;
    return layer.style.transform;
""")
print("Inline transform:", inline_transform)

driver.quit()
