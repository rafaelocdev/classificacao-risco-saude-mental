import { Request } from "express";
import { Appointment, Client, Data, QueryMhRisk } from "../entities";
import { ErrorHandler } from "../errors/errors";
import {
  appointmentRepo,
  clientRepo,
  dataRepo,
  queryMhRiskRepo,
  resultMhRiskRepo,
} from "../repositories";
import * as uuid from "uuid";

interface IClientById {
  client: Client;
  mhRisk: QueryMhRisk;
  appointment: Partial<Appointment>;
}

export default class DoctorService {
  getById = async ({ params }: Request) => {
    const { clientId } = params;

    if (!uuid.validate(clientId)) {
      throw new ErrorHandler(400, "Invalid input syntax for type uuid");
    }

    const client = await clientRepo.findOneBy({ data: { id: clientId } });

    if (!client) {
      throw new ErrorHandler(404, "User not found");
    }

    client.data = await dataRepo.findOneBy({ id: clientId });

    const mhRisk = await queryMhRiskRepo.findOneBy({
      client: { id: clientId },
    });

    if (!mhRisk) {
      return client;
    }

    const appointment = await appointmentRepo.listOne({
      queryMhRisk: mhRisk.id,
    });

    const clientById: IClientById = { client, mhRisk, appointment };

    return clientById;
  };
}
