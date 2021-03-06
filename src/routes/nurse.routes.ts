import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware";
import { nurseController } from "../controller";
import { createQueryMhRiskSchema } from "../schemas";
import { validateToken, verifyUserByIdOr404 } from "../middlewares";
import validateIsNurse from "../middlewares/validateIsNurse.middlewares";

const nurseRouter = Router();

// Preencher questionário -> Setar o risco automaticamente -> criar appointments automaticamente se der vermelho ou laranja
nurseRouter.post(
  "/query-mh-risk/:id",
  validateToken,
  validateIsNurse,
  verifyUserByIdOr404,
  validateSchema(createQueryMhRiskSchema),
  nurseController.createQueryMhRisk
);

export default nurseRouter;
