/**
 * PATRÓN: Command (Comportamiento)
 * AUTOR: Juan Pablo Devia
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Convierte cada acción en un objeto (un "comando") que sabe ejecutarse y
 * también deshacerse. Quien dispara la acción ya no llama directamente al
 * objeto que hace el trabajo: le entrega el comando a un invocador, que lo
 * ejecuta y puede guardarlo para revertirlo o repetirlo después.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una app de lista de tareas permite agregar tareas y marcarlas como
 * completadas, y el usuario necesita deshacer y rehacer lo que hizo. Sin el
 * patrón, la interfaz llamaría directo a la lista y no habría una forma limpia
 * de recordar qué se hizo ni de revertirlo: el código de deshacer tendría que
 * adivinar cada acción con if/switch, y cada acción nueva lo complicaría más.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada acción es un comando que guarda lo necesario para revertirse y expone
 * execute() y undo(). El historial solo apila comandos y llama a esos dos
 * métodos, sin saber qué hace cada uno. Deshacer y rehacer funcionan igual
 * para cualquier acción, y agregar una acción nueva es crear otro comando,
 * sin tocar el historial ni la lista.
 *
 * PARTICIPANTES
 * - Command: interfaz común con execute() y undo().
 * - TodoList: receptor; sabe hacer el trabajo real sobre las tareas.
 * - AddTaskCommand, CompleteTaskCommand: comandos concretos; cada uno guarda
 *   lo necesario para ejecutarse y revertirse.
 * - History: invocador; ejecuta los comandos y mantiene las pilas de
 *   deshacer (undo) y rehacer (redo).
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/02-Command/command.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

// Interfaz Command: todo comando sabe ejecutarse y revertirse. Es lo único
// que conoce el invocador (History), así puede deshacer cualquier acción sin
// saber qué hace cada una.
interface Command {
  // Nombre legible de la acción, para mostrarlo en la demo.
  description: string;
  execute(): void;
  undo(): void;
}

// Receptor: la lista de tareas sabe hacer el trabajo real. No sabe nada de
// comandos ni de historial; los comandos la usan para cumplir cada acción.
class TodoList {
  private tasks = new Map<number, { title: string; done: boolean }>();
  private nextId = 1;

  // Si recibe un id lo reutiliza; si no, asigna uno nuevo.
  addTask(title: string, id?: number): number {
    const taskId = id ?? this.nextId++;
    this.tasks.set(taskId, { title, done: false });
    return taskId;
  }

  removeTask(id: number): void {
    this.tasks.delete(id);
  }

  complete(id: number): void {
    const task = this.tasks.get(id);
    if (task) task.done = true;
  }

  uncomplete(id: number): void {
    const task = this.tasks.get(id);
    if (task) task.done = false;
  }

  // Estado de la lista como texto: "[x] tarea" o "[ ] tarea".
  toText(): string {
    if (this.tasks.size === 0) return "  (lista vacía)";
    const lines = [...this.tasks.values()].map((task) => {
      const mark = task.done ? "[x]" : "[ ]";
      return `  ${mark} ${task.title}`;
    });
    return lines.join("\n");
  }
}

// Comando concreto: agregar una tarea. Guarda el id que le asigna la lista al
// ejecutarse, porque es justo lo que necesita para deshacerse (eliminarla).
class AddTaskCommand implements Command {
  description: string;
  // El id se conserva aunque se deshaga: al rehacer, la tarea vuelve con el
  // MISMO id y así no se rompen comandos posteriores que dependen de ella
  // (por ejemplo, un CompleteTaskCommand sobre esa tarea).
  private taskId?: number;

  constructor(private readonly list: TodoList, private readonly title: string) {
    this.description = `Agregar "${title}"`;
  }

  execute(): void {
    this.taskId = this.list.addTask(this.title, this.taskId);
  }

  undo(): void {
    if (this.taskId === undefined) return;
    this.list.removeTask(this.taskId);
  }

  // Permite crear otros comandos sobre la tarea que este agregó.
  getTaskId(): number {
    if (this.taskId === undefined) {
      throw new Error("El comando aún no se ha ejecutado");
    }
    return this.taskId;
  }
}

// Comando concreto: completar una tarea. Guarda el id de la tarea para poder
// desmarcarla al deshacer, sin que el historial sepa cómo se hace.
class CompleteTaskCommand implements Command {
  description: string;

  constructor(
    private readonly list: TodoList,
    private readonly taskId: number,
    title: string,
  ) {
    this.description = `Completar "${title}"`;
  }

  execute(): void {
    this.list.complete(this.taskId);
  }

  undo(): void {
    this.list.uncomplete(this.taskId);
  }
}

// Invocador: ejecuta los comandos y los recuerda en pilas. Solo conoce la
// interfaz Command, así que puede deshacer cualquier acción (actual o futura)
// sin saber qué hace cada una ni cómo se revierte.
class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    // Un comando NUEVO limpia la pila de rehacer: es el comportamiento
    // estándar de los editores, porque lo deshecho ya no encaja con la nueva
    // historia de acciones.
    this.redoStack = [];
    console.log(`\n%cEjecutar: ${command.description}`, COLORS.green);
  }

  // Revierte el último comando y lo guarda para poder rehacerlo.
  undo(): void {
    const command = this.undoStack.pop();
    if (!command) {
      console.log("\n%cNo hay nada para deshacer.", COLORS.red);
      return;
    }
    command.undo();
    this.redoStack.push(command);
    console.log(`\n%cDeshacer: ${command.description}`, COLORS.yellow);
  }

  // Vuelve a ejecutar el último comando deshecho. Llama a command.execute()
  // directamente (no a this.execute) para no limpiar la pila de rehacer.
  redo(): void {
    const command = this.redoStack.pop();
    if (!command) {
      console.log("\n%cNo hay nada para rehacer.", COLORS.red);
      return;
    }
    command.execute();
    this.undoStack.push(command);
    console.log(`\n%cRehacer: ${command.description}`, COLORS.cyan);
  }
}

function main() {
  console.log("%c=== Lista de tareas con Command ===", COLORS.purple);
  const list = new TodoList();
  const history = new History();

  // Ejecuta una acción y luego imprime cómo quedó la lista.
  const step = (action: () => void) => {
    action();
    console.log(list.toText());
  };

  const addMilk = new AddTaskCommand(list, "Comprar leche");
  const addStudy = new AddTaskCommand(list, "Estudiar patrones");
  const addReport = new AddTaskCommand(list, "Entregar taller");
  step(() => history.execute(addMilk));
  step(() => history.execute(addStudy));
  step(() => history.execute(addReport));

  const reportId = addReport.getTaskId();
  const title = "Entregar taller";
  step(() => history.execute(new CompleteTaskCommand(list, reportId, title)));
  console.log(`Id de "${title}": %c${reportId}`, COLORS.blue);

  // Deshacer 2 veces: el completar y el último agregar.
  step(() => history.undo());
  step(() => history.undo());

  // Rehacer 2 veces: la tarea vuelve con el MISMO id y completada otra vez.
  step(() => history.redo());
  step(() => history.redo());
  const redoneId = addReport.getTaskId();
  console.log(`Id de "${title}" tras rehacer: %c${redoneId}`, COLORS.blue);

  // Un comando nuevo limpia la pila de rehacer.
  step(() => history.execute(new AddTaskCommand(list, "Llamar al médico")));
  step(() => history.redo());
}

main();
