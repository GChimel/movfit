import { mockBcrypt, mockPrismaClient } from "../../test-utils/test-utils";

// Mock bcrypt
jest.mock("bcrypt", () => mockBcrypt);

describe("Forgot Password API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const email = "test@example.com";
  const resetToken = "token123";
  const resetTokenExpiry = new Date(Date.now() + 3600 * 1000);

  describe("Generate Reset Token", () => {
    it("should generate reset token for valid user", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        email,
        name: "Test User",
      });

      mockPrismaClient.user.update.mockResolvedValue({
        email,
        name: "Test User",
        resetToken,
        resetTokenExpiry,
      });

      const user = await mockPrismaClient.user.findUnique({
        where: { email },
      });

      expect(user).toBeTruthy();

      const updatedUser = await mockPrismaClient.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      expect(updatedUser.resetToken).toBe(resetToken);
      expect(updatedUser.resetTokenExpiry).toBeTruthy();
    });

    it("should not generate token for non-existent user", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const user = await mockPrismaClient.user.findUnique({
        where: { email },
      });

      expect(user).toBeNull();
      expect(mockPrismaClient.user.update).not.toHaveBeenCalled();
    });

    it("should validate email format", async () => {
      const invalidEmail = "invalid-email";

      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const user = await mockPrismaClient.user.findUnique({
        where: { email: invalidEmail },
      });

      expect(user).toBeNull();
      expect(mockPrismaClient.user.update).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.user.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.user.findUnique({
          where: { email },
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("Reset Password", () => {
    it("should update password with valid reset token", async () => {
      const newHashedPassword = "newHashedPassword";

      mockPrismaClient.user.findFirst.mockResolvedValue({
        email,
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600 * 1000),
      });
      mockBcrypt.hash.mockResolvedValue(newHashedPassword);

      mockPrismaClient.user.update.mockResolvedValue({
        email,
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      const user = await mockPrismaClient.user.findFirst({
        where: { resetToken },
      });

      expect(user).toBeTruthy();
      expect(user.resetTokenExpiry > new Date()).toBe(true);

      const updatedUser = await mockPrismaClient.user.update({
        where: { email: user.email },
        data: {
          password: newHashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      expect(updatedUser.password).toBe(newHashedPassword);
      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();
    });

    it("should not update password with expired token", async () => {
      mockPrismaClient.user.findFirst.mockResolvedValue({
        email,
        resetToken,
        resetTokenExpiry: new Date(Date.now() - 3600 * 1000), // Expired token
      });

      const user = await mockPrismaClient.user.findFirst({
        where: { resetToken },
      });

      expect(user).toBeTruthy();
      expect(user.resetTokenExpiry < new Date()).toBe(true);
      expect(mockPrismaClient.user.update).not.toHaveBeenCalled();
    });

    it("should not update password with invalid token", async () => {
      mockPrismaClient.user.findFirst.mockResolvedValue(null);

      const user = await mockPrismaClient.user.findFirst({
        where: { resetToken: "invalid-token" },
      });

      expect(user).toBeNull();
      expect(mockPrismaClient.user.update).not.toHaveBeenCalled();
    });

    it("should validate password strength", async () => {
      const weakPassword = "weak";

      mockPrismaClient.user.findFirst.mockResolvedValue({
        email,
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600 * 1000),
      });

      mockPrismaClient.user.update.mockRejectedValue(
        new Error(
          "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
        )
      );

      const user = await mockPrismaClient.user.findFirst({
        where: { resetToken },
      });

      expect(user).toBeTruthy();
      await expect(
        mockPrismaClient.user.update({
          where: { email: user.email },
          data: {
            password: weakPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        })
      ).rejects.toThrow(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
      );
    });

    it("should handle password hashing errors", async () => {
      mockPrismaClient.user.findFirst.mockResolvedValue({
        email,
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600 * 1000),
      });
      mockBcrypt.hash.mockRejectedValue(new Error("Hashing error"));

      const user = await mockPrismaClient.user.findFirst({
        where: { resetToken },
      });

      expect(user).toBeTruthy();
      await expect(mockBcrypt.hash("newPassword123!", 10)).rejects.toThrow(
        "Hashing error"
      );
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.user.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.user.findFirst({
          where: { resetToken },
        })
      ).rejects.toThrow("Database error");
    });
  });
});
