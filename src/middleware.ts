import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const { url } = context;
    const pathname = url.pathname;

    // Protected routes
    const protectedRoutes = ['/horario-personal', '/personalizados'];

    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        // Check authentication on client side
        // Since we can't access localStorage in SSR, we'll handle this client-side
        // The middleware will just pass through, and client-side script will handle redirect

        // For now, we'll add a marker to the response that client can check
        const response = await next();

        return response;
    }

    return next();
});
