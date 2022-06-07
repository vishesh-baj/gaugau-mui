const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("gaugau_new", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  pool: { max: 5, min: 0, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize Authenticate");
  })
  .catch((err) => {
    console.log("Error = " + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize
  .sync()
  .then(() => {
    console.log(" Sequelize Sync");
  })
  .catch((err) => {
    console.log("Error " + err);
  });

db.client = require("../models/adminModels/clients.js")(sequelize, DataTypes);
db.customer = require("../models/adminModels/customers.js")(
  sequelize,
  DataTypes
);
db.districts = require("../models/adminModels/districts.js")(
  sequelize,
  DataTypes
);
db.state = require("../models/adminModels/states.js")(sequelize, DataTypes);
db.tahshil = require("../models/adminModels/tehsils.js")(sequelize, DataTypes);
// db.breeds = require('../models/adminModels/breeds.js')(sequelize,DataTypes)
// db.calf = require('../models/adminModels/calf.js')(sequelize,DataTypes)
db.stocks = require("../models/adminModels/stocks.js")(sequelize, DataTypes);
db.suppliers = require("../models/adminModels/suppliers.js")(
  sequelize,
  DataTypes
);
db.campaigns = require("../models/adminModels/campaigns.js")(
  sequelize,
  DataTypes
);
db.campaignCustomers = require("../models/adminModels/campaign_customers.js")(
  sequelize,
  DataTypes
);

// Relationship
db.customer.belongsTo(db.state, { as: "stateref", foreignKey: "state_id" });
db.state.hasMany(db.customer, { as: "customerref", foreignKey: "state_id" });
db.customer.belongsTo(db.districts, {
  as: "districtref",
  foreignKey: "district_id",
});
db.districts.hasMany(db.customer, {
  as: "customerref",
  foreignKey: "district_id",
});
db.customer.belongsTo(db.tahshil, { as: "tehsilref", foreignKey: "tehsil_id" });
db.tahshil.hasMany(db.customer, { as: "customerref", foreignKey: "tehsil_id" });
db.campaignCustomers.belongsTo(db.campaigns, {
  as: "campaignsref",
  foreignKey: "campaign_id",
});
db.campaigns.hasMany(db.campaignCustomers, {
  as: "campaign_customersref",
  foreignKey: "campaign_id",
});
db.campaignCustomers.belongsTo(db.client, {
  as: "clientref",
  foreignKey: "client_id",
});
db.client.hasMany(db.campaignCustomers, {
  as: "campaign_customersref",
  foreignKey: "client_id",
});
db.campaignCustomers.belongsTo(db.customer, {
  as: "customerref",
  foreignKey: "customer_id",
});
db.customer.hasMany(db.campaignCustomers, {
  as: "campaign_customersref",
  foreignKey: "customer_id",
});

// db.campaignCustomers.hasMany(db.customer, { as: "customerrefes", foreignKey: "customer_id"});
// db.customer.belongsToMany(db.campaignCustomers, { as: "campaign_customersrefes", foreignKey: "customer_id"});

module.exports = db;
