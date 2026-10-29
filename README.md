# Taller de Patrones de Diseño

Arquitectura de Software · Unidad Central del Valle del Cauca (UCEVA) · Facultad de Ingeniería · Docente: Jesus David Mejia Vergara.

## Integrantes

- David Mora Duque
- Juan Diego Rodriguez
- Juan Pablo Devia

## Descripción del taller

Este taller aplica diez patrones de diseño de las categorías creacional, estructural y de comportamiento. Cada patrón cuenta con un ejercicio funcional propio, documentado con comentarios dentro del código y ejecutable con Deno.

## Patrones utilizados

| Patrón | Categoría | Responsable | Archivo | Escenario |
| --- | --- | --- | --- | --- |
| Builder | Creacional | David Mora Duque | [builder.ts](Taller-Patrones-Diseno/01-Patrones-Creacionales/01-Builder/builder.ts) | Configurador de pizzas por pasos |
| Factory Method | Creacional | Juan Pablo Devia | [factory-method.ts](Taller-Patrones-Diseno/01-Patrones-Creacionales/02-Factory-Method/factory-method.ts) | Envíos por carretera y mar |
| Singleton | Creacional | David Mora Duque | [singleton.ts](Taller-Patrones-Diseno/01-Patrones-Creacionales/06-Singleton/singleton.ts) | Logger único de la aplicación |
| Adapter | Estructural | Juan Pablo Devia | [adapter.ts](Taller-Patrones-Diseno/02-Patrones-Estructurales/01-Adapter/adapter.ts) | Sensores de temperatura de terceros |
| Decorator | Estructural | Juan Diego Rodriguez | [decorator.ts](Taller-Patrones-Diseno/02-Patrones-Estructurales/04-Decorator/decorator.ts) | Notificaciones con marca, compresión y cifrado |
| Flyweight | Estructural | David Mora Duque | [flyweight.ts](Taller-Patrones-Diseno/02-Patrones-Estructurales/06-Flyweight/flyweight.ts) | Bosque con miles de árboles |
| Command | Comportamiento | Juan Pablo Devia | [command.ts](Taller-Patrones-Diseno/03-Patrones-Comportamiento/02-Command/command.ts) | Lista de tareas con deshacer y rehacer |
| Observer | Comportamiento | Juan Diego Rodriguez | [observer.ts](Taller-Patrones-Diseno/03-Patrones-Comportamiento/06-Observer/observer.ts) | Cambios de precio y stock |
| State | Comportamiento | Juan Diego Rodriguez | [state.ts](Taller-Patrones-Diseno/03-Patrones-Comportamiento/07-State/state.ts) | Ciclo de vida de un pedido |
| Strategy | Comportamiento | Juan Pablo Devia | [strategy.ts](Taller-Patrones-Diseno/03-Patrones-Comportamiento/08-Strategy/strategy.ts) | Cálculo de envío según método |

## Descripción de cada ejercicio

### Builder

El ejercicio construye una pizza con tamaño, masa, salsa, ingredientes y borde sin un constructor con demasiados parámetros. `Pizza` es el producto, `PizzaBuilder` declara los pasos, `MargaritaBuilder` y `CarnivoraBuilder` aplican recetas base distintas, y `PizzaDirector` reutiliza el orden de construcción.

### Factory Method

Una empresa de logística planea envíos nacionales por camión e internacionales por barco. `Logistics` define `planDelivery` y delega en `createTransport`; `RoadLogistics` y `SeaLogistics` crean `Truck` y `Ship`, de modo que el proceso no depende de las clases concretas.

### Singleton

Varias partes de la aplicación deben escribir en un mismo registro de mensajes. `Logger` usa constructor privado, una instancia estática y `getInstance()`; los métodos `info`, `warn` y `error` comparten el historial `entries`, por lo que el contador y los mensajes son únicos.

### Adapter

