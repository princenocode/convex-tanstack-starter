import { httpRouter } from 'convex/server';
import { authComponent, createAuth } from './auth';

// Better Auth serves its endpoints from Convex HTTP routes; the web app proxies
// /api/auth/* to here.
const http = httpRouter();
authComponent.registerRoutes(http, createAuth);

export default http;
