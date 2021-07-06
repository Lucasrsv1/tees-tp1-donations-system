import { Options } from "sequelize";

export type Environment = "development" | "test" | "production";

const config: Record<Environment, Options>;

export = config
