import Sequelize from "sequelize";
import sequelize from "../db";
import Merchant from "./merchant";

const Milestone = sequelize.define(
  "milestone",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    reached_amount: {
      type: Sequelize.INTEGER,
    },
    revenue: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    product: {
      type: Sequelize.STRING,
      get() {
        if (this.getDataValue("product"))
          return JSON.parse(this.getDataValue("product"));
        return null;
      },
      set(valueToBeSet) {
        if (valueToBeSet)
          this.setDataValue("product", JSON.stringify(valueToBeSet));
        else this.setDataValue("product", null);
      },
    },
    period: {
      type: Sequelize.INTEGER,
    },
    started_at: {
      type: Sequelize.DATE,
    },
    expired_at: {
      type: Sequelize.DATE,
    },
    period_by_type: {
      type: Sequelize.STRING,
    },
    date_type: {
      type: Sequelize.STRING,
    },
    emailable: {
      type: Sequelize.BOOLEAN,
    },
    customer: {
      type: Sequelize.STRING,
      get() {
        if (this.getDataValue("customer"))
          return JSON.parse(this.getDataValue("customer"));
        return null;
      },
      set(valueToBeSet) {
        if (valueToBeSet)
          this.setDataValue("customer", JSON.stringify(valueToBeSet));
        else this.setDataValue("customer", null);
      },
    },
    meta: {
      type: Sequelize.JSON,
    },
    parent_id: {
      type: Sequelize.INTEGER,
      defaultValue: -1,
    },
    merchant_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Merchant.hasMany(Milestone, {
  foreignKey: {
    name: "merchant_id",
  },
});
Milestone.belongsTo(Merchant, {
  foreignKey: {
    name: "merchant_id",
  },
});

export default Milestone;
