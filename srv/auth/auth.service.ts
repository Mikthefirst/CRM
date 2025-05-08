import cds from "@sap/cds";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authResponce } from '../../types/types';

const SECRET = cds.env.jwt?.secret||'secret';
const TOKEN_EXPIRY = "1h";

console.log('JWT_SECRET: ', SECRET);
class AuthService extends cds.ApplicationService {
  private Customers: any;

  async init() {
    const { Customers } = this.entities;
    this.Customers = Customers;

    this.on("signUp", this.signUp.bind(this));
    this.on("signIn", this.signIn.bind(this));
  }

  async signUp(req: any): Promise<authResponce> {
    const { email, password, fullName, role } = req.data;

    if (!email || !password || !fullName || !role) {
      return req.reject(400, "All fields are required");
    }

    const existing = await SELECT.one.from(this.Customers).where({ email });
    if (existing) return req.reject(400, "Email has already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await INSERT.into(this.Customers).entries({
      email,
      password: hashed,
      fullName,
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

    return { message: "User registered successfully", token, err: "" };
  }

  async signIn(req: any): Promise<authResponce> {
    const { email, password } = req.data;
    const user = await SELECT.one.from(this.Customers).where({ email });

    if (!user) return req.reject(401, "Invalid credentials(email)");

    const valid = await bcrypt.compare(password, user.password);
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

module.exports = new AuthService();
