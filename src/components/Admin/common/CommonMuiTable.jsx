import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => {
        const aVal = a?.[orderBy];
        const bVal = b?.[orderBy];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') return bVal - aVal;
        return String(bVal).localeCompare(String(aVal), undefined, { sensitivity: 'base' });
      }
    : (a, b) => {
        const aVal = a?.[orderBy];
        const bVal = b?.[orderBy];
        if (aVal === bVal) return 0;
        if (aVal == null) return -1;
        if (bVal == null) return 1;
        if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
        return String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
      };
};

/**
 * Reusable MUI admin data table.
 *
 * columns: [{ id, label, sortable?, minWidth?, align?, render?(row) }]
 * actions: [{ label, icon, onClick(row), color?, disabled?(row) }]
 */
const CommonMuiTable = ({
  title,
  subtitle,
  columns = [],
  rows = [],
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterSlot = null,
  stats = [],
  actions = [],
  onRefresh,
  emptyTitle = 'No data found',
  emptyDescription = 'There is nothing to show yet.',
  emptyAction = null,
  getRowId = (row) => row._id || row.id,
  defaultRowsPerPage = 10,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort(getComparator(order, orderBy));
  }, [rows, order, orderBy]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {onRefresh && (
          <Tooltip title="Refresh">
            <IconButton
              onClick={onRefresh}
              sx={{
                bgcolor: '#0289de',
                color: '#fff',
                '&:hover': { bgcolor: '#0169ab' },
              }}
              style={{width: '40px', height: '40px'}}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {stats.length > 0 && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                border: '1px solid #e2e8f0',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          {onSearchChange && (
            <TextField
              size="small"
              value={searchValue}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              sx={{ minWidth: { xs: '100%', md: 280 }, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          {filterSlot}
        </Stack>

        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      minWidth: column.minWidth || 100,
                      bgcolor: '#f8fafc',
                      fontWeight: 700,
                      color: '#334155',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: '#f8fafc',
                      fontWeight: 700,
                      color: '#334155',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length ? 1 : 0)}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress size={36} sx={{ color: '#0289de' }} />
                  </TableCell>
                </TableRow>
              ) : pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length ? 1 : 0)}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Typography variant="h6" sx={{ color: '#0f172a', mb: 1 }}>
                      {emptyTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      {emptyDescription}
                    </Typography>
                    {emptyAction}
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((row) => (
                  <TableRow
                    hover
                    key={getRowId(row)}
                    sx={{ '&:last-child td': { border: 0 } }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{ color: '#334155', verticalAlign: 'middle' }}
                      >
                        {column.render
                          ? column.render(row)
                          : row?.[column.id] ?? '—'}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          {actions.map((action) => {
                            const disabled = action.disabled?.(row) || false;
                            return (
                              <Tooltip key={action.label} title={action.label}>
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={disabled}
                                    onClick={() => action.onClick(row)}
                                    sx={{
                                      color:
                                        action.color === 'error'
                                          ? '#e11d48'
                                          : action.color === 'success'
                                            ? '#059669'
                                            : '#0289de',
                                    }}
                                  >
                                    {action.icon}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            );
                          })}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};

export const StatusChip = ({ label, color = 'default' }) => (
  <Chip
    size="small"
    label={label}
    color={color}
    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
  />
);

export default CommonMuiTable;
