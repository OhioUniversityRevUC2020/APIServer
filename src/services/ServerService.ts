import { Service, Inject } from 'typedi';
import { KnexService } from './KnexService';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';
import crypto from 'crypto';

/*
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURERENDQWZTZ0F3SUJBZ0lSQU1qdERubktXcko3UWg2NGh1cEhCcUl3RFFZSktvWklodmNOQVFFTEJRQXcKTHpFdE1Dc0dBMVVFQXhNa1pXSm1NVEV6T0RFdE9EWm1PQzAwWTJZMUxXRTNNell0WVdReE1HSTFPR0V6TmpkaQpNQjRYRFRJd01ESXlNakUzTURVeE1Wb1hEVEkxTURJeU1ERTRNRFV4TVZvd0x6RXRNQ3NHQTFVRUF4TWtaV0ptCk1URXpPREV0T0RabU9DMDBZMlkxTFdFM016WXRZV1F4TUdJMU9HRXpOamRpTUlJQklqQU5CZ2txaGtpRzl3MEIKQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcU1IUkVCREgrOWI1bW5lWDFqZUo1MlZkeTNSb1lpNUV2Tm5WZ3Q3VAowNHM2Z24xZHBTNTExMmF2bEtBKzFLaVpLTDJSUWVjN1ZLK0d0VUhxNGdhMDRnc3dORUEzTXNBdDFwUnBNa2tnCjQxTmczb1VqUVFxWlM5aEwrT3FVa2dkNHllU2xwTVM2SHQxYkN1RWNOcWVERWF5T2N2UlNMMDhtSURVVi8vN3EKNVFKdlZFTkpSY0RVcDczdVNQWjhRNm1rWHBXWitLQWJPUDJodEtnelpCVktBbnRNNkFjM1dUaE41YU9KRzlaNgpoZGxCQ203QVVNNW9SaTBBQ2pTSE9qclNIZlRaT0pKeWxXTFRPL1Z2VVRsZWhjNnR0N05EQ003anYrSzBYN2dzCkczRDlvc1QwYjV0SkJmRS9JeXhjcitRT1FOL3duNDdMUnJFRTdTRlhUQjIvYlFJREFRQUJveU13SVRBT0JnTlYKSFE4QkFmOEVCQU1DQWdRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQQpoQnF3NDAxbk1VUlBETVMvM1FSY3hNaGRUOWM0akNjRy9EaFFHRllMaUJHdGJCTkpWd0RnTDBMbkRwK2pNWTl4Cm4ydk0vRFFxUzhFWGU2QlRqOXl0OWE0MmFzVTA0QzRrc3Z1OWUwNUREck9HWnNCeXhOdk4xQzVROHJkYThqVFgKSUxTL1V3d1RQbmRlb0dTb2tkOUlYVjhnWS9WN3lpbzZFZEtpMzh4OWlIeDRqTTdvZEpEbUJ4dGFZa0ZkQXlaaQpSaE4wSnZSbk9ydE5CZ1NYSXZVbVBoSW9tU3AvckNCb0Z6RSs3MGp0dDZFZGg3cVpBNitPa1ZVUk1uMHc4ODJlCk5GenRrRU1PQ09vOGIzRlYzSTdMNXBINTNLMU0wNzJVKzRxdVhtSmZQYS9WaHJWWmNLcHNtV3ppUzJ5STZjUWQKWSs0M2VGNC9OOU55V1NNQ09IS0xHQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://35.223.65.24
  name: gke_revolution-uc-2020_us-central1-a_main-cluster
*/

