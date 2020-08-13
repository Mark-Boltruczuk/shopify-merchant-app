import Sequelize from "sequelize";
import sequelize from "../db";
import Merchant from "./merchant";

const Template = sequelize.define(
  "template",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    html: {
      type: Sequelize.TEXT,
      get() {
        if (this.getDataValue("html"))
          return JSON.parse(this.getDataValue("html"));
        return null;
      },
      set(valueToBeSet) {
        if (valueToBeSet)
          this.setDataValue("html", JSON.stringify(valueToBeSet));
        else this.setDataValue("html", null);
      },
    },
    design: {
      type: Sequelize.TEXT,
      get() {
        if (this.getDataValue("design"))
          return JSON.parse(this.getDataValue("design"));
        return null;
      },
      set(valueToBeSet) {
        if (valueToBeSet)
          this.setDataValue("design", JSON.stringify(valueToBeSet));
        else this.setDataValue("design", null);
      },
    },
    merchant_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

Merchant.hasMany(Template, {
  foreignKey: {
    name: "merchant_id",
  },
});
Template.belongsTo(Merchant, {
  foreignKey: {
    name: "merchant_id",
  },
});

export default Template;
