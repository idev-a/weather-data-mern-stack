const models = require('../../models/index');

//  isCurrent: `${req.query.isCurrent == 'false' ? 1 : 0}`,
exports.search = (req, res) => {
  models.sequelize
    .query(
      'SELECT id, name, team FROM venue WHERE (lower(name) LIKE (:name) OR lower(team) LIKE (:team)) AND isCurrent=:isCurrent;',
      {
        replacements: {
          name: `%${req.query.q}%`,
          team: `%${req.query.q}%`,
        },
        type: models.sequelize.QueryTypes.SELECT,
      },
    )
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
