import { render as rtlRender } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import React from "react";

function render(
  ui: React.ReactElement,
  { session = null, ...renderOptions } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock do bcrypt
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

// Mock do prisma
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  testimonial: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock do axios
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Mock dos toasts
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
};

export * from "@testing-library/react";
export { mockAxios, mockBcrypt, mockPrismaClient, mockToast, render };
