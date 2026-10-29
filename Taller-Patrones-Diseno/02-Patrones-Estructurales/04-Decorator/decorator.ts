/**
 * PATRÓN: Decorator (Estructural)
 * AUTOR: David Mora Duque (versión inicial: Juan Diego Rodriguez)
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Permite agregar responsabilidades a un objeto envolviéndolo en otros
 * objetos decoradores que comparten su misma interfaz, sin modificar
 * su clase ni crear una subclase por cada combinación posible.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una reserva parte de una habitación con tarifa base y el cliente
 * puede sumar desayuno, parqueadero o spa en cualquier combinación.
 * Sin el patrón habría una subclase por combinación o una clase
 * gigante con condicionales, y cada servicio multiplicaría las clases.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada servicio es un decorador pequeño con una sola responsabilidad
 * que suma su costo y descripción al de la reserva que envuelve. Se
 * apilan en cualquier orden, el cliente solo conoce Booking y agregar
 * un servicio no obliga a tocar lo existente.
 *
 * PARTICIPANTES
 * - Booking: interfaz común con cost() y description().
 * - BasicRoom: componente concreto, la habitación con la tarifa base.
 * - BookingDecorator: decorador base abstracto que envuelve a otra
 *   Booking por composición y delega en ella.
 * - BreakfastDecorator, ParkingDecorator y SpaDecorator: decoradores
 *   concretos que agregan un servicio.
 *
 * Más información: https://refactoring.guru/es/design-patterns/decorator
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/04-Decorator/decorator.ts
 */
