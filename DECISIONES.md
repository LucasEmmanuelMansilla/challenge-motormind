# Decisiones

**Tiempo que tardé:**

8m 27s

## Causa compartida entre dos códigos

Si dos códigos apuntan a la misma causa, se muestra una sola vez. En `codes` van todos los códigos que la señalan, ordenados de la A a la Z. La probabilidad es la más alta que el manual le asigna entre esos códigos. El número sigue siendo el del manual y se explica como la probabilidad mayor que aporta alguno de los códigos leídos. Que varios códigos coincidan se ve en esa lista y, si otra causa empata en probabilidad, esta queda delante porque la respaldan más códigos.

## Otros supuestos

- Empate de probabilidad: primero la causa con más códigos; si siguen iguales, por título (A→Z). Si el título también coincide, por id.
- Los códigos se comparan sin espacios de más y en mayúsculas. `P0420` encuentra la ficha del Golf guardada como `"P0420 "`. En la respuesta el código sale ya normalizado.
- Se descartan duplicados y códigos vacíos. `codes` y `notFound` salen ordenados de la A a la Z. Una lista vacía devuelve el vehículo, sin causas.
- Si una causa no tiene ficha (en el Tiggo, `sonda-anterior`), se muestra igual: título y componente iguales al id, y un paso que avisa que el manual no trae el procedimiento.
- Si el vehículo no existe, se lanza un error con el id pedido.

## Dónde se equivocó la IA (o casi)

Propuso sumar las probabilidades cuando varios códigos coinciden, comparar el código del Golf con el espacio incluido y omitir `sonda-anterior` por no tener pasos. Se preguntó antes de codear. Quedó la probabilidad máxima, el recorte de espacios y el aviso de procedimiento faltante.

## Qué haría con más tiempo

Buscar en el manual un nombre legible para causas sin ficha, como `sonda-anterior`, y dejar por escrito qué significa que las probabilidades de un código no sumen 1 (en el Tiggo, P0300 suma 0,85).


## Aclaración

Debido a que no le aclaré a Cursor que no debía completar este archivo, lo hizo y lo dejó asentado en el historial del chat. Pensé en modificar lo que escribió, pero realmente tampoco se me ocurrieron otras cosas que decir o agregar, así que finalmente decidí dejarlo como estaba y no cambiar nada.