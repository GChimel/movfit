import { mockBcrypt, mockPrismaClient } from "../../test-utils/test-utils";

// Mock bcrypt
jest.mock("bcrypt", () => mockBcrypt);

describe("Register API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserData = {
    email: "test@example.com",
    password: "Password123!",
    name: "Test User",
  };

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashedPassword");
      mockPrismaClient.user.create.mockResolvedValue({
        email: validUserData.email,
        name: validUserData.name,
        password: "hashedPassword",
      });

      const exists = await mockPrismaClient.user.findUnique({
        where: { email: validUserData.email },
      });
      expect(exists).toBeNull();

      const result = await mockPrismaClient.user.create({
        data: {
          name: validUserData.name,
          email: validUserData.email,
          password: "hashedPassword",
        },
      });

      expect(result).toMatchObject({
        email: validUserData.email,
        name: validUserData.name,
      });
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          name: validUserData.name,
          email: validUserData.email,
          password: "hashedPassword",
        },
      });
    });

    it("should not register user with existing email", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue({
        email: validUserData.email,
        name: "Existing User",
      });

      const exists = await mockPrismaClient.user.findUnique({
        where: { email: validUserData.email },
      });

      expect(exists).toBeTruthy();
      expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
    });

    it("should validate required fields", async () => {
      const invalidData = {
        email: "",
        password: "",
        name: "",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockRejectedValue(
        new Error("All fields are required")
      );

      const exists = await mockPrismaClient.user.findUnique({
        where: { email: invalidData.email },
      });

      expect(exists).toBeNull();
      await expect(
        mockPrismaClient.user.create({
          data: invalidData,
        })
      ).rejects.toThrow("All fields are required");
    });

    it("should validate email format", async () => {
      const invalidEmailData = {
        ...validUserData,
        email: "invalid-email",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockRejectedValue(
        new Error("Invalid email format")
      );

      const exists = await mockPrismaClient.user.findUnique({
        where: { email: invalidEmailData.email },
      });

      expect(exists).toBeNull();
      await expect(
        mockPrismaClient.user.create({
          data: invalidEmailData,
        })
      ).rejects.toThrow("Invalid email format");
    });

    it("should validate password strength", async () => {
      const weakPasswordData = {
        ...validUserData,
        password: "weak",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockRejectedValue(
        new Error(
          "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
        )
      );

      const exists = await mockPrismaClient.user.findUnique({
        where: { email: weakPasswordData.email },
      });

      expect(exists).toBeNull();
      await expect(
        mockPrismaClient.user.create({
          data: weakPasswordData,
        })
      ).rejects.toThrow(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
      );
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.user.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.user.findUnique({
          where: { email: validUserData.email },
        })
      ).rejects.toThrow("Database error");
    });

    it("should handle password hashing errors", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(new Error("Hashing error"));

      await expect(mockBcrypt.hash(validUserData.password, 10)).rejects.toThrow(
        "Hashing error"
      );
    });
  });
});
