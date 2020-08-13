import Sequelize from "sequelize";
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from "./config";

const port = parseInt(DB_PORT, 10) || 3306;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: "mysql",
  operatorAliases: false,
});

export default sequelize;
