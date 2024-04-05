import { NextRequest, NextResponse } from 'next/server';

// Define arrays for authenticated and protected routes
const authRoutes = ['/admin-login', '/employee-login'];
const adminProtectedRoutes = ['/admin'];
const employeeProtectedRoutes = ['/employee'];

// Define the middleware function
export function middleware(request: NextRequest) {
    // Check if the 'authToken' cookie exists
    const authTokenAdmin = request.cookies.get('admin');
    const authTokenEmployee = request.cookies.get('employee');

    // Check if the user is authenticated as an admin or employee
    const isAdmin = authTokenAdmin !== undefined;
    const isEmployee = authTokenEmployee !== undefined;

    // Check if the user is trying to access a login page while already logged in
    if (authRoutes.includes(request.nextUrl.pathname)) {
        if (isAdmin) {
            // If admin is already logged in and visits admin login page, redirect to admin profile
            const redirectUrl = request.nextUrl.protocol + '//' + request.nextUrl.hostname + (request.nextUrl.port ? `:${request.nextUrl.port}` : '') + '/admin';
            return NextResponse.redirect(redirectUrl);
        } else if (isEmployee) {
            // If employee is already logged in and visits employee login page, redirect to employee profile
            const redirectUrl = request.nextUrl.protocol + '//' + request.nextUrl.hostname + (request.nextUrl.port ? `:${request.nextUrl.port}` : '') + '/employee';
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Check the request path against the arrays to decide the action
    if (authRoutes.includes(request.nextUrl.pathname)) {
        // If the request is for an authentication route, allow access regardless of role
        return NextResponse.next();
    } else if (adminProtectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        // If the request is for an admin protected route
        if (isAdmin) {
            // If the user is logged in as an admin, allow access
            return NextResponse.next();
        } else {
            // If the user is not logged in as an admin, redirect to the admin login page
            const redirectUrl = request.nextUrl.protocol + '//' + request.nextUrl.hostname + (request.nextUrl.port ? `:${request.nextUrl.port}` : '') + '/admin-login';
            return NextResponse.redirect(redirectUrl);
        }
    } else if (employeeProtectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        // If the request is for an employee protected route
        if (isEmployee) {
            // If the user is logged in as an employee, allow access
            return NextResponse.next();
        } else {
            // If the user is not logged in as an employee, redirect to the employee login page
            const redirectUrl = request.nextUrl.protocol + '//' + request.nextUrl.hostname + (request.nextUrl.port ? `:${request.nextUrl.port}` : '') + '/employee-login';
            return NextResponse.redirect(redirectUrl);
        }
    }

    // Default action if the request does not match any of the defined routes
    return NextResponse.next();
}
