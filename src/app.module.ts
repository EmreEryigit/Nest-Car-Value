import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { Report } from "./reports/report.entity";

@Module({
    imports: [
        UsersModule,
        ReportsModule,
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "db.sqlite",
            synchronize: true,
            entities: [User, Report],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
