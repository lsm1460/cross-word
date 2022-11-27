import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./api/entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "52.78.135.227",
    port: 3306,
    username: "admin",
    password: "bangoo321!",
    database: "devteam_study",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
