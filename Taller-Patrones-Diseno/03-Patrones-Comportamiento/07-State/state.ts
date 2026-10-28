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
