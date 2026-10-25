/**
 * PATRÓN: Flyweight (Estructural)
 * AUTOR: David Mora Duque
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Reduce el consumo de memoria compartiendo las partes comunes de
 * muchos objetos, llamadas estado intrínseco, en lugar de duplicarlas
 * en cada instancia. Así se pueden representar miles de objetos con
 * pocos datos repetidos.
 *
 * PROBLEMA QUE SE RESUELVE
 * En un bosque con miles de árboles, guardar el nombre, el color y la
 * textura dentro de cada árbol repetiría la misma información miles
 * de veces. Esa duplicación desperdicia memoria y hace más costoso
 * crear y mantener el bosque.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Separa el estado intrínseco (nombre, color y textura, compartido e
 * inmutable) del extrínseco (la posición x, y de cada árbol). Una
 * fábrica con caché entrega siempre el mismo TreeType ya creado, de
 * modo que los árboles solo guardan su posición y una referencia.
 *
 * PARTICIPANTES
 * - TreeType: flyweight, guarda el estado intrínseco compartido.
 * - TreeTypeFactory: fábrica con caché que reutiliza los TreeType.
 * - Tree: contexto, guarda solo la posición y una referencia a su
 *   TreeType.
 * - Forest: cliente que planta árboles y los dibuja.
 *
 * Más información: https://refactoring.guru/es/design-patterns/flyweight
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/06-Flyweight/flyweight.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

/**
 * FLYWEIGHT del patrón: guarda el estado intrínseco (nombre, color y
 * textura), que es compartido por muchos árboles.
 */
class TreeType {
  // Propiedades readonly: un flyweight compartido debe ser inmutable.
  // Si un árbol lo modificara, cambiaría todos los que lo comparten.
  readonly name: string;
  readonly color: string;
  readonly texture: string;

  constructor(name: string, color: string, texture: string) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }

  /**
   * Recibe la posición en cada llamada porque es estado extrínseco:
   * pertenece al árbol que usa el flyweight y no se guarda aquí, así
   * no se duplica en memoria.
   *
   * Devuelve el texto en lugar de imprimirlo para poder dibujar miles
   * de árboles sin llenar la consola.
   */
  draw(x: number, y: number): string {
    const typeDescription: string =
      `${this.name} (${this.color}, textura ${this.texture})`;
    const position: string = `en (${x}, ${y})`;

    return `${typeDescription} ${position}`;
  }
}

/**
 * FÁBRICA DE FLYWEIGHTS del patrón: administra el caché y garantiza
 * que no se creen dos TreeType iguales.
 *
 * Los clientes deben pedir los tipos a esta fábrica y nunca crearlos
 * con new TreeType(...), así el compartir está garantizado.
 */
class TreeTypeFactory {
  // El caché es un Map con clave compuesta para buscar rápido por la
  // combinación exacta de nombre, color y textura.
  private static cache: Map<string, TreeType> = new Map<string, TreeType>();

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key: string = [name, color, texture].join("|");

    if (!TreeTypeFactory.cache.has(key)) {
      const treeType: TreeType = new TreeType(name, color, texture);
      TreeTypeFactory.cache.set(key, treeType);
    }

    return TreeTypeFactory.cache.get(key)!;
  }

  // Permite comprobar en la demo cuántos objetos pesados existen
  // realmente frente a la cantidad de árboles.
  static getTypesCount(): number {
    return TreeTypeFactory.cache.size;
  }
}

/**
 * CONTEXTO del patrón: guarda solo el estado extrínseco (su posición
 * x, y) y una referencia al TreeType compartido, por eso cada árbol
 * ocupa muy poco.
 */
class Tree {
  readonly x: number;
  readonly y: number;
  readonly type: TreeType;

  constructor(x: number, y: number, type: TreeType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw(): string {
    return this.type.draw(this.x, this.y);
  }
}

/**
 * CLIENTE del patrón: planta los árboles pidiendo siempre el tipo a
 * la fábrica, de modo que miles de árboles reutilizan unos pocos
 * TreeType.
 */
class Forest {
  private trees: Tree[] = [];

  plantTree(
    x: number,
    y: number,
    name: string,
    color: string,
    texture: string,
  ): void {
    const type: TreeType = TreeTypeFactory.getTreeType(name, color, texture);
    const tree: Tree = new Tree(x, y, type);
    this.trees.push(tree);
  }

  /**
   * Devuelve un arreglo de textos y no imprime, para no llenar la
   * consola con miles de líneas.
   */
  draw(): string[] {
    const drawings: string[] = [];

    for (const tree of this.trees) {
      drawings.push(tree.draw());
    }

    return drawings;
  }

  getTreeCount(): number {
    return this.trees.length;
  }
}

function main(): void {
  console.log("%c=== 1. Plantando el bosque ===", COLORS.blue);

  // Cada árbol aporta su posición (estado extrínseco) y comparte su
  // TreeType (estado intrínseco) con los demás árboles iguales.
  const forest: Forest = new Forest();

  for (let i = 0; i < 10000; i++) {
    const x: number = i % 100;
    const y: number = Math.floor(i / 100);
    const variant: number = i % 3;

    if (variant === 0) {
      forest.plantTree(x, y, "Pino", "verde oscuro", "rugosa");
    } else if (variant === 1) {
      forest.plantTree(x, y, "Roble", "verde claro", "veteada");
    } else {
      forest.plantTree(x, y, "Abedul", "blanco", "lisa");
    }
  }

  const treeCount: number = forest.getTreeCount();
  console.log("Árboles plantados:", treeCount);

  console.log("%c=== 2. Objetos pesados realmente creados ===", COLORS.green);

  // Miles de árboles comparten unos pocos TreeType: el estado pesado
  // vive una sola vez por combinación y no dentro de cada árbol.
  const typeCount: number = TreeTypeFactory.getTypesCount();
  const summary: string =
    `${treeCount} árboles reutilizan solo ${typeCount} TreeType.`;
  console.log(summary);

  console.log("%c=== 3. Comparación sin Flyweight ===", COLORS.purple);

  // Cuenta de textos, no una medición real de memoria.
  const textsPerType: number = 3;
  const withoutFlyweight: number = treeCount * textsPerType;
  const withFlyweight: number = typeCount * textsPerType;
  const savedTexts: number = withoutFlyweight - withFlyweight;

  const comparison: string =
    `Sin el patrón se guardarían ${withoutFlyweight} textos de tipo; ` +
    `con el patrón, solo ${withFlyweight}. Se evitan ${savedTexts}.`;
  console.log(comparison);

  console.log("%c=== 4. Muestra del dibujo ===", COLORS.orange);

  // draw() se llama una sola vez y solo se muestran tres árboles para
  // no llenar la consola con miles de líneas.
  const drawings: string[] = forest.draw();
  const sample: string[] = drawings.slice(0, 3);
  console.log(sample);
}

main();
