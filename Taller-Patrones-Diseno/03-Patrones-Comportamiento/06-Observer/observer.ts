/**
 * PATRÓN: Observer (Comportamiento)
 * AUTOR: Juan Diego Rodriguez
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Define una dependencia uno-a-muchos: cuando un objeto, el sujeto, cambia de
 * estado, avisa automáticamente a todos los observadores suscritos, sin
 * acoplarse a sus clases concretas.
 *
 * PROBLEMA QUE SE RESUELVE
 * Escenario: una tienda en línea cuyo producto cambia de precio o de stock y
 * varios clientes quieren enterarse por canales distintos (correo y app).
 * Si no existiera el patrón, la tienda tendría que conocer cada canal y
 * llamarlo a mano, o los clientes tendrían que consultar la tienda
 * constantemente (polling). Cada nuevo canal obligaría a modificar la clase de
 * la tienda, lo que genera alto acoplamiento, código repetido y riesgo de
 * romper lo que ya funcionaba; además, el polling desperdicia recursos y
 * retrasa el aviso.
 *
 * ¿POR QUÉ ES ADECUADO?
 * La tienda solo conoce la interfaz Observer, no las clases concretas de los
 * canales. Así se pueden agregar o quitar suscriptores en tiempo de ejecución
 * sin tocar la tienda, manteniendo bajo acoplamiento y facilitando extender el
 * sistema con nuevos canales de notificación.
 *
 * PARTICIPANTES
 * - Subject (interfaz): declara subscribe, unsubscribe y notify.
 * - Observer (interfaz): declara update(change: StoreChange).
 * - StoreChange: datos del cambio { product, type: "price" | "stock", oldValue, newValue }.
 * - Store: sujeto concreto; guarda un producto con precio y stock; al cambiarlos notifica a los suscriptores.
 * - EmailSubscriber: observador concreto que "envía un correo" (simulado con console.log).
 * - AppSubscriber: observador concreto que "envía una notificación push" (simulado con console.log).
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/06-Observer/observer.ts
 */
