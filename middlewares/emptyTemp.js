const fs = require('fs');

module.exports = () => {
  fs.readdir("temp", (e, files) => {
    if (e) {
      return next(e);
    } else {
      for (let file of files) {
        if (file != '.gitkeep') {
          fs.unlink("temp/" + file, (e) => {
            if (e) {
              return next(e);
            }
          })
        }
      }
    }
  })
}
