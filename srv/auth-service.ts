import { Customer } from './../@cds-models/crm/db/index';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authResponce } from "../types/types";

import cds from "@sap/cds";
import { Customers, signUp, signIn } from "#cds-models/AuthService";
const SECRET = cds.env.jwt?.secret || "secret";
const TOKEN_EXPIRY = "1h";

export class AuthService extends cds.ApplicationService {
  init() {
    this.before(["CREATE", "UPDATE"], Customers, async (req) => {
      console.log("Before CREATE/UPDATE Customers", req.data);
    });
    this.after("READ", Customers, async (customers, req) => {
      console.log("After READ Customers", customers);
    });

    this.on(signUp, async (req) => {
      return await this.signUpImpl(req);
    });
    this.on(signIn, async (req) => {
      return await this.signInImpl(req);
    });

    return super.init();
  }

  async signUpImpl(req: any): Promise<authResponce> {
    const { email, password, name, role } = req.data;
    console.log("Sign Up called");
    if (!email || !password || !name) {
      return req.reject(400, "All fields are required");
    }

    const existing = await SELECT.one.from(Customers).where({ email });
    if (existing) return req.reject(400, "Email has already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await INSERT.into(Customers).entries({
      email,
      password: hashed,
      name,
      role,
    });
    const token = jwt.sign(
      {
        id: user.ID,
        email: email,
        role: role,
      },
      String(SECRET),
      { expiresIn: TOKEN_EXPIRY }
    );

    console.log("token SignUP: ", token);

    return { token, message: "User has registred succesfully", err: "" };
  }
  async signInImpl(req: any): Promise<authResponce> {
    console.log(req.data);
    const { email, password } = req.data;
    const user = await SELECT.one.from(Customers).where({ email });

    if (!user) return req.reject(401, "Invalid credentials(email)");
    let valid;
    if (user.password) valid = await bcrypt.compare(password, user.password);
    else req.reject(500, "Incorrect account");

    if (!valid) return req.reject(401, "Invalid credentials(password)");

    const token = jwt.sign(
      {
        id: user.ID,
        email: user.email,
        role: user.role,
      },
      String(SECRET),
      { expiresIn: TOKEN_EXPIRY }
    );

    console.log("token SignIN: ", token);
    return { message: "User has logined", token: token, err: "" };
  }
}
