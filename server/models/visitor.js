import Sequelize from "sequelize";
import sequelize from "../db";
import Merchant from "./merchant";

const Visitor = sequelize.define(
  "visitor",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visit_token: {
      type: Sequelize.STRING,
    },
    visitor_token: {
      type: Sequelize.STRING,
    },
    visits: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    meta: {
      type: Sequelize.STRING,
    },
    merchant_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

Merchant.hasMany(Visitor, {
  foreignKey: {
    name: "merchant_id",
  },
});
Visitor.belongsTo(Merchant, {
  foreignKey: {
    name: "merchant_id",
  },
});

export default Visitor;
