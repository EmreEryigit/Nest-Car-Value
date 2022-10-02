import { IsBoolean, IsBooleanString } from "class-validator";


export class ApproveReport {
    @IsBoolean()
    approved: boolean


}