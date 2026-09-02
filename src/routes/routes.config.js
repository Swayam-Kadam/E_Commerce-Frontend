import routesConstants from "./routesConstants";
import {
  _404,
  HOMEPAGE,
  CATEGORY,
  LOGIN,
  SIGNUP,
  SELECTEDPRODUCT,
  ADDTOCART,
  WISHLIST,
  ACCOUNT,
  ADMIN,
  ADDPRODUCT,
  MANAGEPRODUCT,
  REVIEW,
} from "./routeImports";

const routesConfig = {
  common: [{ path: routesConstants._404, component: _404 }],
  public: [
    {
      path: routesConstants.LOGIN,
      component: LOGIN,
    },
    {
      path: routesConstants.SIGNUP,
      component: SIGNUP,
    },
  ],
  publicBrowse: [
    {
      index: true,
      component: HOMEPAGE,
    },
    {
      path: routesConstants.PRODUCT_DETAIL,
      component: SELECTEDPRODUCT,
    },
    {
      path: routesConstants.CATEGORY,
      component: CATEGORY,
    },
    {
      path: routesConstants.CATEGORY_WITH_NAME,
      component: CATEGORY,
    },
  ],
  private: [
    {
      path: routesConstants.WISHLIST,
      component: WISHLIST,
      allowedRoles: ['user'],
    },
    {
      path: routesConstants.CART,
      component: ADDTOCART,
      allowedRoles: ['user'],
    },
    {
      path: routesConstants.PROFILE,
      component: ACCOUNT,
      allowedRoles: ['user'],
    },
  ],
  admin: [ {
      path: routesConstants.ADMIN,
      component: ADMIN,
      allowedRoles: ['admin'],
    },
        {
          path: routesConstants.ADMIN_ADD_PRODUCT,
          component: ADDPRODUCT,
          allowedRoles: ['admin'],
        },
        {
          path: routesConstants.ADMIN_REVIEW,
          component: REVIEW,
          allowedRoles: ['admin'],
        },
        {
          path: routesConstants.ADMIN_MANAGE,
          component: MANAGEPRODUCT,
          allowedRoles: ['admin'],
        },
  ],
};

export default routesConfig;
