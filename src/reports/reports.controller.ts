import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "src/guards/admin.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { User } from "src/users/user.entity";
import { ApproveReport } from "./dtos/approve-report.dto";
import { CreateReportDto } from "./dtos/create-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";
import { ReportDto } from "./dtos/report.dto";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    @Serialize(ReportDto)
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user);
    }

    @Patch("/:id")
    @UseGuards(AdminGuard)
    async approveReport(@Param("id") id: string, @Body() body: ApproveReport) {
        return this.reportService.changeApproval(id, body.approved);
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        console.log(query);
    }
}
