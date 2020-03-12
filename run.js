const { prompt } = require("inquirer");
const { readdirSync } = require("fs");
const { exec } = require("child_process");

async function run() {
  const folder = `${__dirname}/public`;

  const choices = await readdirSync(folder);

  const promptList = [
    {
      type: "rawlist",
      name: "filename",
      message: "Enter filename",
      pageSize: 10,
      highlight: true,
      searchable: true,
      choices,
      source: function(answersSoFar, input) {
        input = input || "";

        return new Promise(function(resolve) {
          const fuzzyResult = fuzzy.filter(input, filename);

          const data = fuzzyResult.map(function(element) {
            return element.original;
          });

          resolve(data);
        });
      }
    }
  ];

  function handleAnswers(answers) {
    const { filename } = answers;
    const execCmd = `parcel public/${filename}`;
    console.log(execCmd);

    const dev = exec(execCmd);

    dev.stdout.pipe(process.stdout);
    dev.stderr.pipe(process.stderr);

    dev.on("close", code => {
      console.log(`child process exited with code ${code}`);
    });
  }

  prompt(promptList).then(handleAnswers);
}

run();
