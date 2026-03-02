require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./database');

async function seed() {
  await connectDB();
  console.log('🌱 Seeding unified CRM...');

  const Role = require('../models/Role');
  const Employee = require('../models/Employee');
  const Task = require('../models/Task');
  const Client = require('../models/Client');
  const { Policy, Claim, Reminder, Target } = require('../models/OtherModels');

  await Promise.all([Role.deleteMany(),Employee.deleteMany(),Task.deleteMany(),Client.deleteMany(),Policy.deleteMany(),Claim.deleteMany(),Reminder.deleteMany(),Target.deleteMany()]);
  console.log('🗑  Cleared');

  const roles = await Role.insertMany([
    {name:'Admin',description:'Full access',color:'#6366f1',permissions:['all'],isSystem:true},
    {name:'Manager',description:'Team & reports',color:'#f59e0b',permissions:['clients','policies','claims','reminders','targets','reports','tasks','employees']},
    {name:'Senior Agent',description:'Senior ops',color:'#10b981',permissions:['clients','policies','claims','reminders','tasks']},
    {name:'Agent',description:'Field ops',color:'#3b82f6',permissions:['clients','policies','reminders','tasks']},
  ]);
  const password = await bcrypt.hash('password123',10);
  const employees = await Employee.insertMany([
    {name:'Arun Sharma',email:'arun@crm.com',phone:'+91 98765 43210',roleId:roles[0]._id,department:'Administration',status:'Active',avatar:'AS',password},
    {name:'Priya Mehta',email:'priya@crm.com',phone:'+91 98765 43211',roleId:roles[1]._id,department:'Sales',status:'Active',avatar:'PM',password},
    {name:'Vivek Kumar',email:'vivek@crm.com',phone:'+91 98765 43212',roleId:roles[2]._id,department:'Sales',status:'Active',avatar:'VK',password},
    {name:'Sneha Patel',email:'sneha@crm.com',phone:'+91 98765 43213',roleId:roles[3]._id,department:'Operations',status:'Active',avatar:'SP',password},
  ]);
  const clients = await Client.insertMany([
    {name:'Ajay Verma',email:'ajay@ex.com',phone:'+91 98765 11111',address:{city:'Mumbai',state:'Maharashtra',pincode:'400001'},clientType:'Individual',priority:'High',status:'Active',assignedAgent:employees[3]._id},
    {name:'Pooja Gupta',email:'pooja@ex.com',phone:'+91 98765 22222',address:{city:'Delhi',state:'Delhi',pincode:'110001'},clientType:'Individual',priority:'Medium',status:'Active',assignedAgent:employees[3]._id},
  ]);
  const policies = await Policy.insertMany([
    {client:clients[0]._id,policyNumber:'POL-001',policyType:'Life Insurance',company:'LIC',planName:'Jeevan Anand',premiumAmount:50000,premiumFrequency:'Yearly',sumAssured:1000000,policyTerm:20,startDate:new Date('2020-01-15'),maturityDate:new Date('2040-01-15'),renewalDate:new Date('2027-01-15'),status:'Active',assignedAgent:employees[3]._id},
  ]);
  await Claim.insertMany([{client:clients[1]._id,policy:policies[0]._id,claimNumber:'CLM-000001',claimType:'Medical',claimAmount:75000,incidentDate:new Date('2026-02-10'),status:'Under Review',priority:'High'}]);
  await Reminder.insertMany([{client:clients[0]._id,policy:policies[0]._id,reminderType:'Renewal',title:'LIC Renewal',dueDate:new Date(Date.now()+30*86400000),priority:'High',status:'Pending',amount:50000,assignedAgent:employees[3]._id}]);
  await Target.insertMany([{agent:employees[3]._id,targetPeriod:'Quarterly',startDate:new Date('2026-01-01'),endDate:new Date('2026-03-31'),productType:'All',targetAmount:5000000,achievedAmount:3200000,targetPolicies:50,achievedPolicies:32,status:'Active'}]);
  await Task.insertMany([
    {title:'Follow up with Ajay for renewal',description:'Call and send link',priority:'High',status:'In Progress',category:'Renewal',assignedTo:employees[3]._id,assignedBy:employees[0]._id,dueDate:new Date(Date.now()+7*86400000),tags:['LIC'],transferHistory:[]},
    {title:'Process HDFC claim',description:'Verify docs',priority:'Urgent',status:'Pending',category:'Claims',assignedTo:employees[2]._id,assignedBy:employees[0]._id,dueDate:new Date(Date.now()+3*86400000),tags:['HDFC'],transferHistory:[]},
  ]);
  console.log(`\n✅ Seed complete!\n   Login: arun@crm.com / password123\n`);
  process.exit(0);
}
seed().catch(e=>{console.error(e);process.exit(1);});
