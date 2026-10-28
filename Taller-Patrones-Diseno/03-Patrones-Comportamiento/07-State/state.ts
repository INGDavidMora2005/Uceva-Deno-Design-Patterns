/**
 * PATRÓN: State (Comportamiento)
 * AUTOR: Juan Diego Rodriguez
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Permite que un objeto cambie su comportamiento cuando cambia su estado
 * interno: el objeto delega las acciones en un objeto "estado" y parece que
 * cambiara de clase en tiempo de ejecución.
 *
 * PROBLEMA QUE SE RESUELVE
 * Escenario: el ciclo de vida de un pedido en una tienda: pendiente, pagado,
 * enviado, entregado o cancelado. Cada acción (pagar, enviar, entregar,
 * cancelar) solo es válida en ciertos estados. Sin el patrón, la clase Order
 * tendría condicionales if/switch gigantes sobre un campo "status" en cada
 * método: el mismo conjunto de condiciones se repetiría en todos los métodos,
 * sería difícil de mantener y muy propenso a errores cada vez que se agrega un
 * estado o se cambia una transición válida, porque habría que revisar cada
 * condicional y el compilador no ayudaría a detectar los casos olvidados.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada estado es una clase que encapsula qué acciones permite y a qué estado
 * transita; Order solo delega, las transiciones inválidas se rechazan dentro
 * del propio estado y agregar un estado nuevo no obliga a modificar los
 * existentes de forma masiva.
 *
 * PARTICIPANTES
 * - Order (contexto): guarda el estado actual y delega en él las acciones pay, ship, deliver y cancel.
 * - OrderState (interfaz): declara las acciones que cada estado debe implementar.
 * - Pending: pedido creado, esperando pago. Puede pagarse o cancelarse.
 * - Paid: pedido pagado. Puede enviarse o cancelarse.
 * - Shipped: pedido en camino. Solo puede entregarse.
 * - Delivered: estado final; no admite más acciones.
 * - Cancelled: estado final; no admite más acciones.
 * Las acciones no permitidas en un estado lanzan un Error.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/07-State/state.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

// Es el contrato común de todos los estados: cada estado decide qué acciones
// permite y a qué estado transita, por eso Order no necesita condicionales.
interface OrderState {
  readonly name: string;
  pay(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
}

// Es el contexto: guarda el estado actual y delega en él las acciones, sin
// if/switch sobre el estado. No sabe qué transiciones son válidas, eso lo
// decide cada estado concreto.
class Order {
  private state: OrderState;

  // Recibe el estado inicial por parámetro para que el contexto no dependa de
  // ninguna clase concreta de estado.
  constructor(readonly id: number, initialState: OrderState) {
    this.state = initialState;
  }

  // Es el punto único por donde cambia el estado; por eso registra la
  // transición y así se puede seguir el ciclo de vida del pedido.
  setState(newState: OrderState): void {
    const orderLabel = `Pedido #${this.id}`;
    const transition = `${this.state.name} → ${newState.name}`;
    const message = `${orderLabel}: ${transition}`;
    console.log(`%c${message}`, COLORS.cyan);
    this.state = newState;
  }

  // Expone el nombre del estado para mostrarlo sin revelar la clase concreta.
  getStateName(): string {
    return this.state.name;
  }

  // Solo delega en el estado actual: él decide si la acción es válida.
  pay(): void {
    this.state.pay(this);
  }

  // Solo delega en el estado actual: él decide si la acción es válida.
  ship(): void {
    this.state.ship(this);
  }

  // Solo delega en el estado actual: él decide si la acción es válida.
  deliver(): void {
    this.state.deliver(this);
  }

  // Solo delega en el estado actual: él decide si la acción es válida.
  cancel(): void {
    this.state.cancel(this);
  }
}

// Estado final: el pedido ya llegó al cliente y no admite más acciones; se
// rechazan todas para proteger el cierre del ciclo de vida.
class Delivered implements OrderState {
  readonly name = "Entregado";

  pay(): void {
    throw new Error("Pedido entregado: no admite más acciones");
  }

  ship(): void {
    throw new Error("Pedido entregado: no admite más acciones");
  }

  deliver(): void {
    throw new Error("Pedido entregado: no admite más acciones");
  }

  cancel(): void {
    throw new Error("Pedido entregado: no admite más acciones");
  }
}

// Estado final: el pedido fue cancelado y no admite más acciones; así no se
// puede "revivir" un pedido que ya terminó.
class Cancelled implements OrderState {
  readonly name = "Cancelado";

  pay(): void {
    throw new Error("Pedido cancelado: no admite más acciones");
  }

  ship(): void {
    throw new Error("Pedido cancelado: no admite más acciones");
  }

  deliver(): void {
    throw new Error("Pedido cancelado: no admite más acciones");
  }

  cancel(): void {
    throw new Error("Pedido cancelado: no admite más acciones");
  }
}

// El pedido va en camino: solo puede entregarse, porque ya salió del almacén y
// ya no tiene sentido pagarlo ni cancelarlo.
class Shipped implements OrderState {
  readonly name = "Enviado";

  pay(): void {
    throw new Error("El pedido ya fue pagado y enviado");
  }

  ship(): void {
    throw new Error("El pedido ya fue enviado");
  }

  // La transición la decide el propio estado: conoce el siguiente estado válido
  // y se lo entrega al contexto, que solo se encarga de guardarlo.
  deliver(order: Order): void {
    order.setState(new Delivered());
  }

  cancel(): void {
    throw new Error("Un pedido enviado no se puede cancelar");
  }
}

// El pedido ya fue pagado: puede enviarse o cancelarse. Las demás acciones se
// rechazan porque todavía no ha salido del almacén.
class Paid implements OrderState {
  readonly name = "Pagado";

  pay(): void {
    throw new Error("El pedido ya fue pagado");
  }

  // La transición la decide el propio estado: conoce el siguiente estado válido
  // y se lo entrega al contexto, que solo se encarga de guardarlo.
  ship(order: Order): void {
    order.setState(new Shipped());
  }

  deliver(): void {
    throw new Error("No se puede entregar un pedido que aún no fue enviado");
  }

  // Cancelar es válido mientras no se haya enviado; el propio estado indica el
  // destino en lugar de que Order conozca la regla.
  cancel(order: Order): void {
    order.setState(new Cancelled());
  }
}

// Estado inicial: el pedido espera el pago, así que solo puede pagarse o
// cancelarse; enviarlo o entregarlo no tiene sentido todavía.
class Pending implements OrderState {
  readonly name = "Pendiente";

  // La transición la decide el propio estado: conoce el siguiente estado válido
  // y se lo entrega al contexto, que solo se encarga de guardarlo.
  pay(order: Order): void {
    order.setState(new Paid());
  }

  ship(): void {
    throw new Error("No se puede enviar un pedido que aún no fue pagado");
  }

  deliver(): void {
    throw new Error("No se puede entregar un pedido que aún no fue pagado");
  }

  // Se puede cancelar sin haber pagado; la regla vive aquí, no en el contexto.
  cancel(order: Order): void {
    order.setState(new Cancelled());
  }
}

// Ejecuta una acción del pedido y, si el estado la rechaza con un Error, muestra
// el mensaje en vez de detener la demo.
function attempt(description: string, action: () => void): void {
  try {
    action();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const message = `❌ ${description} → ${detail}`;
    console.log(`%c${message}`, COLORS.red);
  }
}

// Código cliente: crea tres pedidos y demuestra el flujo válido junto con las
// transiciones inválidas que cada estado rechaza.
function main(): void {
  const title1 =
    "=== 1. Flujo normal: Pendiente → Pagado → Enviado → Entregado ===";
  console.log(`%c${title1}`, COLORS.green);
  const order1 = new Order(1, new Pending());
  const created1 =
    `Pedido #1 creado con estado inicial: ${order1.getStateName()}`;
  console.log(`%c${created1}`, COLORS.yellow);
  attempt("Pagar pedido #1", () => order1.pay());
  attempt("Enviar pedido #1", () => order1.ship());
  attempt("Entregar pedido #1", () => order1.deliver());

  const title2 = "=== 2. Pedido entregado: estado final, rechaza todo ===";
  console.log(`%c${title2}`, COLORS.green);
  attempt("Cancelar pedido #1 (ya entregado)", () => order1.cancel());
  attempt("Pagar pedido #1 (ya entregado)", () => order1.pay());

  const title3 = "=== 3. Transiciones inválidas desde Pendiente ===";
  console.log(`%c${title3}`, COLORS.green);
  const order2 = new Order(2, new Pending());
  const created2 =
    `Pedido #2 creado con estado inicial: ${order2.getStateName()}`;
  console.log(`%c${created2}`, COLORS.yellow);
  attempt("Enviar pedido #2 sin pagar", () => order2.ship());
  attempt("Entregar pedido #2 sin pagar", () => order2.deliver());

  const title4 = "=== 4. Cancelación y estado final ===";
  console.log(`%c${title4}`, COLORS.green);
  attempt("Cancelar pedido #2", () => order2.cancel());
  attempt("Pagar pedido #2 (ya cancelado)", () => order2.pay());

  const title5 = "=== 5. Un pedido enviado ya no se puede cancelar ===";
  console.log(`%c${title5}`, COLORS.green);
  const order3 = new Order(3, new Pending());
  const created3 =
    `Pedido #3 creado con estado inicial: ${order3.getStateName()}`;
  console.log(`%c${created3}`, COLORS.yellow);
  attempt("Pagar pedido #3", () => order3.pay());
  attempt("Enviar pedido #3", () => order3.ship());
  attempt("Cancelar pedido #3 (ya enviado)", () => order3.cancel());

  const summary =
    `Estado final → pedido #1: ${order1.getStateName()} | pedido #2: ${order2.getStateName()} | pedido #3: ${order3.getStateName()}`;
  console.log(`%c${summary}`, COLORS.white);
}

main();
