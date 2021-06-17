const express = require('express');
const router = express.Router();
const { xivapi, fcId } = require("../helpers/xivapi");

router.get("/", (req, res, next) => {
  const staffRoles = ["Maître", "Bras droit", "Officier"];
  const staff = [];

  xivapi.freecompany.get(fcId, {data: "FCM"})
  .then((response) => {
    const fc = response.FreeCompany;
    const fcMembers = response.FreeCompanyMembers;

    for (const member of fcMembers) {
      if (staffRoles.includes(member.Rank)) {
        staff.push(member.Name);
      }
    }
    res.status(200).json({ fc, fcMembers, staff });
  })
  .catch((error) => res.status(500).json({ error: "Impossible de récupérer les données de la compagnie libre." }));
});

module.exports = router;
