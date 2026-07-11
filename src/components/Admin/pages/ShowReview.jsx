import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import CommonMuiTable, { StatusChip } from '../common/CommonMuiTable';
import ConfirmModal from '../common/ConfirmModal';
import { getAllReview, removeReviewApi } from '../slice';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';

const ShowReview = () => {
  const dispatch = useDispatch();
  const { reviewList, reviewLoadingList } = useSelector((state) => state.admin);

  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    dispatch(getAllReview());
  }, [dispatch]);

  const reviews = useMemo(() => {
    const reviewsData = reviewList?.data?.data;
    if (!Array.isArray(reviewsData)) return [];

    return reviewsData.map((review, index) => {
      const user = review.user;
      let userName = 'Anonymous User';
      let userEmail = '';

      if (user && typeof user === 'object') {
        userName =
          user.profile?.firstName ||
          user.username ||
          user.name ||
          `User ${(user._id || '').toString().slice(0, 6)}`;
        userEmail = user.email || '';
      } else if (typeof user === 'string') {
        userName = `User ${user.slice(0, 6)}...`;
      }

      const product = review.product;
      let productName = 'Unknown Product';
      let productImage = FALLBACK_IMAGE;
      let productCategory = '—';
      let productPrice = 0;

      if (product && typeof product === 'object') {
        productName = product.name || productName;
        productImage = product.images?.[0]?.url || product.image || productImage;
        productCategory = product.category || productCategory;
        productPrice = product.price || 0;
      } else if (typeof product === 'string') {
        productName = `Product ${product.slice(0, 6)}...`;
      }

      return {
        id: review._id || `review-${index}`,
        _id: review._id,
        userName,
        userEmail,
        rating: review.rating || 0,
        review: review.comment || '',
        date: review.createdAt || new Date().toISOString(),
        verified: Boolean(review.isVerified),
        productName,
        productImage,
        productCategory,
        productPrice,
      };
    });
  }, [reviewList]);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (filterRating !== 'all') {
      list = list.filter((review) => review.rating === parseInt(filterRating, 10));
    }

    if (query.trim()) {
      const term = query.toLowerCase().trim();
      list = list.filter(
        (review) =>
          review.userName.toLowerCase().includes(term) ||
          review.productName.toLowerCase().includes(term) ||
          review.review.toLowerCase().includes(term) ||
          review.userEmail.toLowerCase().includes(term)
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return list;
  }, [reviews, filterRating, sortBy, query]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      : '0.0';

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    try {
      const res = await dispatch(removeReviewApi(deleteTarget._id));
      if (res?.payload?.response?.data?.success || res?.payload?.response?.status === 200) {
        toast.success('Review deleted successfully');
        setDeleteTarget(null);
        dispatch(getAllReview());
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      id: 'productName',
      label: 'Product',
      minWidth: 220,
      sortable: true,
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            src={row.productImage}
            alt={row.productName}
            sx={{ width: 48, height: 48 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {row.productName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }} noWrap>
              {row.productCategory}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'userName',
      label: 'Customer',
      minWidth: 160,
      sortable: true,
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.userName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {row.userEmail || '—'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'rating',
      label: 'Rating',
      sortable: true,
      minWidth: 140,
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Rating value={row.rating} readOnly size="small" />
          <Typography variant="caption">{row.rating}.0</Typography>
        </Stack>
      ),
    },
    {
      id: 'review',
      label: 'Comment',
      minWidth: 240,
      render: (row) => (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 280,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={row.review}
        >
          {row.review || '—'}
        </Typography>
      ),
    },
    {
      id: 'verified',
      label: 'Status',
      render: (row) =>
        row.verified ? (
          <StatusChip label="Verified" color="success" />
        ) : (
          <StatusChip label="Unverified" color="default" />
        ),
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <Typography variant="body2">
          {new Date(row.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <CommonMuiTable
        title="Customer Reviews"
        subtitle="Browse, filter, and manage product reviews in one place"
        columns={columns}
        rows={filteredReviews}
        loading={reviewLoadingList}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by customer, product, or comment..."
        onRefresh={() => dispatch(getAllReview())}
        stats={[
          { label: 'Total Reviews', value: reviews.length },
          { label: 'Average Rating', value: averageRating },
          { label: 'Showing', value: filteredReviews.length },
        ]}
        filterSlot={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                label="Rating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="highest">Highest Rated</MenuItem>
                <MenuItem value="lowest">Lowest Rated</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        }
        actions={[
          {
            label: 'View',
            icon: <VisibilityIcon fontSize="small" />,
            onClick: (row) => setViewTarget(row),
          },
          {
            label: 'Delete',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: (row) => setDeleteTarget(row),
          },
        ]}
        emptyTitle={
          reviews.length ? 'No reviews match your filters' : 'No reviews yet'
        }
        emptyDescription={
          reviews.length
            ? 'Try changing your filter settings to see more reviews.'
            : 'Customer reviews will appear here once submitted.'
        }
        emptyAction={
          reviews.length ? (
            <Button
              variant="outlined"
              onClick={() => {
                setQuery('');
                setFilterRating('all');
                setSortBy('newest');
              }}
            >
              Clear Filters
            </Button>
          ) : null
        }
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message={`Delete review by "${deleteTarget?.userName}" on "${deleteTarget?.productName}"?`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        type="delete"
        isLoading={isDeleting}
      />

      <ConfirmModal
        isOpen={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        onConfirm={() => setViewTarget(null)}
        title="Review Details"
        message={
          viewTarget
            ? `${viewTarget.userName} rated ${viewTarget.productName} ${viewTarget.rating}/5 — "${viewTarget.review || 'No comment'}"`
            : ''
        }
        confirmText="Close"
        cancelText="Dismiss"
        type="info"
      />
    </>
  );
};

export default ShowReview;
