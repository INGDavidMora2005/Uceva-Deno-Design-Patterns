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
