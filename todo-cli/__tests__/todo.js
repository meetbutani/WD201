// describe("First test suite", () => {
//     test("First case", () => {
//         expect(true).toBe(true);
//         // expect(false).toBe(true);
//         // expect(true).toBe(false);
//     });
// });

const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      dueDate: new Date().toISOString().slice(0, 10),
      // dueDate: new Date().toLocaleDateString("en-CA"),
      completed: false,
    });
    add({
      title: "Submit assignment",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
    add({
      title: "Pay rent",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: true,
    });
    add({
      title: "Service Vehicle",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
    add({
      title: "File taxes",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
    add({
      title: "Pay electric bill",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .slice(0, 10),
      completed: false,
    });
  });

  test("Should add new todo", () => {
    // expect(all.length).toBe(0);
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      dueDate: new Date().toISOString().slice(0, 10),
      // dueDate: new Date().toLocaleDateString("en-CA"),
      completed: false,
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retriev a overdue items", () => {
    expect(overdue().length > 0).toBe(true);
  });

  test("Should retriev a due today items", () => {
    expect(dueToday().length > 0).toBe(true);
  });

  test("Should retriev a due later items", () => {
    expect(dueLater().length > 0).toBe(true);
  });
});
