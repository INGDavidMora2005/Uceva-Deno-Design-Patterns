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

/**
 * Strategy: contrato común que cumplen todos los métodos de envío.
 * Existe para que Cart dependa solo de esta interfaz y no de cada fórmula:
 * así puede usar cualquier método de envío (actual o futuro) sin saber cómo
 * calcula su costo, y cambiarlo en tiempo de ejecución.
 */
interface ShippingStrategy {
  // Nombre legible del método de envío, para mostrarlo al cliente.
  name: string;
  // Cada estrategia decide cómo usar el subtotal y el peso en su fórmula.
  calculateCost(subtotal: number, weightKg: number): number;
}

/**
 * Estrategia concreta: envío estándar (tarifa base + costo por kg, gratis
 * desde cierto subtotal). Va en su propia clase para encapsular su fórmula:
 * si cambia la tarifa o la promoción, solo se toca esta clase y no el Cart.
 */
class StandardShipping implements ShippingStrategy {
  name = "Envío estándar";
  private readonly BASE_COST = 8_000;
  private readonly COST_PER_KG = 2_000;
  private readonly FREE_SHIPPING_FROM = 150_000;

  calculateCost(subtotal: number, weightKg: number): number {
    if (subtotal >= this.FREE_SHIPPING_FROM) return 0;
    return this.BASE_COST + this.COST_PER_KG * weightKg;
  }
}

/**
 * Estrategia concreta: envío exprés, más caro y sin envío gratis. Separarla
 * permite que conviva con las demás como otra opción intercambiable, sin
 * agregar condiciones nuevas dentro del Cart.
 */
class ExpressShipping implements ShippingStrategy {
  name = "Envío exprés";
  private readonly BASE_COST = 20_000;
  private readonly COST_PER_KG = 3_500;

  calculateCost(_subtotal: number, weightKg: number): number {
    return this.BASE_COST + this.COST_PER_KG * weightKg;
  }
}

/**
 * Estrategia concreta: recoger en tienda, siempre gratis. Aunque su cálculo
 * es trivial, cumple el mismo contrato: así el Cart la trata igual que a las
 * otras y no necesita un caso especial para "sin envío".
 */
class PickupShipping implements ShippingStrategy {
  name = "Recoger en tienda";
  private readonly COST = 0;

  calculateCost(_subtotal: number, _weightKg: number): number {
    return this.COST;
  }
}
