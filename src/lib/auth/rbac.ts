import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  StaffSessionPayload,
  ResidentSessionPayload,
  SESSION_COOKIES,
} from './session';

export interface StaffAuthResult {
  authenticated: boolean;
  staff?: StaffSessionPayload;
  error?: string;
  statusCode?: number;
}

export interface ResidentAuthResult {
  authenticated: boolean;
  resident?: ResidentSessionPayload;
  error?: string;
  statusCode?: number;
}

/**
 * Extracts and verifies a staff session from a NextRequest.
 * Optionally validates role and branch authorization.
 */
export function verifyStaffAuth(
  request: NextRequest,
  options?: {
    allowedRoles?: Array<'owner' | 'branch_manager' | 'accountant' | 'warden'>;
    requiredBranchCode?: number;
  }
): StaffAuthResult {
  // Check cookie or Authorization Bearer header
  let token = request.cookies.get(SESSION_COOKIES.STAFF)?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return {
      authenticated: false,
      error: 'Authentication required. No active staff session found.',
      statusCode: 401,
    };
  }

  const staff = verifySessionToken<StaffSessionPayload>(token);
  if (!staff || staff.type !== 'staff') {
    return {
      authenticated: false,
      error: 'Invalid or expired staff session. Please log in again.',
      statusCode: 401,
    };
  }

  // Check role authorization
  if (options?.allowedRoles && !options.allowedRoles.includes(staff.role)) {
    return {
      authenticated: false,
      error: `Access denied. Role '${staff.role}' is not authorized for this action.`,
      statusCode: 403,
    };
  }

  // Check branch authorization: Owner has all branches; other roles must match assigned branch
  if (options?.requiredBranchCode && staff.role !== 'owner') {
    if (!staff.assignedBranchCodes.includes(options.requiredBranchCode)) {
      return {
        authenticated: false,
        error: `Access denied. You are only authorized to manage Branch ${staff.assignedBranchCodes.join(', ')}.`,
        statusCode: 403,
      };
    }
  }

  return { authenticated: true, staff };
}

/**
 * Extracts and verifies a resident session from a NextRequest.
 * Optionally checks that the resident is accessing their own data.
 */
export function verifyResidentAuth(
  request: NextRequest,
  expectedResidentId?: string
): ResidentAuthResult {
  let token = request.cookies.get(SESSION_COOKIES.RESIDENT)?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return {
      authenticated: false,
      error: 'Authentication required. Please log in to your resident account.',
      statusCode: 401,
    };
  }

  const resident = verifySessionToken<ResidentSessionPayload>(token);
  if (!resident || resident.type !== 'resident') {
    return {
      authenticated: false,
      error: 'Invalid or expired resident session. Please log in again.',
      statusCode: 401,
    };
  }

  if (expectedResidentId) {
    const matchesId = resident.id === expectedResidentId || resident.residentId === expectedResidentId;
    if (!matchesId) {
      return {
        authenticated: false,
        error: 'Access denied. You can only view your own resident account.',
        statusCode: 403,
      };
    }
  }

  return { authenticated: true, resident };
}
