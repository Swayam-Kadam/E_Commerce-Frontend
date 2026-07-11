import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import EditProductModal from '../component/EditProductModal';
import ConfirmModal from '../common/ConfirmModal';
import CommonMuiTable, { StatusChip } from '../common/CommonMuiTable';
import { getProduct, removeProductApi, deleteProduct } from '../slice';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';

const ManageProduct = () => {
  const dispatch = useDispatch();
  const { productList, productListLoading } = useSelector((state) => state.admin);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const categories = useMemo(() => {
    if (!productList?.length) return [];
    return [
      ...new Set(
        productList.map((product) => product.category).filter(Boolean)
      ),
    ].sort();
  }, [productList]);

  const filteredProducts = useMemo(() => {
    if (!productList?.length) return [];

    let filtered = [...productList];

    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm) ||
          String(product.price || '').includes(searchTerm)
      );
    }

    if (categoryQuery) {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === categoryQuery.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return filtered;
  }, [productList, query, categoryQuery, sortBy]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const productId = deleteTarget._id || deleteTarget.id;
      const res = await dispatch(removeProductApi(productId));
      if (res?.payload?.response?.data?.success || res?.payload?.response?.status === 200) {
        dispatch(deleteProduct(productId));
        toast.success('Product deleted successfully');
        setDeleteTarget(null);
        dispatch(getProduct());
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      id: 'image',
      label: 'Product',
      minWidth: 220,
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            src={row?.images?.[0]?.url || FALLBACK_IMAGE}
            alt={row.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {row.name || 'Unnamed'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }} noWrap>
              {(row._id || row.id || '').toString().slice(0, 10)}...
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {row.category || '—'}
        </Typography>
      ),
    },
    {
      id: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            ${Number(row.price || 0).toFixed(2)}
          </Typography>
          {row.originalPrice > row.price && (
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', textDecoration: 'line-through' }}
            >
              ${Number(row.originalPrice).toFixed(2)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'stock',
      label: 'Stock',
      sortable: true,
      render: (row) => (
        <StatusChip
          label={row.stock > 0 ? `${row.stock} in stock` : 'Out of stock'}
          color={row.stock > 0 ? 'success' : 'error'}
        />
      ),
    },
    {
      id: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (row) => (
        <Typography variant="body2">
          {Number(row.averageRating || 0).toFixed(1)} ★
        </Typography>
      ),
    },
    {
      id: 'isBestSeller',
      label: 'Badge',
      render: (row) =>
        row.isBestSeller ? (
          <StatusChip label="Bestseller" color="warning" />
        ) : (
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            —
          </Typography>
        ),
    },
  ];

  return (
    <>
      <CommonMuiTable
        title="Manage Products"
        subtitle="Search, filter, edit, and remove products from inventory"
        columns={columns}
        rows={filteredProducts}
        loading={productListLoading}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by name, category, or price..."
        onRefresh={() => dispatch(getProduct())}
        stats={[
          { label: 'Total Products', value: productList?.length || 0 },
          { label: 'Filtered', value: filteredProducts.length },
          { label: 'Categories', value: categories.length },
        ]}
        filterSlot={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price-low">Price (Low to High)</MenuItem>
                <MenuItem value="price-high">Price (High to Low)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        }
        actions={[
          {
            label: 'Edit',
            icon: <EditIcon fontSize="small" />,
            onClick: handleEdit,
          },
          {
            label: 'Delete',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: (row) => setDeleteTarget(row),
          },
        ]}
        emptyTitle={
          productList?.length ? 'No matching products' : 'No products found'
        }
        emptyDescription={
          productList?.length
            ? 'Try changing your search or filter criteria'
            : 'Add some products to get started'
        }
        emptyAction={
          productList?.length ? (
            <Button
              variant="outlined"
              onClick={() => {
                setQuery('');
                setCategoryQuery('');
                setSortBy('name');
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              component={Link}
              to="/admin/addproduct"
              variant="contained"
              sx={{ bgcolor: '#0289de', '&:hover': { bgcolor: '#0169ab' } }}
            >
              Add Product
            </Button>
          )
        }
      />

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
            dispatch(getProduct());
          }}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        type="delete"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ManageProduct;
