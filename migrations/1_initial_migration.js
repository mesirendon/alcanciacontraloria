const Migrations = artifacts.require("Migrations");
const PiggyBank = artifacts.require("PiggyBank");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(PiggyBank);
};
