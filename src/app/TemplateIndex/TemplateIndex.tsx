import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleCheckbox,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import type { OnPerPageSelect, OnSetPage } from '@patternfly/react-core/dist/esm/components/Pagination/Pagination';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ITemplateRow, allRows } from '@app/TemplateIndex/templateData';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const TemplateIndex: React.FunctionComponent = () => {
  useDocumentTitle('Lightspeed template | Page template');

  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  const [searchValue, setSearchValue] = React.useState('');
  const [isToolbarFilterOpen, setIsToolbarFilterOpen] = React.useState(false);

  const paginatedRows = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return allRows.slice(start, start + perPage);
  }, [page, perPage]);

  const handleSetPage: OnSetPage = (_evt, newPage) => {
    setPage(newPage);
  };

  const handlePerPageSelect: OnPerPageSelect = (_evt, newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const setRowSelected = (row: ITemplateRow, isSelecting: boolean) => {
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

  const selectPage = () => {
    setSelectedIds(new Set(paginatedRows.map((r) => r.id)));
  };

  const selectAll = () => {
    setSelectedIds(new Set(allRows.map((r) => r.id)));
  };

  const numSelected = selectedIds.size;
  const allRowsSelected = numSelected === allRows.length && allRows.length > 0;
  const anySelected = numSelected > 0;
  const headerCheckboxChecked: boolean | null = allRowsSelected ? true : anySelected ? null : false;

  const isRowSelected = (row: ITemplateRow) => selectedIds.has(row.id);

  const buildPagination = (variant: 'top' | 'bottom', isCompact: boolean) => (
    <Pagination
      isCompact={isCompact}
      itemCount={allRows.length}
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
          aria-label="Select templates"
          splitButtonItems={[
            <MenuToggleCheckbox
              id="template-bulk-checkbox"
              key="bulk-checkbox"
              aria-label={anySelected ? 'Deselect all templates' : 'Select all templates'}
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
        <DropdownItem value="all">Select all ({allRows.length} items)</DropdownItem>
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
          aria-label="Filter templates by name"
        >
          Name
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem value="name">Name</DropdownItem>
        <DropdownItem value="recent">Recently modified</DropdownItem>
        <DropdownItem value="name-az">Name A–Z</DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  return (
    <>
      <PageSection type="breadcrumb" isWidthLimited={false} aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#">RHEL</BreadcrumbItem>
          <BreadcrumbItem to="#">Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Page template</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false} isWidthLimited={false} aria-label="Page template title">
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'wrap' }}
          className="pf-v6-u-w-100"
        >
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Page template
            </Title>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection
        hasBodyWrapper
        isWidthLimited={false}
        aria-label="Page templates"
        className="app-systems-page app-page-templates-section pf-v6-u-mb-md"
      >
        <div className="app-systems-toolbar-table-panel pf-v6-u-w-100">
          <Toolbar
            ouiaId="template-toolbar"
            inset={{ default: 'insetNone' }}
            className="app-template-toolbar"
          >
            <ToolbarContent>
              <ToolbarGroup className="app-template-toolbar-leading">
                <ToolbarItem className="app-toolbar-item-bulk">{bulkSelectDropdown}</ToolbarItem>
                <ToolbarItem className="app-toolbar-item-toolbar-filter">{toolbarFilterDropdown}</ToolbarItem>
                <ToolbarItem className="app-toolbar-item-search">
                  <SearchInput
                    aria-label="Search templates"
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                    placeholder="Find by name"
                  />
                </ToolbarItem>
                <ToolbarItem className="app-toolbar-item-export">
                  <Button variant="secondary">Export</Button>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                {buildPagination('top', true)}
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table
            aria-label="Page templates"
            borders
            gridBreakPoint="grid-md"
            variant="compact"
            className="pf-v6-u-w-100"
          >
            <Thead>
              <Tr>
                <Th screenReaderText="Row select" />
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Last modified</Th>
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
                  <Td dataLabel="Name">
                    <Link to={`/systems/${row.id}`} className="pf-v6-c-button pf-m-link pf-m-inline">
                      {row.name}
                    </Link>
                  </Td>
                  <Td dataLabel="Description">{row.description}</Td>
                  <Td dataLabel="Last modified">{row.lastModified}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {buildPagination('bottom', false)}
        </div>
      </PageSection>
    </>
  );
};

export { TemplateIndex };
