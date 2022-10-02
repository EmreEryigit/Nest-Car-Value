import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const Ascrypt = promisify(scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // check email in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException("email in use");
        }
        // hash password
        const salt = randomBytes(8).toString("hex");
        const hash = (await Ascrypt(password, salt, 32)) as Buffer;
        const result = salt + "." + hash.toString("hex");

        // create a user and save
        const user = this.usersService.create(email, result);

        // return user
        return user;
    }
    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException("User Not Found");
        }
        const [salt, storedHash] = user.password.split(".");
        const hash = (await Ascrypt(password, salt, 32)) as Buffer;
        const isValidPassword = storedHash === hash.toString("hex");
        if (!isValidPassword) {
            throw new BadRequestException("Email or password invalid");
        }
        return user;
    }
}
