import { lazy } from "react";
export const HOME = lazy(() => import("@/components/home/HomePage"));
export const _404 = lazy(() => import("../components/common/NotFound"));
export const LOGIN = lazy(() => import("@/components/auth/LoginPage"));
export const SIGNUP = lazy(() => import("@/components/auth/SignupPage"));
export const HOMEPAGE = lazy(() => import("@/components/home/HomePage"));
export const SELECTEDPRODUCT = lazy(() =>
  import("@/components/SelectProduct/SelectedProductPage")
);
export const ADDTOCART = lazy(() =>
  import("@/components/AddToCart/page/AddtocartPage")
);
export const CATEGORY = lazy(() =>
  import("@/components/Category/pages/index")
);
export const WISHLIST = lazy(() =>
  import("@/components/Wishlist/page/WishlistPage")
);
export const ACCOUNT = lazy(() => import("@/components/profile/index"));
export const ADMIN = lazy(() => import("@/components/Admin/AdminPage"));
export const ADDPRODUCT = lazy(() =>
  import("@/components/Admin/pages/AddProduct")
);
export const MANAGEPRODUCT = lazy(() => import("@/components/Admin/pages/ManageProduct"));
export const REVIEW = lazy(() => import("@/components/Admin/pages/ShowReview"));
