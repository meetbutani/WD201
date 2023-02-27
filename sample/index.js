// const fs = require("fs");

// fs.writeFile(
//   "sample.txt",
//   "Hello World. Welcome to Node.js File System module.",
//   (err) => {
//     if (err) throw err;
//     console.log("File created!");
//   }
// );

// fs.readFile("sample.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

// fs.appendFile("sample.txt", " This is my updated content", (err) => {
//   if (err) throw err;
//   console.log("File updated!");
// });

// fs.readFile("sample.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

// fs.rename("sample.txt", "test.txt", (err) => {
//   if (err) throw err;
//   console.log("File name updated!");
// });

// fs.readFile("test.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

// fs.unlink("test.txt", (err) => {
//   if (err) throw err;
//   console.log("File test.txt deleted successfully!");
// });

// fs.readFile("test.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });






// const readline = require("readline");

// const lineDetail = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// lineDetail.question(`Please provide your name - `, (name) => {
//   console.log(`Hi ${name}!`);
//   lineDetail.close();
// });






// const args = require("minimist")(process.argv.slice(2));


let args = require("minimist")(process.argv.slice(2), {
    alias: {
        n: "name",
        a: "age",
    },
    default: {
        n: "Meet",
        a: 20
    },
});


console.log(args);