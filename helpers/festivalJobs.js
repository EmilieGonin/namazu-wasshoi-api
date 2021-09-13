const { Festival, Screenshot } = require("../models/index");
const { Op } = require("sequelize");
const schedule = require('node-schedule');
const now = new Date();

function setWinners(id) {
  Festival.findByPk(id, {
    include: {
      model: Screenshot,
      order: [
        ["votes", "DESC"]
      ],
      limit: 2
    }})
  .then((festival) => {
    for (let screenshot of festival.Screenshots) {
      screenshot.update({ isWinner: true });
    }
  })
}

Festival.afterCreate("addJob", (festival) => {
  if (festival.end && festival.end > now) {
    schedule.scheduleJob(festival.theme, festival.end, function() {
      setWinners(festival.id);
    });
  }
})
Festival.afterUpdate("updateJob", (festival) => {
  if (festival.changed("end_date") && festival.end > now) {
    const job = schedule.scheduledJobs[festival.theme];
    job.reschedule(festival.end, function() {
      setWinners(festival.id);
    });
  }
})
Festival.afterDestroy("cancelJob", (festival) => {
  const job = schedule.scheduledJobs[festival.theme];
  if (job) {
    job.cancel();
  }
})

Festival.findAll({
  where: {
    end: {
      [Op.gte]: now
    }
  }
})
.then((festivals) => {
  for (let festival of festivals) {
    const isScheduled = schedule.scheduledJobs[festival.theme];
    if (!isScheduled) {
      schedule.scheduleJob(festival.theme, festival.end, function() {
        setWinners(festival.id);
      });
    }
  }
})
