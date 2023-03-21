import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as eks from "aws-cdk-lib/aws-eks";

export class ClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Look up the default VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, "VPC", { isDefault: true });

    // Create master role for EKS Cluster
    const iam_role = new iam.Role(this, id + "-iam", {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // Creating Cluster with EKS
    const eks_cluster = new eks.Cluster(this, id + "-cluster", {
      clusterName: id + "-cluster",
      vpc: defaultVpc,
      vpcSubnets: [
        {
          subnets: defaultVpc.publicSubnets,
        },
      ],
      mastersRole: iam_role,
      defaultCapacityInstance: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
      version: eks.KubernetesVersion.V1_25,
    });
  }
}
