const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test Suit", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete.", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markAsCompleteResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    // console.log(markAsCompleteResponse.text);
    const parsedUpdateResponse = JSON.parse(markAsCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
});

// const getJSDate = (days) => {
//   if (!Number.isInteger(days)) {
//     throw new Error("Need to pass an integer as days");
//   }
//   const today = new Date();
//   const oneDay = 60 * 60 * 24 * 1000;
//   return new Date(today.getTime() + days * oneDay);
// };

// describe("Tests for functions in todo.js", function () {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//   });

//   test("Todo.overdue should return all tasks (including completed ones) that are past their due date", async () => {
//     await db.Todo.addTask({
//       title: "This is a sample item",
//       dueDate: getJSDate(-2),
//       completed: false,
//     });
//     const items = await db.Todo.overdue();
//     expect(items.length).toBe(1);
//   });

//   test("Todo.dueToday should return all tasks that are due today (including completed ones)", async () => {
//     const dueTodayItems = await db.Todo.dueToday();
//     await db.Todo.addTask({
//       title: "This is a sample item",
//       dueDate: getJSDate(0),
//       completed: false,
//     });
//     const items = await db.Todo.dueToday();
//     expect(items.length).toBe(dueTodayItems.length + 1);
//   });

//   test("Todo.dueLater should return all tasks that are due on a future date (including completed ones)", async () => {
//     const dueLaterItems = await db.Todo.dueLater();
//     await db.Todo.addTask({
//       title: "This is a sample item",
//       dueDate: getJSDate(2),
//       completed: false,
//     });
//     const items = await db.Todo.dueLater();
//     expect(items.length).toBe(dueLaterItems.length + 1);
//   });

//   test("Todo.markAsComplete should change the `completed` property of a todo to `true`", async () => {
//     const overdueItems = await db.Todo.overdue();
//     const aTodo = overdueItems[0];
//     expect(aTodo.completed).toBe(false);
//     await db.Todo.markAsComplete(aTodo.id);
//     await aTodo.reload();

//     expect(aTodo.completed).toBe(true);
//   });

//   test("For a completed past-due item, Todo.displayableString should return a string of the format `ID. [x] TITLE DUE_DATE`", async () => {
//     const overdueItems = await db.Todo.overdue();
//     const aTodo = overdueItems[0];
//     expect(aTodo.completed).toBe(true);
//     const displayValue = aTodo.displayableString();
//     expect(displayValue).toBe(
//       `${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`
//     );
//   });

//   test("For an incomplete todo in the future, Todo.displayableString should return a string of the format `ID. [ ] TITLE DUE_DATE`", async () => {
//     const dueLaterItems = await db.Todo.dueLater();
//     const aTodo = dueLaterItems[0];
//     expect(aTodo.completed).toBe(false);
//     const displayValue = aTodo.displayableString();
//     expect(displayValue).toBe(
//       `${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`
//     );
//   });

//   test("For an incomplete todo due today, Todo.displayableString should return a string of the format `ID. [ ] TITLE` (date should not be shown)", async () => {
//     const dueTodayItems = await db.Todo.dueToday();
//     const aTodo = dueTodayItems[0];
//     expect(aTodo.completed).toBe(false);
//     const displayValue = aTodo.displayableString();
//     expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title}`);
//   });

//   test("For a complete todo due today, Todo.displayableString should return a string of the format `ID. [x] TITLE` (date should not be shown)", async () => {
//     const dueTodayItems = await db.Todo.dueToday();
//     const aTodo = dueTodayItems[0];
//     expect(aTodo.completed).toBe(false);
//     await db.Todo.markAsComplete(aTodo.id);
//     await aTodo.reload();
//     const displayValue = aTodo.displayableString();
//     expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`);
//   });
// });
