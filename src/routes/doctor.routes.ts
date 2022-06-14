import { Router } from "express";
import { doctorController } from "../controller";

const doctorRouter = Router();

// Buscar info cliente especifico (clientes - query-mh-risk - appointments - on_duty)
doctorRouter.get("/clients/:clientId");

// Buscar appointments -> considerar possibilidades de filtros para appointments não iniciados, em andamento e finalizados
doctorRouter.get("/appointments", doctorController.getAppointments);

// Inicia atendimento -> patch com on_duty_id -> Modificar on_duty para true
// Validar campos com schema específico
doctorRouter.patch("/appointments/start/:appointmentId");

// Finaliza atendimento => patch com anamnesi e action -> Modificar on_duty para false
// Validar campos com schema específico
doctorRouter.patch("/appointments/finish/:appointmentId");

export default doctorRouter;
