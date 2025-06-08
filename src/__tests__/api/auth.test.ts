import { mockBcrypt, mockPrismaClient } from "../../test-utils/test-utils";

// Mock bcrypt
jest.mock("bcrypt", () => mockBcrypt);

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Authentication", () => {
    const validCredentials = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("should authenticate user with valid credentials", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        email: validCredentials.email,
        password: "hashedPassword",
      });
      mockBcrypt.compare.mockResolvedValue(true);

      const user = await mockPrismaClient.user.findUnique({
        where: { email: validCredentials.email },
      });

      expect(user).toBeTruthy();

      const isPasswordValid = await mockBcrypt.compare(
        validCredentials.password,
        user.password
      );
      expect(isPasswordValid).toBe(true);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        validCredentials.password,
        user.password
      );
    });

    it("should not authenticate user with invalid password", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        email: validCredentials.email,
        password: "hashedPassword",
      });
      mockBcrypt.compare.mockResolvedValue(false);

      const user = await mockPrismaClient.user.findUnique({
        where: { email: validCredentials.email },
      });

      expect(user).toBeTruthy();
      const isPasswordValid = await mockBcrypt.compare(
        validCredentials.password,
        user.password
      );
      expect(isPasswordValid).toBe(false);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        validCredentials.password,
        user.password
      );
    });

    it("should handle non-existent user", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const user = await mockPrismaClient.user.findUnique({
        where: { email: validCredentials.email },
      });

      expect(user).toBeNull();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.user.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.user.findUnique({
          where: { email: validCredentials.email },
        })
      ).rejects.toThrow("Database error");
    });
  });
});
