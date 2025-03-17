/**
 * Express Request/Response Mocks
 * Provides mock implementations of Express Request and Response objects for testing
 */

import { Request, Response } from 'express';

/**
 * Creates a mock Express Request object
 */
export const mockRequest = (): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    method: 'GET',
    path: '/',
    get: jest.fn().mockImplementation((headerName) => {
      if (headerName === 'authorization') return 'Bearer test-token';
      return null;
    })
  };
};

/**
 * Creates a mock Express Response object
 */
export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.format = jest.fn().mockReturnValue(res);
  res.type = jest.fn().mockReturnValue(res);
  
  res.locals = {};
  
  return res;
};