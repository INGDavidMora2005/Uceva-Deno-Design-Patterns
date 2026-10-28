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
