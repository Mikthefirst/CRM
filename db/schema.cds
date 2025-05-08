namespace crm.db;
using {  cuid, managed, Language, Country} from '@sap/cds/common';

entity Customers : cuid, managed {
  name        : String(100);
  email       : String(100) @unique;
  password    :String(20);
  phone       : String(20);
  company     : String(100);
  country     : Country; 
  isVIP       : Boolean default false;
  status      : Association to CustomerStatusCodes;
  notes       : String(500);
  role: Role default 'admin';
}

entity Problem : cuid, managed {
    customer: Association to Customers;
    name:String(100);
    description: String(1000);
    urgency: Urgency;
    resolved: Boolean;
}

//(CustomerInteractions) — interaction history .
entity CustomerInteractions : cuid, managed {
  customer    : Association to Customers;
  subject     : String(200);
  description : String(1000);
  date        : Timestamp;
  status      : String(10) @assert.range enum{Completed; Failed; Delayed}; 
  priority    : Urgency; 
}

entity CustomerCommunicationPreferences : cuid {
  customer    : Association to Customers;
  language    : Language;
  comfortTime : Timestamp;
  specificInfo: String(300); 
}

entity Feedback : cuid, managed {
  customer    : Association to Customers;
  type        : String(15) @assert.range enum {Complaint; Suggestion; Praise};
  message     : String(1000);
  rating      : Integer @assert.range:[1, 5];
}


//could be used for email-spam mb
entity CustomerStatusCodes : cuid {
  code        : String(20) @unique; // 'ACTIVE', 'INACTIVE', 'LEAD'
  description : String(100);
}

type Urgency: String enum{
Hign; 
Medium;
Low;
}

type Role: String enum{
admin; 
support;
customer;
}




