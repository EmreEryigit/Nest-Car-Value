import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email
                );
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999),
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();
        service = module.get(AuthService);
    });
    it("can create a instance of auth service", async () => {
        expect(service).toBeDefined();
    });
    it("creates a new user with a salted and hashed password", async () => {
        const user = await service.signup("emre@emre.com", "12345");
        const [salt, hash] = user.password.split(".");
        expect(user.password).not.toEqual("12345");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    it("throws an error if user signs up with email that in use", async () => {
        await service.signup("asd", "12345");
        try {
            await service.signup("asd", "12345");
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe("email in use");
        }
    });
    it("throws if sign in is called with an unused email", async () => {
        expect.assertions(1);
        try {
            await service.signin("emre", "1");
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });

    it("throws if an invalid password is provided", async () => {
        await service.signup("emre", "123");
        try {
            await service.signin("emre", "12");
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect(error.message).toEqual("Email or password invalid");
        }
    });
    it("returns a user if an correct password is provided", async () => {
        await service.signup("asd", "12345");
        const user = await service.signin("asd", "12345");
        expect(user).toBeDefined();
    });
});
