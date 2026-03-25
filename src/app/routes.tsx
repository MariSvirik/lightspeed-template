import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFound } from '@app/NotFound/NotFound';
import { TemplateIndex } from '@app/TemplateIndex/TemplateIndex';
import { TemplateDetail } from '@app/TemplateDetail/TemplateDetail';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Navigate to="/systems" replace />,
    path: '/',
    title: 'Lightspeed template | Page template',
  },
  {
    label: 'Inventory',
    routes: [
      {
        element: <TemplateIndex />,
        exact: true,
        label: 'Page template',
        path: '/systems',
        title: 'Lightspeed template | Page template',
      },
      {
        element: <TemplateDetail />,
        exact: true,
        path: '/systems/:templateId',
        title: 'Lightspeed template | Page template',
      },
    ],
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    <Route path="/templates" element={<Navigate to="/systems" replace />} />
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
