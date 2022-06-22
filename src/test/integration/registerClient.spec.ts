import supertest from "supertest";
import app from "../../app";
import database from "..";
import { adminService } from "../../services";

const adminData = {
  name: "Admin",
  password: "admin",
  register: "329.825.570-02",
  job: "Administrador(a)",
  specialty: "Admin",
  isActive: true,
  data: {
    cpf: "36669523564",
    birthday: "25/04/1987",
    gender: "M",
    email: "admin@admin.com",
    mobile: "3140263598",
    street: "rua sem calçamento",
    number: "9999",
    complement: "fundos",
    zip: "35792-124",
    city: "teste",
    state: "RJ",
  },
};

const adminCredentials = {
  email: "admin@admin.com",
  password: "admin",
};

const validClientData = {
  name: "John Doe",
  subscription: "543219376",
  data: {
    cpf: "216.983.050-28",
    birthday: "10/10/2010",
    gender: "M",
    email: "johndoe999@email.com",
    mobile: "(13) 999999999",
    street: "Nowhere St.",
    number: "1",
    complement: "apt. 999",
    zip: "11075-350",
    city: "San Angels",
    state: "SP",
  },
};

const invalidClientData = {
  name: "John Doe",
  data: {
    birthday: "10/10/2010",
    gender: "M",
    mobile: "(13) 999999999",
    street: "Nowhere St.",
    number: "1",
    complement: "apt. 999",
    zip: "11075-350",
    city: "San Angels",
    state: "SP",
  },
};

let token = "";

describe("Register client route | Integration Test", () => {
  beforeAll(async () => {
    await database.createConnection();
  });

  afterAll(async () => {
    await database.closeConnection();
  });

  it("Should return a Client as JSON response with status code 201", async () => {
    await adminService.registerEmployee({ validated: adminData });

    const adminResponse = await supertest(app)
      .post("/login")
      .send(adminCredentials);

    token = adminResponse.body.Token;

    const response = await supertest(app)
      .post("/admin/clients/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validClientData });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.email).toStrictEqual(validClientData.data.email);
  });

  it("Should return an error message with status code 400", async () => {
    const response = await supertest(app)
      .post("/admin/employees/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...invalidClientData });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
