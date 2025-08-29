# Role-Based Access Control Implementation

This document describes the role-based access control (RBAC) system implemented in the streaming-web-admin application.

## Overview

The RBAC system controls what users can see and do based on their profile/role. There are four main user roles:

1. **Admin/Superadmin** - Full access to all features
2. **Sineasta** - Can only see and manage their own uploaded videos
3. **Funcionario** - Can view videos but cannot delete them, no access to dashboard or subscriptions
4. **Regular Users** - No access to admin panel

## User Roles and Permissions

### Admin/Superadmin
- **Access**: Everything
- **Dashboard**: ✅ Full access
- **Videos**: ✅ List, upload, delete all videos
- **Subscriptions**: ✅ Full access
- **Users**: ✅ Full user management
- **Navigation**: All menu items visible

### Sineasta
- **Access**: Limited to their own content
- **Dashboard**: ❌ No access
- **Videos**: ✅ Can upload new videos
- **My Videos**: ✅ Can view and delete only their uploaded videos
- **Subscriptions**: ❌ No access
- **Users**: ❌ No access
- **Navigation**: Only Videos section and My Videos visible

### Funcionario
- **Access**: Read-only access to videos
- **Dashboard**: ❌ No access
- **Videos**: ✅ Can view all videos (read-only)
- **Upload**: ❌ Cannot upload videos
- **Subscriptions**: ❌ No access
- **Users**: ❌ No access
- **Navigation**: Only Videos section visible

## Implementation Details

### 1. Authentication Context (`AuthContext.js`)
- Manages user authentication state
- Provides role checking functions
- Handles login/logout operations
- Stores user profile information

### 2. Role-Based Navigation (`RoleBasedNav.js`)
- Dynamically generates navigation menu based on user role
- Filters menu items based on permissions
- Uses `canAccess()` function to determine visibility

### 3. Protected Routes (`ProtectedRoute.js`)
- Wraps components to check user permissions
- Redirects users to appropriate pages based on their role
- Shows loading state while checking authentication

### 4. Route Protection (`routes.js` and `AppContent.js`)
- Routes are marked with `requiredResource` property
- `AppContent.js` automatically wraps protected routes
- Unauthorized access redirects to appropriate landing page

## Key Functions

### `canAccess(resource)`
Checks if the current user can access a specific resource:
- `dashboard` - Admin/Superadmin only
- `subscriptions` - Admin/Superadmin only
- `users` - Admin/Superadmin only
- `videos` - Admin/Superadmin + Funcionario
- `upload` - Admin/Superadmin + Sineasta
- `my-videos` - Sineasta only

### `hasRole(role)`
Checks if the current user has a specific role.

## User Experience Flow

### Login Process
1. User enters credentials
2. System validates user and retrieves profile
3. User is redirected based on their role:
   - **Admin/Superadmin** → Dashboard
   - **Sineasta** → My Videos
   - **Funcionario** → Videos List

### Navigation
- Menu items are dynamically shown/hidden based on user role
- Users cannot access unauthorized sections
- Unauthorized access attempts redirect to appropriate landing page

### Content Management
- **Sineasta**: Can only see and manage their own videos
- **Funcionario**: Can view all videos but cannot modify
- **Admin/Superadmin**: Full access to all content

## Security Features

1. **Route Protection**: All sensitive routes are wrapped with `ProtectedRoute`
2. **Role Validation**: Server-side validation of user permissions
3. **Session Management**: Secure token-based authentication
4. **Automatic Redirects**: Users are automatically redirected to appropriate pages

## File Structure

```
src/
├── contexts/
│   └── AuthContext.js          # Authentication and role management
├── components/
│   ├── RoleBasedNav.js         # Dynamic navigation based on roles
│   ├── ProtectedRoute.js       # Route protection component
│   ├── AppHeader.js            # Updated header with user info
│   └── header/
│       └── AppHeaderDropdown.js # User dropdown with logout
├── views/
│   ├── Video/
│   │   └── MyVideos.js         # Sineasta-only video management
│   └── pages/
│       └── login/
│           └── Login.js         # Updated login with role handling
├── routes.js                    # Routes with permission requirements
├── App.js                      # Main app with AuthProvider
└── AppContent.js               # Route rendering with protection
```

## Testing the Implementation

1. **Login as Admin/Superadmin**: Should see all menu items and have full access
2. **Login as Sineasta**: Should only see Videos section and My Videos, redirected to My Videos after login
3. **Login as Funcionario**: Should only see Videos section, redirected to Videos list after login
4. **Unauthorized Access**: Should be redirected to appropriate landing page

## Future Enhancements

1. **Audit Logging**: Track user actions for security monitoring
2. **Permission Granularity**: More fine-grained permissions (e.g., read-only vs. edit)
3. **Role Hierarchy**: Support for role inheritance and delegation
4. **Multi-factor Authentication**: Enhanced security for admin accounts
