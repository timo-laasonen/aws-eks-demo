import { App, Chart, ChartProps } from 'cdk8s';
import { Construct } from 'constructs';
import { IntOrString, KubeDeployment, KubeService } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Label used for tagging pods to link in the service
    const label = { app: "cdk8s"};

    // define resources here
    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'cdk8s',
                image: 'public.ecr.aws/s9u7u6x1/sample_app_001:no-db',
                ports: [ { containerPort: 80 } ]
              }
            ]
          }
        }
      }
    });

    // Creates the service to expose the pods to traffic from the loadbalancer
    new KubeService(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(80) } ],
        selector: label
      }
    });
  }
}

const app = new App();
new MyChart(app, 'cdk8s');
app.synth();
