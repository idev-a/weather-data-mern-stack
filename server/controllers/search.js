exports.search = (req, res) => {
  const { q } = req.query;
  res.json({ success: q });
};
