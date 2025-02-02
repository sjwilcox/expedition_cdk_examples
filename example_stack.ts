import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { DB_NAME, DB_USERNAME, DB_INSTANCE_CLASS, VPC_CIDR, AWS_REGION } from './constants'; 

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  
    const vpc = new ec2.Vpc(this, 'AppVpc', {
      cidr: VPC_CIDR,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

  
    const dbPassword = new Secret(this, 'DatabasePassword', {
      secretStringValue: 'YourStrongPassword123!', // In real-world, generate and manage with Secrets Manager!
    });

    const db = new rds.DatabaseInstance(this, 'AppDb', {
      engine: rds.DatabaseEngine.mysql({ version: rds.MySqlEngineVersion.VER_8_0 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // Use InstanceType.of
      credentials: rds.Credentials.fromSecret(dbPassword),
      dbName: DB_NAME,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      multiAz: false,
      allocatedStorage: 20,
    });


    const ec2Instance = new ec2.Instance(this, 'AppInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), 
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.LATEST }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

  
    const rdsAccessRole = new iam.Role(this, 'RdsAccessRole', {
      assumedBy: ec2Instance.role,
    });

    db.grantConnect(rdsAccessRole);

    new cdk.CfnOutput(this, 'RdsEndpoint', { value: db.dbEndpoint.hostname });
  }
}
