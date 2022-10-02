import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    VersionColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @Column({ default: true })
    admin: boolean;

    @AfterInsert()
    private logInsert() {
        console.log("Inserted User with id ", this.id);
    }
    @AfterUpdate()
    private logUpdate() {
        console.log("Updated User with id ", this.id);
    }
    @AfterRemove()
    private logRemove() {
        console.log("Removed User with id ", this.id);
    }
}
