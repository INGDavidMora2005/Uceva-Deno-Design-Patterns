/**
 * PATRÓN: Strategy (Comportamiento)
 * AUTOR: Juan Pablo Devia
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Define una familia de algoritmos que resuelven el mismo problema de formas
 * distintas, pone cada uno en su propia clase detrás de una interfaz común y
 * permite que el objeto que los usa cambie de algoritmo en tiempo de
 * ejecución sin saber cómo funciona cada uno por dentro.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una tienda online debe calcular el costo de envío según el método que elige
 * el cliente: envío estándar, envío exprés o recoger en tienda. Sin el patrón,
 * el carrito tendría un if/else o switch gigante con todas las fórmulas
 * mezcladas. Cada vez que apareciera un método nuevo (o cambiara una tarifa)
 * habría que modificar el carrito, arriesgando romper lo que ya funciona y
 * violando el principio abierto/cerrado.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada forma de calcular el envío es un algoritmo intercambiable: Strategy
 * los encapsula en clases separadas que cumplen la misma interfaz. El carrito
 * solo conoce esa interfaz y delega el cálculo, así queda desacoplado de las
 * fórmulas. El cliente puede cambiar el método de envío en tiempo de ejecución
 * y agregar un método nuevo es crear una clase, sin tocar el carrito.
 *
 * PARTICIPANTES
 * - ShippingStrategy: interfaz Strategy común a todos los cálculos de envío.
 * - StandardShipping, ExpressShipping, PickupShipping: estrategias concretas,
 *   cada una con su propia fórmula de costo.
 * - Cart: contexto; guarda la estrategia actual, permite cambiarla con
 *   setStrategy y le delega el cálculo del envío.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/08-Strategy/strategy.ts
 */
