import * as React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  MenuToggle,
  MenuToggleCheckbox,
  PageSection,
  Pagination,
  PaginationVariant,
  Progress,
  SearchInput,
  Tab,
  TabContentBody,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import type { OnPerPageSelect, OnSetPage } from '@patternfly/react-core/dist/esm/components/Pagination/Pagination';
import BugIcon from '@patternfly/react-icons/dist/esm/icons/bug-icon';
import CopyIcon from '@patternfly/react-icons/dist/esm/icons/copy-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/esm/icons/outlined-thumbs-down-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/esm/icons/outlined-thumbs-up-icon';
import PowerOffIcon from '@patternfly/react-icons/dist/esm/icons/power-off-icon';
import { Table, Tbody, Td, Th, type ThProps, Thead, Tr } from '@patternfly/react-table';
import { getTemplateById } from '@app/TemplateIndex/templateData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const CONTENT_EXAMPLE_TITLE = 'stepan-template-rhel9';

const RECOMMENDATION_PAGE_TITLE =
  'Kernel panic occurs due to a bug in the mitigation part of KVM for L1TF bug fix';

const RECOMMENDATION_DESCRIPTION =
  'Kernel panic occurs when the mitigation control for KVM is read or KVM guest is started on a system with L1TF mitigation without EPT support.';

