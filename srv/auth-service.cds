using { crm.db as db} from '../db/schema';

@path:'/auth'
service AuthService {

  @readonly
  entity Customers as projection on db.Customers;

  action signUp(name:String, email: String, password: String, company: String, country: String) returns String; 
  action signIn(email: String, password: String) returns authResponse; 
}

type authResponse {
  message : String;
  token   : String;
  err     : String;  
}
/*
 name        : String(100);
  email       : String(100) @unique;
  phone       : String(20);
  company     : String(100);
  country     : Country; 
*/