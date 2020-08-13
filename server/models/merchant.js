import Sequelize from "sequelize";
import sequelize from "../db";
import {
  BRONZE,
  BRONZE_MILESTONES,
  BRONZE_EMAILS,
} from "../../helpers/Constants";

const Merchant = sequelize.define(
  "merchant",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_origin: {
      type: Sequelize.STRING,
    },
    shop_owner: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    revenue: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    plan: {
      type: Sequelize.STRING,
      defaultValue: BRONZE,
    },
    milestone_limit: {
      type: Sequelize.INTEGER,
      defaultValue: BRONZE_MILESTONES,
    },
    milestone_used: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    email_limit: {
      type: Sequelize.INTEGER,
      defaultValue: BRONZE_EMAILS,
    },
    email_used: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    is_ready: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_plus: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    subscription_id: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default Merchant;
