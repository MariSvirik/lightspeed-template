export interface ITemplateRow {
  id: string;
  name: string;
  description: string;
  lastModified: string;
}

/** ISO date string (YYYY-MM-DD) for detail page formatting */
export const allRows: ITemplateRow[] = [
  {
    id: '1',
    name: 'Detail page',
    description: 'Baseline RHEL 9 image for web workloads.',
    lastModified: '2025-03-10',
  },
  {
    id: '2',
    name: 'Tab detail',
    description: 'Template with Repositories and Systems tabs.',
    lastModified: '2025-03-08',
  },
  {
    id: '13',
    name: 'Content example',
    description: 'Content example with metadata layout.',
    lastModified: '2026-01-07',
  },
  {
    id: '14',
    name: 'Recommendation',
    description: 'Recommendation detail prototype.',
    lastModified: '2018-12-11',
  },
  {
    id: '3',
    name: 'edge-node-bundle',
    description: 'Edge deployment bundle with custom kickstart.',
    lastModified: '2025-02-28',
  },
  {
    id: '4',
    name: 'sap-hana-pattern',
    description: 'SAP HANA sizing and storage layout.',
    lastModified: '2025-02-15',
  },
  {
    id: '5',
    name: 'openshift-workers',
    description: 'Worker node pool for OpenShift installs.',
    lastModified: '2025-01-22',
  },
  {
    id: '6',
    name: 'compliance-hardened',
    description: 'STIG-oriented package set and services.',
    lastModified: '2025-01-05',
  },
  {
    id: '7',
    name: 'developer-workstation',
    description: 'Dev tools and container runtime pre-installed.',
    lastModified: '2024-12-18',
  },
  {
    id: '8',
    name: 'gpu-compute',
    description: 'NVIDIA drivers and CUDA stack.',
    lastModified: '2024-12-01',
  },
  {
    id: '9',
    name: 'minimal-iso',
    description: 'Minimal install footprint for kiosks.',
    lastModified: '2024-11-20',
  },
  {
    id: '10',
    name: 'high-availability-pair',
    description: 'Pacemaker and shared storage baseline.',
    lastModified: '2024-11-02',
  },
  {
    id: '11',
    name: 'legacy-migration',
    description: 'RHEL 7 to 9 migration helper packages.',
    lastModified: '2024-10-12',
  },
  {
    id: '12',
    name: 'immutable-core',
    description: 'rpm-ostree style immutable root.',
    lastModified: '2024-09-30',
  },
];

export function getTemplateById(id: string): ITemplateRow | undefined {
  return allRows.find((row) => row.id === id);
}
