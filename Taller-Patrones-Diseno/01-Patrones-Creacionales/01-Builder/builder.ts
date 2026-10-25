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

/**
 * PRODUCTO del patrón Builder: es el objeto complejo que se arma
 * paso a paso. No conoce a los builders ni al director.
 */
class Pizza {
  // Propiedades públicas porque los builders concretos las asignan
  // directamente al ejecutar cada paso de la construcción.
  size: string = "mediana";
  dough: string = "tradicional";
  sauce: string = "tomate";
  toppings: string[] = [];
  stuffedCrust: boolean = false;

  /**
   * Describe la pizza en español con todas sus características.
   */
  describe(): string {
    const ingredients: string = this.toppings.length > 0
      ? this.toppings.join(", ")
      : "sin ingredientes extra";
    const crust: string = this.stuffedCrust ? "sí" : "no";
    const base: string =
      `Pizza ${this.size}, masa ${this.dough}, salsa de ${this.sauce}`;

    return `${base}, ingredientes: ${ingredients}, ` +
      `borde relleno: ${crust}`;
  }
}

/**
 * INTERFAZ BUILDER del patrón: declara los pasos de construcción que
 * todo constructor concreto debe implementar para armar una pizza.
 *
 * Los métodos de configuración devuelven this para encadenar pasos,
 * mientras que build() devuelve Pizza porque entrega el producto ya
 * terminado.
 */
interface PizzaBuilder {
  /** Reinicia la pizza en construcción para empezar de nuevo. */
  reset(): this;

  /** Define el tamaño de la pizza. */
  setSize(size: string): this;

  /** Define el tipo de masa de la pizza. */
  setDough(dough: string): this;

  /** Define la salsa base de la pizza. */
  setSauce(sauce: string): this;

  /** Agrega un ingrediente adicional a la pizza. */
  addTopping(topping: string): this;

  /** Indica si la pizza lleva el borde relleno. */
  setStuffedCrust(stuffedCrust: boolean): this;

  /** Entrega la pizza terminada. */
  build(): Pizza;
}
