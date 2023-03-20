//  TodoModel.js

// Method 1
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {
  static async addTask(params) {
    return await Todo.create(params);
  }

  displayableString() {
    // return `${this.id}. ${this.title}. ${this.dueDate}`;
    return `${this.completed ? "[x]" : "[ ]"} ${this.id}. ${this.title} - ${
      this.dueDate
    }`;
  }
}

Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

Todo.sync();
module.exports = Todo;

// Method 2
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("./connectDB.js");

// const Todo = sequelize.define(
//   "Todo", // name of the table to which needs to be created
//   {
//     // Model attributes are defined here
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     dueDate: {
//       type: DataTypes.DATEONLY,
//     },
//     complete: {
//       type: DataTypes.BOOLEAN,
//     },
//   },
//   {
//     tableName: "todos",
//   }
// );
// module.exports = Todo;
// Todo.sync(); // create the table
