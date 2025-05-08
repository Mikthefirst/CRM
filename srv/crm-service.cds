using { 
  crm.db as db 
} from '../db/schema';

@path: '/crm'
service CRMService {

  entity Customers as projection on db.Customers 
    actions {
      action setVIPStatus(isVIP: Boolean);
    };

  entity CustomerInteractions as projection on db.CustomerInteractions;

  entity Problem as projection on db.Problem;

  entity CustomerCommunicationPreferences as projection on db.CustomerCommunicationPreferences;

  entity Feedback as projection on db.Feedback;

}
