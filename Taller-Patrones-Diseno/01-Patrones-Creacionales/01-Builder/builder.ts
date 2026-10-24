/**
 * PATRÓN: Builder (Creacional)
 * AUTOR: David Mora Duque
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Separa la construcción de un objeto complejo de su representación
 * final. La pizza se arma paso a paso mediante llamadas encadenadas,
 * así el mismo proceso produce configuraciones distintas sin exponer
 * cómo se construye internamente.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una pizza tiene muchas piezas opcionales: tamaño, masa, salsa,
 * ingredientes y borde. Sin el patrón, el constructor recibiría
 * demasiados parámetros o habría muchas subclases, lo que vuelve el
 * código difícil de leer y de mantener.
 *
 * ¿POR QUÉ ES ADECUADO?
 * El Builder arma la pizza paso a paso y reutiliza el mismo proceso
 * para distintas configuraciones. El Director define el orden de los
 * pasos y las recetas sin conocer los detalles internos del producto
 * ni de los constructores concretos.
 *
 * PARTICIPANTES
 * - Pizza: producto que se construye.
 * - PizzaBuilder: interfaz con los pasos de construcción.
 * - MargaritaBuilder y CarnivoraBuilder: constructores concretos.
 * - PizzaDirector: define el orden de los pasos y las recetas.
 *
 * Más información: https://refactoring.guru/es/design-patterns/builder
 * EJECUTAR: deno run Taller-Patrones-Diseno/01-Patrones-Creacionales/01-Builder/builder.ts
 */
