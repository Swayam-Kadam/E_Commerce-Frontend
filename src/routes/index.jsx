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
import { validateToken, getUserProfile } from "@/components/auth/slice/loginSlice";
import { buildLoginPath } from "@/utils/auth";

const Common = (route) => (
  <Suspense fallback={<PageLoader loadingState />}>
    <route.component />
  </Suspense>
);

Common.prototype = {
  component: PropTypes.elementType.isRequired,
};

const AuthPage = (route) => (
  <Suspense fallback={<PageLoader loadingState />}>
    <route.component />
  </Suspense>
);

const BrowseRoute = (route) => {
  const { component: Component } = route;

  return (
    <Layout>
      <Suspense fallback={<PageLoader loadingState />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

BrowseRoute.prototype = {
  ...Common.prototype,
};

const AuthRequiredRoute = (route) => {
  const location = useLocation();
  const { component: Component } = route;
  const tokenFromCookies = Cookies.get(cookieKeys?.TOKEN);
  const isAuthed = !!tokenFromCookies;

  if (!isAuthed) {
    const redirectTarget = `${location.pathname}${location.search || ""}`;
    return (
      <Navigate to={buildLoginPath(redirectTarget)} replace />
    );
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader loadingState />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

AuthRequiredRoute.prototype = {
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
  const { userDetail, isAuth, userProfileLoading } = useSelector((state) => state.login || {});
  const location = useLocation();

  const tokenFromCookies = Cookies.get(cookieKeys?.TOKEN);
  const userFromCookies = Cookies.get(cookieKeys?.USER);

  const parsedUserFromCookies = userFromCookies ? JSON.parse(userFromCookies) : null;
  const isAuthenticated = !!tokenFromCookies;

  useEffect(() => {
    if (tokenFromCookies && !isAuth) {
      dispatch(validateToken());

      if (!userDetail && parsedUserFromCookies) {
        dispatch(getUserProfile());
      }
    }
  }, [dispatch, tokenFromCookies, isAuth, userDetail, parsedUserFromCookies, location.pathname]);

  if (isAuthenticated && userProfileLoading) {
    return <PageLoader loadingState />;
  }

  const {
    common = [],
    private: privateRoutes = [],
    public: publicRoutes = [],
    publicBrowse = [],
    admin: adminRoutes = [],
  } = routesConfig || {};

  const userRole = userDetail?.role || parsedUserFromCookies?.role;
  const isAdmin = isAuthenticated && userRole === "admin";

  const authenticatedUserRedirect = (
    <Navigate
      to={isAdmin ? routesConstants.ADMIN : routesConstants.HOMEPAGE}
      replace
    />
  );

  return (
    <ReactRouterDomRoutes>
      {isAdmin ? (
        <>
          <Route path="/" element={<Navigate to={routesConstants.ADMIN} replace />} />
          <Route path={routesConstants.LOGIN} element={authenticatedUserRedirect} />
          <Route path={routesConstants.SIGNUP} element={authenticatedUserRedirect} />
          {createNestedRoutes(adminRoutes, AdminRoute)}
          <Route path="/admin/*" element={<Navigate to={routesConstants.ADMIN} replace />} />
          <Route path="*" element={<Navigate to={routesConstants.ADMIN} replace />} />
        </>
      ) : (
        <>
          {publicRoutes.map((route, i) => (
            <Route
              key={`public-${i}`}
              path={route.path}
              element={
                isAuthenticated ? (
                  authenticatedUserRedirect
                ) : (
                  <AuthPage {...route} />
                )
              }
            />
          ))}

          {createNestedRoutes(publicBrowse, BrowseRoute)}
          {createNestedRoutes(privateRoutes, AuthRequiredRoute)}

          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                <Navigate to={routesConstants.HOMEPAGE} replace />
              ) : (
                <Navigate to={buildLoginPath(location.pathname)} replace />
              )
            }
          />
        </>
      )}

      {createNestedRoutes(common, Common)}
      <Route path="*" element={<_404 />} />
    </ReactRouterDomRoutes>
  );
};

export default Routes;