function formatDetailLastModified(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) {
    return isoDate;
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface IDetailSystemRow {
  id: string;
  name: string;
  workspace: string;
  tags: string;
  os: string;
  lastSeen: string;
  firstImpacted: string;
}

interface IMalwareSignatureRow {
  id: string;
  signatureName: string;
  matched: string;
  newMatches: number;
  totalMatches: number;
}

const MOCK_SYSTEMS: IDetailSystemRow[] = [
  {
    id: 's1',
    name: 'web-frontend',
    workspace: 'AWS',
    tags: 'prod',
    os: 'RHEL 9',
    lastSeen: '15 minutes ago',
    firstImpacted: 'Mar 1, 2025',
  },
  {
    id: 's2',
    name: 'data-processor',
    workspace: 'Azure',
    tags: 'staging',
    os: 'RHEL 8',
    lastSeen: 'Aug 25, 2025',
    firstImpacted: 'Feb 12, 2025',
  },
  {
    id: 's3',
    name: 'api-gateway',
    workspace: 'GCP',
    tags: 'prod',
    os: 'RHEL 10',
    lastSeen: '2 hours ago',
    firstImpacted: 'Jan 5, 2025',
  },
  {
    id: 's4',
    name: 'batch-worker',
    workspace: 'Bare metal',
    tags: '—',
    os: 'RHEL 9',
    lastSeen: 'Yesterday',
    firstImpacted: 'Dec 18, 2024',
  },
  {
    id: 's5',
    name: 'cache-service',
    workspace: 'AWS',
    tags: 'dev',
    os: 'RHEL 8',
    lastSeen: 'Mar 20, 2025',
    firstImpacted: 'Nov 3, 2024',
  },
];

const MALWARE_SIGNATURES: IMalwareSignatureRow[] = [
  {
    id: 'm1',
    signatureName: 'XFTI_DarkRadiation_ransomware',
    matched: '25 Mar 2026',
    newMatches: 1,
    totalMatches: 1,
  },
  {
    id: 'm2',
    signatureName: 'XFTI_FinSpy',
    matched: '25 Mar 2026',
    newMatches: 2,
    totalMatches: 2,
  },
  {
    id: 'm3',
    signatureName: 'XFTI_QuasarRAT',
    matched: '25 Mar 2026',
    newMatches: 1,
    totalMatches: 1,
  },
  {
    id: 'm4',
    signatureName: 'XFTI_PoisonIvy',
    matched: '25 Mar 2026',
    newMatches: 1,
    totalMatches: 1,
  },
];

const TemplateDetail: React.FunctionComponent = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const template = templateId ? getTemplateById(templateId) : undefined;

  const isContentExamplePage = template?.id === '13';
  const isRecommendationPage = template?.id === '14';
  const isMalwarePage = template?.id === '15';
  const hasRepositoriesSystemsTabs = template?.id === '2' || template?.id === '13';
  const omitSectionDivider = hasRepositoriesSystemsTabs;
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(1);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = React.useState(false);
  const [isToolbarFilterOpen, setIsToolbarFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  const [searchValue, setSearchValue] = React.useState('');
  const [isRecommendationActionsOpen, setIsRecommendationActionsOpen] = React.useState(false);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [isToolbarKebabOpen, setIsToolbarKebabOpen] = React.useState(false);
  const [isMalwareActionsOpen, setIsMalwareActionsOpen] = React.useState(false);

  useDocumentTitle(
    template
      ? `Lightspeed template | ${isRecommendationPage ? 'Recommendation' : isMalwarePage ? 'Malware system detail page' : template.name}`
      : 'Lightspeed template | Page template',
  );

  const sortedSystems = React.useMemo(() => {
    const rows = [...MOCK_SYSTEMS];
    const keys: (keyof IDetailSystemRow)[] = ['name', 'workspace', 'tags', 'os', 'lastSeen', 'firstImpacted'];
    if (activeSortIndex !== null && activeSortDirection) {
      const key = keys[activeSortIndex];
      rows.sort((a, b) => {
        const cmp = String(a[key]).localeCompare(String(b[key]));
        return activeSortDirection === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [activeSortIndex, activeSortDirection]);

  const paginatedRows = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedSystems.slice(start, start + perPage);
  }, [sortedSystems, page, perPage]);

  if (!templateId || !template) {
    return <Navigate to="/systems" replace />;
  }

  const handleSetPage: OnSetPage = (_evt, newPage) => {
    setPage(newPage);
  };

  const handlePerPageSelect: OnPerPageSelect = (_evt, newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const setRowSelected = (row: IDetailSystemRow, isSelecting: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelecting) {
        next.add(row.id);
      } else {
        next.delete(row.id);
      }
      return next;
    });
  };

  const selectNone = () => setSelectedIds(new Set());
  const selectPage = () => setSelectedIds(new Set(paginatedRows.map((r) => r.id)));
  const selectAll = () => setSelectedIds(new Set(MOCK_SYSTEMS.map((r) => r.id)));

  const numSelected = selectedIds.size;
  const allRowsSelected = numSelected === MOCK_SYSTEMS.length && MOCK_SYSTEMS.length > 0;
  const anySelected = numSelected > 0;
  const headerCheckboxChecked: boolean | null = allRowsSelected ? true : anySelected ? null : false;
  const isRowSelected = (row: IDetailSystemRow) => selectedIds.has(row.id);

  const buildPagination = (variant: 'top' | 'bottom', isCompact: boolean) => (
    <Pagination
      isCompact={isCompact}
      itemCount={MOCK_SYSTEMS.length}
      page={page}
      perPage={perPage}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      variant={variant === 'top' ? PaginationVariant.top : PaginationVariant.bottom}
      titles={{
        paginationAriaLabel: `${variant} pagination`,
      }}
    />
  );

  const bulkSelectDropdown = (
    <Dropdown
      onSelect={(_event, value) => {
        if (value === 'all') {
          selectAll();
        } else if (value === 'page') {
          selectPage();
        } else {
          selectNone();
        }
        setIsBulkDropdownOpen(false);
      }}
      isOpen={isBulkDropdownOpen}
      onOpenChange={setIsBulkDropdownOpen}
      popperProps={{ appendTo: () => document.body }}
      toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
        <MenuToggle
          ref={toggleRef}
          isExpanded={isBulkDropdownOpen}
          onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
          aria-label="Select systems"
          splitButtonItems={[
            <MenuToggleCheckbox
              id="detail-systems-bulk-checkbox"
              key="bulk-checkbox"
              aria-label={anySelected ? 'Deselect all systems' : 'Select all systems'}
              isChecked={headerCheckboxChecked}
              onClick={() => {
                if (anySelected) {
                  selectNone();
                } else {
                  selectAll();
                }
              }}
            >
              {numSelected !== 0 ? `${numSelected} selected` : undefined}
            </MenuToggleCheckbox>,
          ]}
        />
      )}
    >
      <DropdownList>
        <DropdownItem value="none">Select none (0 items)</DropdownItem>
        <DropdownItem value="page">
          Select page ({paginatedRows.length} items)
        </DropdownItem>
        <DropdownItem value="all">Select all ({MOCK_SYSTEMS.length} items)</DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  const toolbarFilterDropdown = (
    <Dropdown
      isOpen={isToolbarFilterOpen}
      onOpenChange={setIsToolbarFilterOpen}
      popperProps={{ appendTo: () => document.body }}
      onSelect={() => setIsToolbarFilterOpen(false)}
      toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
        <MenuToggle
          ref={toggleRef}
          variant="default"
          isExpanded={isToolbarFilterOpen}
          onClick={() => setIsToolbarFilterOpen(!isToolbarFilterOpen)}
          aria-label="Filter systems by name"
        >
          Name
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem value="name">Name</DropdownItem>
        <DropdownItem value="os">Operating system</DropdownItem>
        <DropdownItem value="env">Environment</DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex ?? undefined,
      direction: activeSortDirection ?? undefined,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const systemsToolbarAndTable = (
    <div className="app-systems-toolbar-table-panel">
      <Toolbar ouiaId="template-detail-systems-toolbar" inset={{ default: 'insetNone' }} className="app-template-toolbar">
        <ToolbarContent>
          <ToolbarGroup className="app-template-toolbar-leading">
            <ToolbarItem className="app-toolbar-item-bulk">{bulkSelectDropdown}</ToolbarItem>
            <ToolbarItem className="app-toolbar-item-toolbar-filter">{toolbarFilterDropdown}</ToolbarItem>
            <ToolbarItem className="app-toolbar-item-search">
              <SearchInput
                aria-label="Filter by name"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                placeholder="Filter by name"
              />
            </ToolbarItem>
            <ToolbarItem className="app-toolbar-item-edit">
              <Button variant="primary">Plan remediation</Button>
            </ToolbarItem>
            <ToolbarItem className="app-toolbar-item-duplicate">
              <Button variant="plain" aria-label="Copy" icon={<CopyIcon />} />
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isToolbarKebabOpen}
                onOpenChange={setIsToolbarKebabOpen}
                popperProps={{ appendTo: () => document.body }}
                onSelect={() => setIsToolbarKebabOpen(false)}
                toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    isExpanded={isToolbarKebabOpen}
                    onClick={() => setIsToolbarKebabOpen(!isToolbarKebabOpen)}
                    aria-label="Actions"
                    icon={<EllipsisVIcon />}
                  />
                )}
              >
                <DropdownList>
                  <DropdownItem value="more">More actions</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            {buildPagination('top', true)}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <div className="app-systems-toolbar-table-panel__table pf-v6-u-w-100">
        <Table
          aria-label="Systems"
          borders
          gridBreakPoint="grid-md"
          variant="compact"
          className="pf-v6-u-w-100"
        >
          <Thead>
            <Tr>
              <Th screenReaderText="Row select" />
              <Th sort={getSortParams(0)}>Name</Th>
              <Th sort={getSortParams(1)}>Workspace</Th>
              <Th>Tags</Th>
              <Th sort={getSortParams(3)}>OS</Th>
              <Th sort={getSortParams(4)} info={{ tooltip: 'When this system was last seen.', ariaLabel: 'About Last seen' }}>
                Last seen
              </Th>
              <Th sort={getSortParams(5)}>First impacted</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRows.map((row, rowIndex) => (
              <Tr key={row.id}>
                <Td
                  select={{
                    rowIndex,
                    onSelect: (_event, isSelecting) => setRowSelected(row, isSelecting),
                    isSelected: isRowSelected(row),
                  }}
                />
                <Td dataLabel="Name">{row.name}</Td>
                <Td dataLabel="Workspace">{row.workspace}</Td>
                <Td dataLabel="Tags">{row.tags}</Td>
                <Td dataLabel="OS">{row.os}</Td>
                <Td dataLabel="Last seen">{row.lastSeen}</Td>
                <Td dataLabel="First impacted">{row.firstImpacted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {buildPagination('bottom', false)}
      </div>
    </div>
  );

  const repositoriesTabBody = (
    <TabContentBody hasPadding>
      <p className="pf-v6-u-m-0">Repositories linked to this template will appear here.</p>
    </TabContentBody>
  );

  const malwareToolbarAndTable = (
    <div className="app-systems-toolbar-table-panel">
      <Toolbar ouiaId="malware-signatures-toolbar" inset={{ default: 'insetNone' }} className="app-template-toolbar">
        <ToolbarContent>
          <ToolbarGroup className="app-template-toolbar-leading">
            <ToolbarItem className="app-toolbar-item-toolbar-filter">
              <Dropdown
                isOpen={isToolbarFilterOpen}
                onOpenChange={setIsToolbarFilterOpen}
                popperProps={{ appendTo: () => document.body }}
                onSelect={() => setIsToolbarFilterOpen(false)}
                toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="default"
                    isExpanded={isToolbarFilterOpen}
                    onClick={() => setIsToolbarFilterOpen(!isToolbarFilterOpen)}
                    aria-label="Filter by signature"
                  >
                    Signature
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value="signature">Signature</DropdownItem>
                  <DropdownItem value="last-match">Last match</DropdownItem>
                  <DropdownItem value="total-matches">Total matches</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem className="app-toolbar-item-search">
              <SearchInput
                aria-label="Filter by signature"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                placeholder="Filter by signature"
              />
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isToolbarKebabOpen}
                onOpenChange={setIsToolbarKebabOpen}
                popperProps={{ appendTo: () => document.body }}
                onSelect={() => setIsToolbarKebabOpen(false)}
                toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    isExpanded={isToolbarKebabOpen}
                    onClick={() => setIsToolbarKebabOpen(!isToolbarKebabOpen)}
                    aria-label="More actions"
                    icon={<EllipsisVIcon />}
                  />
                )}
              >
                <DropdownList>
                  <DropdownItem value="more">More actions</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <div className="app-systems-toolbar-table-panel__table pf-v6-u-w-100">
        <Table
          aria-label="Matched signatures"
          borders
          gridBreakPoint="grid-md"
          variant="compact"
          className="pf-v6-u-w-100"
        >
          <Thead>
            <Tr>
              <Th />
              <Th>Signature name</Th>
              <Th>Matched</Th>
              <Th>New matches...</Th>
              <Th>Total matches</Th>
            </Tr>
          </Thead>
          <Tbody>
            {MALWARE_SIGNATURES.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Expand">{'>'}</Td>
                <Td dataLabel="Signature name">{row.signatureName}</Td>
                <Td dataLabel="Matched">{row.matched}</Td>
                <Td dataLabel="New matches...">{row.newMatches}</Td>
                <Td dataLabel="Total matches">{row.totalMatches}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <PageSection type="breadcrumb" isWidthLimited={false} aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#">RHEL</BreadcrumbItem>
          <BreadcrumbItem to="#">Inventory</BreadcrumbItem>
          <BreadcrumbItem to={isMalwarePage ? '#' : '/systems'}>
            {isMalwarePage ? 'Malware detection signatures' : 'Page template'}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {isRecommendationPage ? 'Recommendation detail page' : isMalwarePage ? 'XFTI_FritzFrog' : template.name}
          </BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection
        hasBodyWrapper={false}
        isWidthLimited={false}
        aria-label="Template detail"
      >
        <Flex direction={{ default: 'column' }} className="pf-v6-u-w-100">
          {isRecommendationPage ? (
            <>
              <Flex
                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                alignItems={{ default: 'alignItemsFlexStart' }}
                flexWrap={{ default: 'wrap' }}
                className="pf-v6-u-mb-0 pf-v6-u-pb-0"
              >
                <FlexItem>
                  <Flex
                    spaceItems={{ default: 'spaceItemsMd' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                    flexWrap={{ default: 'wrap' }}
                  >
                    <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-0">
                      {RECOMMENDATION_PAGE_TITLE}
                    </Title>
                    <Label color="blue" variant="outline">
                      Stability
                    </Label>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isRecommendationActionsOpen}
                    onOpenChange={setIsRecommendationActionsOpen}
                    popperProps={{ appendTo: () => document.body }}
                    onSelect={() => setIsRecommendationActionsOpen(false)}
                    toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="secondary"
                        isExpanded={isRecommendationActionsOpen}
                        onClick={() => setIsRecommendationActionsOpen(!isRecommendationActionsOpen)}
                        aria-label="Actions"
                      >
                        Actions
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem value="ack">Acknowledge</DropdownItem>
                      <DropdownItem value="snooze">Snooze</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
              </Flex>

              <p className="pf-v6-u-m-0 pf-v6-u-mt-sm">Recommendation last modified on: 11 Dec 2018</p>

              <Grid hasGutter className="pf-v6-u-mt-sm pf-v6-u-w-100">
                <GridItem span={12} md={8}>
                  <Flex
                    direction={{ default: 'column' }}
                    spaceItems={{ default: 'spaceItemsMd' }}
                    alignItems={{ default: 'alignItemsFlexStart' }}
                    className="pf-v6-u-w-100"
                  >
                    <p className="pf-v6-u-m-0">{RECOMMENDATION_DESCRIPTION}</p>
                    <Button
                      variant="link"
                      isInline
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="right"
                      component="a"
                      href="https://access.redhat.com/documentation/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pf-v6-u-p-0"
                    >
                      Knowledgebase article
                    </Button>
                    <Flex
                      spaceItems={{ default: 'spaceItemsMd' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      flexWrap={{ default: 'wrap' }}
                    >
                      <span>Is this recommendation helpful?</span>
                      <Button variant="plain" aria-label="Mark as helpful">
                        <OutlinedThumbsUpIcon />
                      </Button>
                      <Button variant="plain" aria-label="Mark as not helpful">
                        <OutlinedThumbsDownIcon />
                      </Button>
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem span={12} md={4}>
                  <Card isFullHeight className="app-recommendation-total-risk-card pf-v6-u-w-100">
                    <CardBody className="pf-v6-u-p-md">
                      <Flex
                        direction={{ default: 'column' }}
                        spaceItems={{ default: 'spaceItemsSm' }}
                        alignItems={{ default: 'alignItemsFlexStart' }}
                        className="pf-v6-u-w-100"
                      >
                        <Flex
                          direction={{ default: 'column' }}
                          alignItems={{ default: 'alignItemsFlexStart' }}
                          className="pf-v6-u-w-100"
                        >
                          <Title headingLevel="h3" size="md" className="pf-v6-u-m-0">
                            Total risk
                          </Title>
                          <Label color="red" icon={<BugIcon />} isCompact className="pf-v6-u-mt-sm">
                            Critical
                          </Label>
                        </Flex>
                        <div className="app-recommendation-total-risk-card__progress-row">
                          <Progress
                            value={100}
                            title="Critical likelihood"
                            size="sm"
                            variant="danger"
                            measureLocation="none"
                            aria-label="Critical likelihood"
                            className="pf-v6-u-w-100"
                          />
                          <Progress
                            value={100}
                            title="Critical impact"
                            size="sm"
                            variant="danger"
                            measureLocation="none"
                            aria-label="Critical impact"
                            className="pf-v6-u-w-100"
                          />
                        </div>
                        <Divider className="pf-v6-u-w-100" />
                        <Flex
                          direction={{ default: 'column' }}
                          alignItems={{ default: 'alignItemsFlexStart' }}
                          className="pf-v6-u-w-100"
                        >
                          <Title headingLevel="h3" size="md" className="pf-v6-u-m-0">
                            Risk of change
                          </Title>
                          <Label color="orange" isCompact className="pf-v6-u-mt-sm">
                            Moderate
                          </Label>
                        </Flex>
                        <Content className="pf-v6-u-w-100">
                          <p className="pf-v6-u-m-0">
                            The risk of change is <strong>moderate</strong>, because the change will likely require an
                            outage window.
                          </p>
                        </Content>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <PowerOffIcon />
                          <span>System reboot is required.</span>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </>
          ) : isMalwarePage ? (
            <>
              <Flex
                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                alignItems={{ default: 'alignItemsCenter' }}
                flexWrap={{ default: 'wrap' }}
                className="pf-v6-u-mb-0 pf-v6-u-pb-0"
              >
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                    <Title headingLevel="h1" size="2xl" className="pf-v6-u-mb-0">
                      XFTI_FritzFrog
                    </Title>
                    <Label isCompact>Bot</Label>
                    <Label isCompact color="red">
                      Matched
                    </Label>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Dropdown
                    isOpen={isMalwareActionsOpen}
                    onOpenChange={setIsMalwareActionsOpen}
                    popperProps={{ appendTo: () => document.body }}
                    onSelect={() => setIsMalwareActionsOpen(false)}
                    toggle={(toggleRef: React.Ref<HTMLButtonElement | HTMLDivElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="secondary"
                        isExpanded={isMalwareActionsOpen}
                        onClick={() => setIsMalwareActionsOpen(!isMalwareActionsOpen)}
                        aria-label="Actions"
                      >
                        Actions
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem value="disable">Disable signature from malware analysis</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
              </Flex>

              <div className="pf-v6-u-m-0 pf-v6-u-mt-sm">
                <p className="pf-v6-u-m-0">Detects FritzFrog P2P botnet samples.</p>
                <Button
                  variant="link"
                  isInline
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  component="a"
                  href="#"
                  className="pf-v6-u-m-0 pf-v6-u-p-0"
                >
                  Background reference
                </Button>
              </div>

              <Grid hasGutter className="pf-v6-u-mt-md pf-v6-u-w-100">
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Matched systems</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <ExclamationCircleIcon color="#c9190b" />
                          <span>3/16</span>
                        </Flex>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last match</DescriptionListTerm>
                      <DescriptionListDescription>25 Mar 2026</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rule category</DescriptionListTerm>
                      <DescriptionListDescription>Malware Family</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Intended usage</DescriptionListTerm>
                      <DescriptionListDescription>Hunting and Identification</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Source</DescriptionListTerm>
                      <DescriptionListDescription>IBM</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
                <GridItem span={12} md={2}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Author</DescriptionListTerm>
                      <DescriptionListDescription>IBM X-Force Threat Intelligence Malware Team</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </GridItem>
              </Grid>
            </>
          ) : (
            <>
              <Flex
                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                alignItems={{ default: 'alignItemsFlexStart' }}
                flexWrap={{ default: 'wrap' }}
                className={hasRepositoriesSystemsTabs ? undefined : 'pf-v6-u-mb-0 pf-v6-u-pb-0'}
              >
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                    <Title headingLevel="h1" size="2xl" className={hasRepositoriesSystemsTabs ? undefined : 'pf-v6-u-mb-0'}>
                      {isContentExamplePage ? CONTENT_EXAMPLE_TITLE : template.name}
                    </Title>
                    {hasRepositoriesSystemsTabs ? (
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                        <Label color="blue">RHEL 9</Label>
                        <Label color="blue">aarch64</Label>
                      </Flex>
                    ) : (
                      <Label color="blue">RHEL 9</Label>
                    )}
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Button variant="secondary" aria-label="Edit template">
                    Edit
                  </Button>
                </FlexItem>
              </Flex>

              {isContentExamplePage ? (
                <div className="app-content-example-detail pf-v6-u-mt-sm pf-v6-u-mb-sm">
                  <div className="app-content-example-detail__grid">
                    <DescriptionList aria-label="Snapshot and author" isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Snapshot date</DescriptionListTerm>
                        <DescriptionListDescription>
                          Using latest content from repositories
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created by</DescriptionListTerm>
                        <DescriptionListDescription>insights-qa</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <DescriptionList aria-label="Created" isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created</DescriptionListTerm>
                        <DescriptionListDescription>07 Jan 2026</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <DescriptionList aria-label="Last edited" isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Last edited by</DescriptionListTerm>
                        <DescriptionListDescription>insights-qa</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Last edited</DescriptionListTerm>
                        <DescriptionListDescription>07 Jan 2026</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </div>
                </div>
              ) : (
                <div className="pf-v6-u-m-0 pf-v6-u-mt-sm">
                  <p className="pf-v6-u-m-0">{template.description}</p>
                  <p className="pf-v6-u-m-0">Last modified on: {formatDetailLastModified(template.lastModified)}</p>
                </div>
              )}
            </>
          )}
          {!isContentExamplePage && !isRecommendationPage && !isMalwarePage && (
            <Link to="/systems" className="pf-v6-c-button pf-m-link pf-m-inline pf-v6-u-mt-sm">
              Back to templates
            </Link>
          )}
        </Flex>
      </PageSection>

      {!omitSectionDivider && <Divider className="app-template-detail-section-divider" />}

      <PageSection
        type={hasRepositoriesSystemsTabs ? 'tabs' : 'default'}
        hasBodyWrapper
        isWidthLimited={false}
        aria-label={hasRepositoriesSystemsTabs ? 'Template tabs' : isMalwarePage ? 'Matched signatures' : 'Systems'}
        className={`app-systems-page app-template-detail-systems-section${hasRepositoriesSystemsTabs ? ' app-tabbed-detail-systems-section' : ''} ${hasRepositoriesSystemsTabs ? 'pf-v6-u-mb-sm' : 'pf-v6-u-mb-md'}`}
      >
        {hasRepositoriesSystemsTabs ? (
          <Tabs
            id="template-detail-repositories-systems-tabs"
            ouiaId="template-detail-repositories-systems-tabs"
            activeKey={activeTabKey}
            onSelect={(_event, key) => setActiveTabKey(key)}
            aria-label="Repositories and systems"
            usePageInsets
            className="pf-v6-u-w-100"
          >
            <Tab eventKey={0} title={<TabTitleText>Repositories</TabTitleText>}>
              {repositoriesTabBody}
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Systems</TabTitleText>}>
              {systemsToolbarAndTable}
            </Tab>
          </Tabs>
        ) : isMalwarePage ? (
          <Flex direction={{ default: 'column' }} className="pf-v6-u-w-100">
            <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-0 pf-v6-u-mb-md">
              Matched signatures
            </Title>
            {malwareToolbarAndTable}
          </Flex>
        ) : (
          <Flex direction={{ default: 'column' }} className="pf-v6-u-w-100">
            <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-0 pf-v6-u-mb-md">
              Systems
            </Title>
            {systemsToolbarAndTable}
          </Flex>
        )}
      </PageSection>
    </>
  );
};

export { TemplateDetail };
