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

import { COLORS } from "../../../helpers/colors.ts";

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

/**
 * CONSTRUCTOR CONCRETO del patrón: implementa los pasos de
 * PizzaBuilder y mantiene internamente la pizza que se está armando.
 */
class MargaritaBuilder implements PizzaBuilder {
  private pizza: Pizza = new Pizza();

  constructor() {
    this.reset();
  }

  /**
   * Aplica la receta base de la margarita. Así, MargaritaBuilder y
   * CarnivoraBuilder parten de recetas base distintas usando la
   * misma interfaz PizzaBuilder.
   */
  reset(): this {
    this.pizza = new Pizza();
    this.pizza.dough = "delgada";
    this.pizza.sauce = "tomate";
    this.pizza.toppings = ["mozzarella", "albahaca"];
    return this;
  }

  setSize(size: string): this {
    this.pizza.size = size;
    return this;
  }

  setDough(dough: string): this {
    this.pizza.dough = dough;
    return this;
  }

  setSauce(sauce: string): this {
    this.pizza.sauce = sauce;
    return this;
  }

  addTopping(topping: string): this {
    this.pizza.toppings.push(topping);
    return this;
  }

  setStuffedCrust(stuffedCrust: boolean): this {
    this.pizza.stuffedCrust = stuffedCrust;
    return this;
  }

  /**
   * Guarda la pizza terminada y reinicia el builder. Así puede
   * reutilizarse para otra pizza sin mezclar ingredientes.
   */
  build(): Pizza {
    const finishedPizza: Pizza = this.pizza;
    this.reset();
    return finishedPizza;
  }
}

/**
 * SEGUNDO CONSTRUCTOR CONCRETO: implementa la misma interfaz
 * PizzaBuilder, pero arma una pizza con otra receta base.
 *
 * Esto demuestra la ventaja del patrón: el código cliente (el
 * director) puede usar cualquiera de los dos builders sin cambiar,
 * porque solo recibe un PizzaBuilder.
 */
class CarnivoraBuilder implements PizzaBuilder {
  private pizza: Pizza = new Pizza();

  constructor() {
    this.reset();
  }

  /**
   * Aplica la receta base de la carnívora: masa gruesa, salsa
   * barbacoa, tres ingredientes y borde relleno.
   */
  reset(): this {
    this.pizza = new Pizza();
    this.pizza.dough = "gruesa";
    this.pizza.sauce = "barbacoa";
    this.pizza.toppings = ["pepperoni", "jamón", "tocino"];
    this.pizza.stuffedCrust = true;
    return this;
  }

  setSize(size: string): this {
    this.pizza.size = size;
    return this;
  }

  setDough(dough: string): this {
    this.pizza.dough = dough;
    return this;
  }

  setSauce(sauce: string): this {
    this.pizza.sauce = sauce;
    return this;
  }

  addTopping(topping: string): this {
    this.pizza.toppings.push(topping);
    return this;
  }

  setStuffedCrust(stuffedCrust: boolean): this {
    this.pizza.stuffedCrust = stuffedCrust;
    return this;
  }

  /**
   * Guarda la pizza terminada y reinicia el builder para poder
   * reutilizarlo sin mezclar ingredientes.
   */
  build(): Pizza {
    const finishedPizza: Pizza = this.pizza;
    this.reset();
    return finishedPizza;
  }
}

/**
 * DIRECTOR del patrón: conoce el orden de los pasos y define recetas
 * reutilizables, pero no sabe cómo se construye cada pieza.
 *
 * Trabaja contra la interfaz PizzaBuilder, no contra clases concretas,
 * por eso la misma receta produce resultados distintos según el
 * builder (margarita o carnívora).
 *
 * Usar el director es opcional: el cliente también podría llamar
 * directamente a los pasos del builder.
 */
class PizzaDirector {
  private builder: PizzaBuilder;

  constructor(builder: PizzaBuilder) {
    this.builder = builder;
  }

  setBuilder(builder: PizzaBuilder): void {
    this.builder = builder;
  }

  /** Prepara una pizza básica pequeña. */
  makeBasicPizza(): Pizza {
    return this.builder.reset().setSize("pequeña").build();
  }

  /** Prepara una pizza familiar con borde relleno y extras. */
  makeFamilyPizza(): Pizza {
    return this.builder
      .reset()
      .setSize("familiar")
      .setStuffedCrust(true)
      .addTopping("queso extra")
      .addTopping("champiñones")
      .build();
  }
}

function main(): void {
  console.log("%c=== 1. Uso directo del builder ===", COLORS.blue);

  // El cliente controla el orden de los pasos y arma la pizza
  // directamente, sin usar el director.
  const customPizza: Pizza = new MargaritaBuilder()
    .setSize("grande")
    .setDough("integral")
    .addTopping("aceitunas")
    .setStuffedCrust(true)
    .build();

  console.log(customPizza.describe());

  console.log(
    "%c=== 2. Uso del director con MargaritaBuilder ===",
    COLORS.green,
  );

  // El director aplica sus recetas reutilizables sobre el builder.
  const director: PizzaDirector = new PizzaDirector(new MargaritaBuilder());
  const basicMargarita: Pizza = director.makeBasicPizza();
  const familyMargarita: Pizza = director.makeFamilyPizza();

  console.log(basicMargarita.describe());
  console.log(familyMargarita.describe());

  console.log(
    "%c=== 3. La misma receta con CarnivoraBuilder ===",
    COLORS.purple,
  );

  // Al cambiar el builder, las mismas recetas del director producen
  // pizzas distintas porque el director solo conoce la interfaz.
  director.setBuilder(new CarnivoraBuilder());
  const basicCarnivora: Pizza = director.makeBasicPizza();
  const familyCarnivora: Pizza = director.makeFamilyPizza();

  console.log(basicCarnivora.describe());
  console.log(familyCarnivora.describe());

  console.log("%c=== 4. Reutilización del builder ===", COLORS.orange);

  // build() reinicia el builder, por lo que dos pizzas construidas
  // seguidas no comparten ingredientes ni configuración.
  const reuseBuilder: MargaritaBuilder = new MargaritaBuilder();
  const firstPizza: Pizza = reuseBuilder
    .setSize("mediana")
    .addTopping("champiñones")
    .build();
  const secondPizza: Pizza = reuseBuilder
    .setSize("grande")
    .addTopping("aceitunas")
    .build();

  console.log(firstPizza.describe());
  console.log(secondPizza.describe());
}

main();
