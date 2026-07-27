const attachCompany = (req, res, next) => {
  if (req.user && req.user.companyId) {
    req.body.companyId = req.user.companyId;
  }
  next();
};

module.exports = { attachCompany };
