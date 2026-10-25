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

import { COLORS } from "../../../helpers/colors.ts";

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

// Estrategia concreta: tarifa base + costo por kg, gratis desde un subtotal.
// Encapsula su fórmula: si cambia la tarifa, solo se toca esta clase.
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

// Estrategia concreta: envío exprés, más caro y sin envío gratis. Es otra
// opción intercambiable que no agrega condiciones nuevas dentro del Cart.
class ExpressShipping implements ShippingStrategy {
  name = "Envío exprés";
  private readonly BASE_COST = 20_000;
  private readonly COST_PER_KG = 3_500;

  calculateCost(_subtotal: number, weightKg: number): number {
    return this.BASE_COST + this.COST_PER_KG * weightKg;
  }
}

// Estrategia concreta: recoger en tienda, siempre gratis. Cumple el mismo
// contrato, así el Cart no necesita un caso especial para "sin envío".
class PickupShipping implements ShippingStrategy {
  name = "Recoger en tienda";
  private readonly COST = 0;

  calculateCost(_subtotal: number, _weightKg: number): number {
    return this.COST;
  }
}

const formatCOP = (value: number) => `$${value.toLocaleString("es-CO")} COP`;

/**
 * Contexto: guarda los productos y la estrategia de envío actual. No sabe
 * calcular envíos a propósito: delega en ShippingStrategy, así no tiene
 * if/switch por tipo de envío y no cambia al agregar un método nuevo.
 */
class Cart {
  private items: { name: string; price: number; weightKg: number }[] = [];

  constructor(private strategy: ShippingStrategy) {}

  // Cambia el algoritmo de envío en tiempo de ejecución.
  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy;
  }

  addItem(name: string, price: number, weightKg: number): void {
    this.items.push({ name, price, weightKg });
    console.log(`Agregado: %c${name} (${formatCOP(price)})`, COLORS.green);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  getTotalWeight(): number {
    return this.items.reduce((sum, item) => sum + item.weightKg, 0);
  }

  // Delega el cálculo del envío en la estrategia actual, sin if/switch.
  checkout(): { subtotal: number; shipping: number; total: number } {
    const subtotal = this.getSubtotal();
    const weight = this.getTotalWeight();
    const shipping = this.strategy.calculateCost(subtotal, weight);
    const total = subtotal + shipping;
    console.log(`\n%cCheckout con: ${this.strategy.name}`, COLORS.blue);
    console.log(`  Subtotal: %c${formatCOP(subtotal)}`, COLORS.green);
    console.log(`  Envío:    %c${formatCOP(shipping)}`, COLORS.yellow);
    console.log(`  Total:    %c${formatCOP(total)}`, COLORS.purple);
    return { subtotal, shipping, total };
  }
}

function main() {
  console.log("%c=== Costo de envío con Strategy ===", COLORS.red);
  const cart = new Cart(new StandardShipping());
  cart.addItem("Audífonos", 60_000, 0.5);
  cart.addItem("Libro", 45_000, 1.5);
  cart.addItem("Taza", 25_000, 0.5);
  // El MISMO carrito da costos distintos según la estrategia.
  cart.checkout();
  cart.setStrategy(new ExpressShipping());
  cart.checkout();
  cart.setStrategy(new PickupShipping());
  cart.checkout();
  console.log("\n%c=== El subtotal supera 150.000 COP ===", COLORS.red);
  cart.addItem("Morral", 40_000, 1);
  cart.setStrategy(new StandardShipping());
  cart.checkout();
}

main();
