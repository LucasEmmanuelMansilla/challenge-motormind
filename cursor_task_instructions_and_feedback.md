# Task instructions and feedback
_Exported on 11/11/2026 at 17:08:35 GMT-3 from Cursor (3.29.9)_

---

**User**

@README.md lee este documento y realiza las tareas que allí se piden.

Ignora las secciones "Cómo trabajar" y "Qué entregar". Céntrate en las tareas y en los pedidos puntuales.

En @data tienes un mock de la base de datos, que será el que se usará para las pruebas. Dentro de @diagnose.js ya está importado, solo debes utilizarlo.

No ejecutes código innecesario. No corras tests, esa tarea la haré yo.

Presta especial atención a los siguientes puntos:

- El feedback a los mecánicos debe ser claro
- Puntuación de probabilidad
- Errores con misma puntuación 

No des nada por hecho, si tienes dudas o algo no queda claro, me preguntas, soy el que tiene la última palabra

---

**Cursor**

Voy a leer el README y el código relacionado para entender las tareas concretas antes de tocar nada.

El enunciado deja varias decisiones que cambian el resultado, y en el manual hay datos sucios que también lo cambian. Antes de implementar, necesito que elijas cómo resolverlas.

**Decisiones de diagnose**

> **Si dos códigos del mismo vehículo apuntan a la misma causa, se muestra una sola vez y en `codes` van todos los códigos que la señalan (ejemplo real: en el Tiggo, P0300 da bujías al 0,40 y P0301 al 0,30). ¿Qué número ponemos en `probability`? Con un solo código siempre se deja el valor del manual.**
> - Suma de lo que aporta cada código (0,70). Si varios códigos coinciden, la causa sube. Puede pasar de 1.
> - Combinación 1-(1-p1)*(1-p2) (0,58). Sube con cada código y se queda entre 0 y 1. Más difícil de explicar en el taller.
> - La mayor de las dos (0,40). Fácil de explicar; el segundo código no cambia el número, solo aparece en `codes`. ✔
> - Sumar y después repartir para que todas las causas del resultado sumen 1. El número ya no es el del manual y cambia al agregar un código que no tiene que ver.

> **En este manual hay causas distintas con la misma probabilidad (por ejemplo, al pedir P0300 y P0301 juntos, inyector del cilindro 1 y toma de aire quedan las dos en 0,25). El orden no puede depender del orden de entrada. Si empatan, ¿cómo las ordenamos después de la probabilidad?**
> - Primero la que señalan más códigos; si siguen empatadas, por título (A→Z). ✔
> - Solo por título (A→Z). La cantidad de códigos no desempata.
> - Por id de la causa (A→Z), que es estable aunque el título cambie.
> - En el orden en que aparecen en el manual de ese vehículo.

> **En el Golf, la clave del catalizador está guardada como "P0420 " (con un espacio al final), típico de un PDF mal extraído. Si el mecánico manda P0420, ¿qué hacemos?**
> - Recortar espacios (y pasar a mayúsculas) en las claves del manual y en lo que manda el mecánico, y tratarlo como P0420. ✔
> - Comparación exacta: P0420 no está y va a notFound. Solo coincide si llega con el espacio.

> **En el Tiggo, P0420 apunta a la causa sonda-anterior (0,15) pero esa causa no tiene ficha: no hay título, componente ni pasos. ¿Qué ve el mecánico?**
> - Incluirla, con título y componente iguales al id, y un único paso que avisa que el manual no trae el procedimiento. ✔
> - Incluirla con título y componente iguales al id y pasos vacíos, sin inventar texto.
> - Omitirla. Solo entran causas con ficha completa en el manual.

> **Cómo tratar la entrada del mecánico, además del caso del espacio. Los códigos repetidos, la lista vacía y el orden de `codes` y `notFound` no están dichos. El vehículo inexistente ya está: se lanza un error.**
> - Quitar duplicados, aceptar lista vacía (sin causas) y devolver `codes` y `notFound` ordenados A→Z, sin depender del orden de entrada. ✔
> - No quitar duplicados ni reordenar: `codes` y `notFound` salen en el orden en que llegaron. Una lista vacía devuelve todo vacío.

Quedó definido: probabilidad máxima, empate por cantidad de códigos y luego por título, códigos normalizados, y la causa sin ficha se muestra con un aviso. Implemento eso en `diagnose.js` y lo dejo escrito en `DECISIONES.md`.

`diagnose` ya está implementada con las decisiones que elegiste, y quedaron escritas en `DECISIONES.md`. No corrí los tests.

La causa compartida se muestra una sola vez. Su probabilidad es la más alta que el manual le asigna entre los códigos leídos, y en `codes` aparecen todos los que la señalan. Si dos causas empatan, va primero la que respaldan más códigos y, si siguen igual, la de título anterior en orden alfabético.

Con el Tiggo y `P0300` + `P0301`, el orden queda así:

1. Bobina del cilindro 1 (0,45)
2. Bujías (0,40, señalada por los dos códigos)
3. Entrada de aire (0,25)
4. Inyector del cilindro 1 (0,25)
5. Presión de combustible (0,20)

Las dos de 0,25 tienen un solo código cada una, así que las separa el título: «Entrada…» queda antes que «Inyector…».

Además, `P0420` encuentra la ficha del Golf aunque en el manual esté guardada como `"P0420 "`, y `sonda-anterior` (Tiggo, sin ficha) entra con el id como título y un paso que avisa que no hay procedimiento. Los códigos repetidos se descartan y `codes` y `notFound` salen ordenados de la A a la Z.

El tiempo en `DECISIONES.md` lo dejé en blanco para que lo completes vos.