Una bodega de cadena de frío monitorea sensores de terceros que reportan en grados Fahrenheit y Kelvin, pero el monitor espera `TemperatureSensor.getCelsius()`. `FahrenheitAdapter` y `KelvinAdapter` envuelven `FahrenheitSensor` y `KelvinSensor` y traducen interfaz y unidades; `ColdStorageMonitor` no cambia.

### Decorator

Un sistema de mensajería necesita agregar marca de tiempo, compresión y cifrado en cualquier orden. `NotifierDecorator` envuelve a otro `Notifier`; `TimestampDecorator`, `CompressDecorator` y `EncryptDecorator` apilan responsabilidades sobre `BasicNotifier` sin crear una subclase por combinación.

### Flyweight

Un bosque con miles de árboles repetiría nombre, color y textura en cada uno. `TreeType` guarda ese estado intrínseco, `TreeTypeFactory` lo reutiliza mediante un caché, y `Tree` solo conserva su posición y una referencia al tipo; `Forest` planta y dibuja los árboles.

### Command

Una lista de tareas necesita deshacer y rehacer las acciones del usuario. `Command` declara `execute()` y `undo()`; `AddTaskCommand` y `CompleteTaskCommand` encapsulan acciones sobre `TodoList`, y `History` mantiene las pilas de deshacer y rehacer sin conocer cada comando.

### Observer

Una tienda cambia el precio o el stock de un producto y debe avisar a sus clientes por correo y por la app. `Store` es el sujeto que notifica a la interfaz `Observer`; `EmailSubscriber` y `AppSubscriber` reaccionan a `StoreChange`, y los suscriptores se agregan o quitan en tiempo de ejecución.

### State

Un pedido pasa por los estados pendiente, pagado, enviado, entregado o cancelado, y cada acción solo es válida en ciertos estados. `Order` delega en `OrderState`; `Pending`, `Paid`, `Shipped`, `Delivered` y `Cancelled` encapsulan las transiciones y rechazan las acciones inválidas con un `Error`.

### Strategy

Una tienda calcula el costo de envío según el método elegido: estándar, exprés o recogida en tienda. `ShippingStrategy` define `calculateCost`; `StandardShipping`, `ExpressShipping` y `PickupShipping` implementan fórmulas distintas, y `Cart` cambia de estrategia con `setStrategy`.

## Cómo ejecutar

Ejecuta los comandos desde la raíz del repositorio. La forma general es:

```
deno run Taller-Patrones-Diseno/<categoría>/<patrón>/<archivo>.ts
```

Ejemplo con el ejercicio de Builder:

```
deno run Taller-Patrones-Diseno/01-Patrones-Creacionales/01-Builder/builder.ts
```

Para revisar formato, lint y tipos de todo el taller:

```
deno task taller:fmt:check
deno task taller:lint
deno task taller:check
```

Cada archivo incluye en su encabezado qué hace el patrón, el problema que resuelve y por qué es adecuado.

---

## Material del curso (README original)

## Patrones de diseño

El código está escrito en TypeScript y usamos Deno para ejecutarlo, puedes usar Bun o Node si lo prefieres.

Si usas Node, deberás configurar TypeScript, por lo que te recomiendo Deno o Bun.

## Ejecución de Archivos

### Ejecutar Archivo Una Vez
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno builder.ts
```
```
deno builder.task.ts
```

### Ejecutar Archivo de Forma Automatica
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno --watch builder.ts
```
```
deno --watch builder.task.ts
```

# Recursos adicionales

* [Refactoring Guru](https://refactoring.guru/es/design-patterns/catalog)

* [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans?tab=readme-ov-file)

* [Patterns.dev](https://www.patterns.dev/)

* [Java Design Patterns](https://github.com/iluwatar/java-design-patterns)

* [Design Patterns TypeScript](https://github.com/torokmark/design_patterns_in_typescript?tab=readme-ov-file)

# Listado de Patrones Recomendados para el Curso

## Creacionales
- Builder
- Abstract Factory
- Factory Function
- Singleton

## Estructurales
- Adapter
- Composite
- Facade
- Flyweight

## Comportamiento
- Chain Responsability
- Observer
- Strategy
- Template Method