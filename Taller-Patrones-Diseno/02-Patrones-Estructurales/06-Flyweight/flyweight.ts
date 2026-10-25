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
