var DataTypes = require("sequelize").DataTypes;
var _app_versions = require("./app_versions");
var _bookings = require("./bookings");
var _campaign_customers = require("./campaign_customers");
var _campaigns = require("./campaigns");
var _clients = require("./clients");
var _content_translations = require("./content_translations");
var _customers = require("./customers");
var _districts = require("./districts");
var _notifications = require("./notifications");
var _otp = require("./otp");
var _shortlisted_stocks = require("./shortlisted_stocks");
var _states = require("./states");
var _stock_images = require("./stock_images");
var _stocks = require("./stocks");
var _suppliers = require("./suppliers");
var _tehsils = require("./tehsils");

function initModels(sequelize) {
  var app_versions = _app_versions(sequelize, DataTypes);
  var bookings = _bookings(sequelize, DataTypes);
  var campaign_customers = _campaign_customers(sequelize, DataTypes);
  var campaigns = _campaigns(sequelize, DataTypes);
  var client = _clients(sequelize, DataTypes);
  var content_translations = _content_translations(sequelize, DataTypes);
  var customer = _customers(sequelize, DataTypes);
  var districts = _districts(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var otp = _otp(sequelize, DataTypes);
  var shortlisted_stocks = _shortlisted_stocks(sequelize, DataTypes);
  var state = _states(sequelize, DataTypes);
  var stock_images = _stock_images(sequelize, DataTypes);
  var stocks = _stocks(sequelize, DataTypes);
  var suppliers = _suppliers(sequelize, DataTypes);
  var tahshil = _tehsils(sequelize, DataTypes);

  campaign_customers.belongsTo(campaigns, { as: "campaign", foreignKey: "campaign_id"});
  campaigns.hasMany(campaign_customers, { as: "campaign_customers", foreignKey: "campaign_id"});
  campaign_customers.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(campaign_customers, { as: "campaign_customers", foreignKey: "client_id"});
  campaign_customers.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(campaign_customers, { as: "campaign_customers", foreignKey: "customer_id"});
  customer.belongsTo(districts, { as: "district", foreignKey: "district_id"});
  districts.hasMany(customer, { as: "customers", foreignKey: "district_id"});
  customers.belongsTo(state, { as: "state", foreignKey: "state_id"});
  state.hasMany(customers, { as: "customers", foreignKey: "state_id"});
  customer.belongsTo(tahshil, { as: "tehsil", foreignKey: "tehsil_id"});
  tahshil.hasMany(customer, { as: "customers", foreignKey: "tehsil_id"});

  return {
    app_versions,
    bookings,
    campaign_customers,
    campaigns,
    clients,
    content_translations,
    customers,
    districts,
    notifications,
    otp,
    shortlisted_stocks,
    states,
    stock_images,
    stocks,
    suppliers,
    tehsils,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
