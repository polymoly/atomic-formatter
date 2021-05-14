const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function shouldMatch(file) {
  return {
    default: `import ${file.split(".")[0]} from`,
    destructured: `import {${file.split(".")[0]}} from`,
  };
}

const directories = [
  "atoms",
  "molecules",
  "muscles",
  "organisms",
  "templates",
  "pages",
];

directories.forEach((_directory) => {
  const dir = path.join(__dirname, _directory);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.readdir(dir, (error, files) => {
    if (error) {
      console.log(`could not find ${chalk.red(_directory)} directory`);
      return;
    }
    console.log(files);
    files?.forEach((file) => {
      file = path.join(dir, file);
      if (fs.statSync(file).isDirectory()) return;
      fs.readFile(path.join(__dirname, _directory, file), (error, data) => {
        if (error) return;
        [...directories]
          .filter((dir) => dir !== _directory)
          .forEach((directory) => {
            fs.readdir(path.join(__dirname, directory), (error, _files) => {
              if (error) return;
              _files?.forEach((_file) => {
                if (
                  data.toString().includes(...Object.values(shouldMatch(_file)))
                ) {
                  fs.rename(
                    path.join(__dirname, _directory, file),
                    path.join(__dirname, directory, file),
                    (error) => {
                      if (!error) {
                        console.log(
                          `${chalk.yellow(
                            file
                          )} successfully moved from ${chalk.yellow(
                            _directory
                          )} directory to ${chalk.yellow(directory)} directory`
                        );
                      }
                    }
                  );
                  return;
                }
              });
              console.log(
                chalk.greenBright("no wrong files found. all files are atomic!")
              );
            });
          });
      });
    });
  });
});
