import { Suspense } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import routesConfig from "./routes.config";
import _404 from "../components/common/NotFound";
import routesConstants from "./routesConstants";
import PageLoader from "../components/common/PageLoader";
import {
  Route,
  Routes as ReactRouterDomRoutes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import { cookieKeys } from "@/services/cookies";
import Cookies from "js-cookie";
import AdminLayout from "./AdminLayout";
import { validateToken, getUserProfile } from "@/components/auth/slice/loginSlice"; // Import these actions

const Common = (route) => (
  <Suspense fallback={<PageLoader loadingState />}>
    <route.component />
  </Suspense>
);

Common.prototype = {
  component: PropTypes.elementType.isRequired,
};

const PublicRoute = (route) => {
  const location = useLocation();
  
  if ([routesConstants.LOGIN, routesConstants.SIGNUP].includes(location.pathname)) {
    return (
      <Suspense fallback={<PageLoader loadingState />}>
        <route.component />
      </Suspense>
    );
  }
  
  return (
    <Layout>
      <Suspense fallback={<PageLoader loadingState />}>
        <route.component />
      </Suspense>
    </Layout>
  );
};

PublicRoute.prototype = {
  ...Common.prototype,
};

const PrivateRoute = (route) => {
  const { component: Component } = route;
  
  return (
    <Layout>
      <Suspense fallback={<PageLoader loadingState />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

PrivateRoute.prototype = {
  ...Common.prototype,
};

const AdminRoute = (route) => {
  const { component: Component } = route;
  
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader loadingState />}>
        <Component />
      </Suspense>
    </AdminLayout>
  );
};

const createNestedRoutes = (routes, RouteType) => {
  if (!routes || !Array.isArray(routes)) {
    console.warn('Routes is not defined or not an array:', routes);
    return [];
  }
  
  return routes.map((route, i) => {
    if (!route.component) {
      throw new Error("Component must be required....");
    }
    if (route.children) {
      return (
        <Route path={route.path} key={i} element={<RouteType {...route} />}>
          {createNestedRoutes(route.children, RouteType)}
        </Route>
      );
    } else {
      return (
        <Route
          key={i}
          index={route.index}
          path={route.path}
          element={<RouteType {...route} />}
        />
      );
    }
  });
};

const Routes = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth || {});
  const { userDetail, isAuth, userProfileLoading } = useSelector((state) => state.login || {});
  const location = useLocation();
  
  // Check cookies as source of truth
  const tokenFromCookies = Cookies.get(cookieKeys?.TOKEN);
  const userFromCookies = Cookies.get(cookieKeys?.USER);
  
  // Parse user from cookies if exists
  const parsedUserFromCookies = userFromCookies ? JSON.parse(userFromCookies) : null;
  
  // Use cookies as primary source, Redux as secondary
  const isAuthenticated = !!tokenFromCookies;
  
  // Sync Redux state with cookies on mount and when location changes
  useEffect(() => {
    if (tokenFromCookies && !isAuth) {
      // If cookie exists but Redux says not authenticated, sync it
      dispatch(validateToken());
      
      // Also fetch user profile if userDetail is not set
      if (!userDetail && parsedUserFromCookies) {
        dispatch(getUserProfile());
      }
    }
  }, [dispatch, tokenFromCookies, isAuth, userDetail, parsedUserFromCookies, location.pathname]);

  // Show loader while auth state is being determined
  if (userProfileLoading) {
    return <PageLoader loadingState />;
  }

  // Destructure routes
  const { 
    common = [], 
    private: privateRoutes = [], 
    public: publicRoutes = [],
    admin: adminRoutes = []
  } = routesConfig || {};
  
  // Determine user role - prioritize Redux, fall back to cookies
  const userRole = userDetail?.role || parsedUserFromCookies?.role;
  const isAdmin = isAuthenticated && userRole === 'admin';

  return (
    <ReactRouterDomRoutes>
      <Route path="*" element={<_404 />} />

      {/* If NOT authenticated, show public routes */}
      {!isAuthenticated ? (
        <>
          <Route 
            path="/" 
            element={<Navigate to={routesConstants.LOGIN} replace />} 
          />
          
          {createNestedRoutes(publicRoutes, PublicRoute)}
          
          <Route 
            path="/admin/*" 
            element={<Navigate to={routesConstants.LOGIN} replace />} 
          />
          
          <Route 
            path="*" 
            element={<Navigate to={routesConstants.LOGIN} replace />} 
          />
        </>
      ) : (
        // If authenticated
        <>
          {/* ADMIN ROUTES */}
          {isAdmin ? (
            <>
              <Route 
                path="/" 
                element={<Navigate to="/admin/dashboard" replace />} 
              />
              <Route 
                path={routesConstants.LOGIN} 
                element={<Navigate to="/admin/dashboard" replace />} 
              />
              <Route 
                path={routesConstants.SIGNUP} 
                element={<Navigate to="/admin/dashboard" replace />} 
              />
              
              {createNestedRoutes(adminRoutes, AdminRoute)}
              
              {/* Admin can also access regular private routes if needed */}
              {/* {createNestedRoutes(privateRoutes, PrivateRoute)} */}
              
              <Route 
                path="/admin/*" 
                element={<Navigate to="/admin/dashboard" replace />} 
              />
            </>
          ) : (
            // REGULAR USER ROUTES
            <>
              <Route 
                path="/" 
                element={<Navigate to={routesConstants.HOMEPAGE} replace />} 
              />
              <Route 
                path={routesConstants.LOGIN} 
                element={<Navigate to={routesConstants.HOMEPAGE} replace />} 
              />
              <Route 
                path={routesConstants.SIGNUP} 
                element={<Navigate to={routesConstants.HOMEPAGE} replace />} 
              />
              
              <Route 
                path="/admin/*" 
                element={<Navigate to={routesConstants.HOMEPAGE} replace />} 
              />
              
              {createNestedRoutes(privateRoutes, PrivateRoute)}
            </>
          )}
        </>
      )}
      
      {/* COMMON ROUTES (always accessible) */}
      {createNestedRoutes(common, Common)}
    </ReactRouterDomRoutes>
  );
};

export default Routes;