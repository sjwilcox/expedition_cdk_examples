export const ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '123456789012'; 
export const STAGE = process.env.STAGE || 'dev'; // Default to 'dev'

export const DB_NAME = 'mydb';
export const DB_USERNAME = 'admin'; 
export const DB_INSTANCE_CLASS = 'db.t3.micro';
export const VPC_CIDR = '10.0.0.0/16';
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1'; // Default region
