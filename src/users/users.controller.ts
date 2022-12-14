import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Session,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { Serialize } from "../interceptors/serialize.interceptor";
import { AuthGuard } from "../guards/auth.guard";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";

@Serialize(UserDto)
@Controller("auth")
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post("/signout")
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    /*    @Get("/whoami")
    whoAmI(@Session() session: any) {
        return this.usersService.findOne(session.userId);
    } */
    @UseGuards(AuthGuard)
    @Get("/whoami")
    whoAmI(@CurrentUser() user: string) {
        return user;
    }

    @Get("/:id")
    async findUser(@Param("id") id: string) {
        console.log("handler is running");
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException("User Not Found");
        }
        return user;
    }

    @Get()
    findAllUser(@Query("email") email: string) {
        return this.usersService.find(email);
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
