const express = require('express');
const router = express.Router();
const { xivapi, fcId } = require("../helpers/xivapi");

router.get("/", (req, res, next) => {
  const staffRoles = ["Maître", "Bras droit", "Jeune officier", "Officier"];
  const staffMembers = [];

  xivapi.freecompany.get(fcId, {data: "FCM"})
  .then((response) => {
    const fc = response.FreeCompany;
    const fcMembers = response.FreeCompanyMembers;

    for (const member of fcMembers) {
      if (staffRoles.includes(member.Rank)) {
        staffMembers.push(member.Name);
      }
    }
    res.status(200).json({ fc, fcMembers, staffMembers });
  })
  .catch((error) => res.status(500).json({ error: "Impossible de récupérer les données de la compagnie libre." }));
});
router.get("/character/:id", (req, res, next) => {
  xivapi.character.get(req.params.id)
  .then((character) => {
    if (character) {
      character = character.Character;
      xivapi.data.get("title", character.Title)
      .then((title) => {
        if (title && character.Gender == 1) {
          character.Title = title.Name_fr;
        } else if (title && character.Gender == 2) {
          character.Title = title.NameFemale_fr
        } else {
          character.Title = ""
        }
        res.status(200).json({ character });
      })
    } else {
      res.status(404).json({ error: "Personnage non trouvé." });
    }
  })
  .catch((error) => res.status(500).json({ error: "Impossible de récupérer les données du personnage." }));
});
router.post("/character", (req, res, next) => {
  xivapi.character.search(req.body.character, {server: "Moogle"})
  .then((response) => {
    const character = response.Results[0];

    if (character && req.body.cl) {
      xivapi.character.get(character.ID, {data: "FC"})
      .then((response) => {
        const fc = response.FreeCompany;
        if (fc && fc.ID == fcId) {
          res.status(200).json({ character });
        } else {
          res.status(404).json({ error: "Le personnage ne fait pas partie de Namazu Wasshoi." });
        }
      })
    } else if (character) {
      res.status(200).json({ character });
    } else {
      res.status(404).json({ error: "Personnage non trouvé." });
    }
  })
  .catch((error) => res.status(500).json({ error: "Impossible de récupérer les données de la compagnie libre." }));
});

module.exports = router;
