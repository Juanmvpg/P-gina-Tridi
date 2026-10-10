# Árbol de Decisión / Flujo del Juego: ¿Qué objeto es?

Este diagrama ilustra el flujo lógico y el sistema de decisiones y puntuación para el minijuego de adivinanzas, documentado según la dinámica real del código en HTML/JS.

```mermaid
flowchart TD
    Start([Inicio del Juego]) --> Init[Cargar Lista de Objetos e Inicializar Equipos]
    Init --> CheckItems{¿Quedan\nobjetos?}
    
    CheckItems -- No --> GameOver([Fin del Juego / Mostrar Ganador])
    CheckItems -- Sí --> TeamTurn([Turno del Equipo Actual])
    
    TeamTurn --> CanReveal{¿Imagen Totalmente\nRevelada?}
    
    CanReveal -- Sí --> MustNext[Nadie sumó puntos.\nEsperar click en 'Siguiente Objeto']
    MustNext --> NextObjAction[Pasar al Siguiente Objeto]
    NextObjAction --> CheckItems
    
    CanReveal -- No --> WaitAction[Esperar Acción del Equipo]
    
    WaitAction --> ActionReveal[Click: Revelar Más]
    WaitAction --> ActionCorrect[Click: ¡Adivinaron!]
    WaitAction --> ActionWrong[Click: Fallaron]
    
    ActionReveal --> DoReveal[Se destapan celdas y sube etapa]
    DoReveal --> TeamTurn
    
    ActionCorrect --> AddPoints[Sumar Puntos Según Nivel de Revelación]
    AddPoints --> FullReveal[Revelar toda la imagen restante]
    FullReveal --> MustNext
    
    ActionWrong --> NextTeam[Pasar Turno al Siguiente Equipo]
    NextTeam --> TeamTurn
```

## Sistema de Puntuación (Etapas de Revelación)

El nodo **Sumar Puntos Según Nivel de Revelación** sigue la siguiente regla lógica internamente:

```mermaid
flowchart LR
    Stage{Nivel de Revelación\n(revealStage)}
    Stage -- "0 o 1 (Poca Info)" --> P3[Otorgar 3 Puntos]
    Stage -- "2 (Info Intermedia)" --> P2[Otorgar 2 Puntos]
    Stage -- "3 (Casi Revelado)" --> P1[Otorgar 1 Punto]
    Stage -- "4+ (Todo Revelado)" --> P0[Otorgar 0 Puntos]
```
