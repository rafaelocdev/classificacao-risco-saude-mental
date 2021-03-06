import path from "path";
import hbs from "nodemailer-express-handlebars";
import transportMailer from "../config/mailer.config";
import { ErrorHandler } from "../errors/errors";

interface IWelcomeEmail {
  name: string;
  cpf: string;
  birthday: string;
  gender: string;
  email: string;
  mobile: string;
  address: string;
}

interface IAppointmentEmail {
  id: string;
  patientName: string;
  risk: string;
  evaluationDate: Date;
}

interface IPendingEmail {
  name: string;
  currentDateTime: Date;
  appointments: IAppointmentEmail[];
  lengthAppointments: number;
}

class mailerService {
  private handlebarOptions = {
    viewEngine: {
      extname: ".handlebars",
      layoutsDir: path.resolve("./src/views/"),
      partialsDir: path.resolve("./src/views/"),
      defaultLayout: "",
    },
    viewPath: path.resolve("./src/views/"),
  };

  private mailSender = (mailOptions) => {
    transportMailer.sendMail(mailOptions, (err) => {
      if (err) {
        throw new ErrorHandler(424, "Email could not be sent.");
      }
    });

    return { message: "Email sent successfully." };
  };

  welcomeEmail = (data: IWelcomeEmail) => {
    transportMailer.use("compile", hbs(this.handlebarOptions));

    const mailOptions = {
      from: "sender@mail.com",
      to: "receiver@mail.com",
      subject: "Sign Up Confirmation",
      template: "welcomeEmail",
      context: {
        name: data.name,
        cpf: data.cpf,
        birthday: data.birthday,
        gender: data.gender,
        email: data.email,
        mobile: data.mobile,
        address: data.address,
      },
    };

    return this.mailSender(mailOptions);
  };

  pendingAppointmentsEmail = (data: IPendingEmail) => {
    transportMailer.use("compile", hbs(this.handlebarOptions));

    const mailOptions = {
      from: "sender@mail.com",
      to: "receiver@mail.com",
      subject: "Pending Appointment",
      template: "appointmentsEmail",
      context: {
        name: data.name,
        currentDateTime: data.currentDateTime,
        appointments: data.appointments,
        lengthAppointments: data.lengthAppointments,
      },
    };

    return this.mailSender(mailOptions);
  };
}

export default new mailerService();
