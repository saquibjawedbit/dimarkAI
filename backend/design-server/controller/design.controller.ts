import { Request, Response } from "express";
import { IPrompt } from "../types";
import { DesignService } from "../services/design.service";

export class DesignController {
    private designService: DesignService;

    constructor() {
        this.designService = new DesignService();
    }

    async design(req: Request, res: Response) {
        // req.file is populated by multer middleware
        const prompt: IPrompt = {
            businessType: req.body.businessType,
            productDescription: req.body.productDescription,
            targetAudience: req.body.targetAudience,
            additionalInformation: req.body.additionalInformation,
            useCase: req.body.useCase,
            festivalOrSeason: req.body.festivalOrSeason,
            productImage: req.file
        };
        const images = await this.designService.generateDesigns(prompt);
        return res.status(200).json({
            success: true,
            message: "Designs generated successfully",
            data: images,
        });
    }
}