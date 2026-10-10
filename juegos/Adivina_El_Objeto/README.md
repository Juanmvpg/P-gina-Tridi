# ¿Qué objeto es? - Minijuego HTML

Un minijuego en HTML diseñado para niños (8 a 14 años) donde deben adivinar el objeto oculto que se va revelando progresivamente.

## Archivos
* **`index.html`**: Archivo principal del juego. Contiene la interfaz gráfica, los estilos CSS y la interacción con el DOM.
* **`game_logic.js`**: Contiene la lógica del juego (reglas, puntaje, turnos), separada de la UI para facilitar pruebas y mantenimiento.
* **`game_logic.test.js`**: Pruebas unitarias para ejecutar con Node.js (si estuviera disponible).
* **`test_runner.html`**: Ejecutador de pruebas que corre en el navegador. Abre este archivo en el navegador para comprobar que toda la lógica funciona correctamente.

## Instrucciones de uso
1. Abre `index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
2. Verás el objeto oculto detrás de una cuadrícula.
3. Puedes utilizar el botón **"🔍 Revelar Más"** para descubrir partes de la imagen progresivamente.
4. Los turnos de los grupos están resaltados.
5. Si el grupo en turno adivina correctamente, presiona **"✅ ¡Adivinaron!"** para sumarles los puntos correspondientes a esa etapa.
6. Si fallan, presiona **"❌ Fallaron"** para pasar el turno al siguiente grupo.
7. Al adivinar, usa **"➡️ Siguiente Objeto"** para pasar a la próxima ronda.

## Sistema de puntos
* Si el objeto está totalmente oculto o apenas se ha revelado (etapa 1): **3 puntos**.
* Si el objeto está revelado por la mitad (etapa 2): **2 puntos**.
* Si el objeto está casi completamente revelado (etapa 3): **1 punto**.

## Notas sobre rendimiento
El juego utiliza `div`s nativos y propiedades de CSS `opacity` para las transiciones, junto con emojis para las imágenes. Esto asegura que el rendimiento sea excelente y no requiera descargar recursos externos como imágenes de alta resolución, pudiendo ser ejecutado en cualquier equipo (incluso computadoras antiguas de escuelas) sin problemas de "lag".