const kc = new KubeConfig();
kc.addCluster({
  caData:
    'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURERENDQWZTZ0F3SUJBZ0lSQU1qdERubktXcko3UWg2NGh1cEhCcUl3RFFZSktvWklodmNOQVFFTEJRQXcKTHpFdE1Dc0dBMVVFQXhNa1pXSm1NVEV6T0RFdE9EWm1PQzAwWTJZMUxXRTNNell0WVdReE1HSTFPR0V6TmpkaQpNQjRYRFRJd01ESXlNakUzTURVeE1Wb1hEVEkxTURJeU1ERTRNRFV4TVZvd0x6RXRNQ3NHQTFVRUF4TWtaV0ptCk1URXpPREV0T0RabU9DMDBZMlkxTFdFM016WXRZV1F4TUdJMU9HRXpOamRpTUlJQklqQU5CZ2txaGtpRzl3MEIKQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcU1IUkVCREgrOWI1bW5lWDFqZUo1MlZkeTNSb1lpNUV2Tm5WZ3Q3VAowNHM2Z24xZHBTNTExMmF2bEtBKzFLaVpLTDJSUWVjN1ZLK0d0VUhxNGdhMDRnc3dORUEzTXNBdDFwUnBNa2tnCjQxTmczb1VqUVFxWlM5aEwrT3FVa2dkNHllU2xwTVM2SHQxYkN1RWNOcWVERWF5T2N2UlNMMDhtSURVVi8vN3EKNVFKdlZFTkpSY0RVcDczdVNQWjhRNm1rWHBXWitLQWJPUDJodEtnelpCVktBbnRNNkFjM1dUaE41YU9KRzlaNgpoZGxCQ203QVVNNW9SaTBBQ2pTSE9qclNIZlRaT0pKeWxXTFRPL1Z2VVRsZWhjNnR0N05EQ003anYrSzBYN2dzCkczRDlvc1QwYjV0SkJmRS9JeXhjcitRT1FOL3duNDdMUnJFRTdTRlhUQjIvYlFJREFRQUJveU13SVRBT0JnTlYKSFE4QkFmOEVCQU1DQWdRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQQpoQnF3NDAxbk1VUlBETVMvM1FSY3hNaGRUOWM0akNjRy9EaFFHRllMaUJHdGJCTkpWd0RnTDBMbkRwK2pNWTl4Cm4ydk0vRFFxUzhFWGU2QlRqOXl0OWE0MmFzVTA0QzRrc3Z1OWUwNUREck9HWnNCeXhOdk4xQzVROHJkYThqVFgKSUxTL1V3d1RQbmRlb0dTb2tkOUlYVjhnWS9WN3lpbzZFZEtpMzh4OWlIeDRqTTdvZEpEbUJ4dGFZa0ZkQXlaaQpSaE4wSnZSbk9ydE5CZ1NYSXZVbVBoSW9tU3AvckNCb0Z6RSs3MGp0dDZFZGg3cVpBNitPa1ZVUk1uMHc4ODJlCk5GenRrRU1PQ09vOGIzRlYzSTdMNXBINTNLMU0wNzJVKzRxdVhtSmZQYS9WaHJWWmNLcHNtV3ppUzJ5STZjUWQKWSs0M2VGNC9OOU55V1NNQ09IS0xHQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K',
  server: 'https://35.223.65.24',
  name: 'main',
  skipTLSVerify: false,
});

kc.addUser({
  token: process.env.K8S_TOKEN || '',
  name: 'main',
});

kc.addContext({
  cluster: 'main',
  user: 'main',
  name: 'main',
});

kc.setCurrentContext('main');

const k8sApi = kc.makeApiClient(CoreV1Api);

@Service()
export class ServerService {
  @Inject()
  private knexService!: KnexService;

  async createServer(name: string, creatorId: string): Promise<string> {
    const id = 'minecraft-' + crypto.randomBytes(10).toString('hex');
    await k8sApi.createNamespacedPod('minecraft', {
      metadata: {
        name: id,
        labels: {
          app: id,
        },
      },
      spec: {
        containers: [
          {
            name: 'server',
            image: 'gcr.io/revolution-uc-2020/spigot:1.0.0',
            ports: [
              {
                containerPort: 25565,
              },
            ],
          },
        ],
      },
    });
    await k8sApi.createNamespacedService('minecraft', {
      metadata: {
        name: id,
        labels: {
          app: id,
        },
      },
      spec: {
        type: 'NodePort',
        ports: [
          {
            port: 25565,
            protocol: 'TCP',
            name: 'minecraft',
          },
        ],
        selector: {
          app: id,
        },
      },
    });
    const service = await k8sApi.readNamespacedService(id, 'minecraft');
    if (service.body.spec && service.body.spec.ports && service.body.spec.ports[0].nodePort) {
      return service.body.spec.ports[0].nodePort.toString();
    }
    return '';
  }
  // async startServer(ip: string) {}
}
