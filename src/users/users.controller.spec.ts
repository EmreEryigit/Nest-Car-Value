import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;
    beforeEach(async () => {
        fakeUsersService = {
            findOne(id: number) {
                return Promise.resolve({
                    id,
                    email: "asd@asd.com",
                    password: "1234",
                } as User);
            },
            find(email: string) {
                return Promise.resolve([
                    { id: 1, email, password: "1234" } as User,
                ]);
            },
            /*  remove(id) {},
            update(id, attrs) {}, */
        };
        fakeAuthService = {
            //signup(email, password) {},
            signin(email, password) {
                return Promise.resolve({ id: 1, email, password } as User);
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("find all users returns a list of users with the given email", async () => {
        const users = await controller.findAllUser("asd@asd.com");
        expect(users[0].email).toEqual("asd@asd.com");
    });
    it("find user returns a single user with given id", async () => {
        const user = await controller.findUser("1");
        expect(user).toBeDefined();
    });
    it("find user throws an error if user with given id is not found", async () => {
        fakeUsersService.findOne = () => null;
        try {
            await controller.findUser("1");
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
        }
    });
    it("signin updates session object and returns user", async () => {
        const session = { userId: -10 };
        const user = await controller.signin(
            { email: "emre", password: "asd" },
            session
        );

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});
