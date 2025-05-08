import cds from '@sap/cds'
import { 
  Customers,
  CustomerInteractions,
  Problem,
  CustomerCommunicationPreferences,
  Feedback
 } from '#cds-models/CRMService'

export class CRMService extends cds.ApplicationService { init() {

  this.before (['CREATE', 'UPDATE'], Customers, async (req) => {
    console.log('Before CREATE/UPDATE Customers', req.data)
  })
  this.after ('READ', Customers, async (customers, req) => {
    console.log('After READ Customers', customers)
  })
  this.before (['CREATE', 'UPDATE'], CustomerInteractions, async (req) => {
    console.log('Before CREATE/UPDATE CustomerInteractions', req.data)
  })
  this.after ('READ', CustomerInteractions, async (customerInteractions, req) => {
    console.log('After READ CustomerInteractions', customerInteractions)
  })
  this.before (['CREATE', 'UPDATE'], Problem, async (req) => {
    console.log('Before CREATE/UPDATE Problem', req.data)
  })
  this.after ('READ', Problem, async (problem, req) => {
    console.log('After READ Problem', problem)
  })
  this.before (['CREATE', 'UPDATE'], CustomerCommunicationPreferences, async (req) => {
    console.log('Before CREATE/UPDATE CustomerCommunicationPreferences', req.data)
  })
  this.after ('READ', CustomerCommunicationPreferences, async (customerCommunicationPreferences, req) => {
    console.log('After READ CustomerCommunicationPreferences', customerCommunicationPreferences)
  })
  this.before (['CREATE', 'UPDATE'], Feedback, async (req) => {
    console.log('Before CREATE/UPDATE Feedback', req.data)
  })
  this.after ('READ', Feedback, async (feedback, req) => {
    console.log('After READ Feedback', feedback)
  })


  return super.init()
}}
