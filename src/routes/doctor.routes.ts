import { Router } from "express";
import { doctorController } from "../controller";
import {
  validateIsDoctor,
  validateToken,
  verifyIfAppointmentHasFinished,
  verifyIfAppointmentHasStarted,
  verifyAppointmentOr404,
  validateSchema,
} from "../middlewares";

import { finishAppointmentSchema } from "../schemas";

const doctorRouter = Router();

// Buscar info cliente especifico (clientes - query-mh-risk - appointments - on_duty)
doctorRouter.get("/clients/:clientId", doctorController.getClientById);

// Buscar appointments -> considerar possibilidades de filtros para appointments não iniciados, em andamento e finalizados
doctorRouter.get(
  "/appointments",
  validateToken,
  validateIsDoctor,
  doctorController.getAppointments
);

// Inicia atendimento -> patch com on_duty_id -> Modificar on_duty para true
// Validar campos com schema específico
doctorRouter.patch(
  "/appointments/start/:id",
  validateToken,
  validateIsDoctor,
  verifyAppointmentOr404,
  verifyIfAppointmentHasStarted,
  verifyIfAppointmentHasFinished,
  doctorController.appointmentStart
);

// Finaliza atendimento => patch com anamnesis e action -> Modificar on_duty para false
// Validar campos com schema específico
doctorRouter.patch(
  "/appointments/finish/:id",
  validateToken,
  verifyAppointmentOr404,
  validateSchema(finishAppointmentSchema),
  doctorController.finishAppointment
);

export default doctorRouter;
