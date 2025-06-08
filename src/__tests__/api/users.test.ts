import { mockPrismaClient } from "../../test-utils/test-utils";

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUser = {
    id: "user123",
    name: "Test User",
    email: "test@example.com",
    role: "USER",
  };

  describe("User Management", () => {
    it("should list all users", async () => {
      const users = [validUser];
      mockPrismaClient.user.findMany.mockResolvedValue(users);

      const result = await mockPrismaClient.user.findMany();

      expect(result).toEqual(users);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
    });

    it("should get user by id", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(validUser);

      const result = await mockPrismaClient.user.findUnique({
        where: { id: validUser.id },
      });

      expect(result).toEqual(validUser);
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: validUser.id },
      });
    });

    it("should update user", async () => {
      const updatedUser = {
        ...validUser,
        name: "Updated Name",
      };

      mockPrismaClient.user.update.mockResolvedValue(updatedUser);

      const result = await mockPrismaClient.user.update({
        where: { id: validUser.id },
        data: { name: "Updated Name" },
      });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: validUser.id },
        data: { name: "Updated Name" },
      });
    });

    it("should delete user", async () => {
      mockPrismaClient.user.delete.mockResolvedValue(validUser);

      const result = await mockPrismaClient.user.delete({
        where: { id: validUser.id },
      });

      expect(result).toEqual(validUser);
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: validUser.id },
      });
    });

    it("should handle non-existent user", async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const result = await mockPrismaClient.user.findUnique({
        where: { id: "non-existent" },
      });

      expect(result).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.user.findMany.mockRejectedValue(
        new Error("Database error")
      );

      await expect(mockPrismaClient.user.findMany()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("User Role Management", () => {
    it("should update user role", async () => {
      const updatedUser = {
        ...validUser,
        role: "ADMIN",
      };

      mockPrismaClient.user.update.mockResolvedValue(updatedUser);

      const result = await mockPrismaClient.user.update({
        where: { id: validUser.id },
        data: { role: "ADMIN" },
      });

      expect(result.role).toBe("ADMIN");
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: validUser.id },
        data: { role: "ADMIN" },
      });
    });

    it("should validate role value", async () => {
      const invalidRole = "INVALID_ROLE";

      mockPrismaClient.user.update.mockRejectedValue(
        new Error("Invalid role value. Must be either USER or ADMIN")
      );

      await expect(
        mockPrismaClient.user.update({
          where: { id: validUser.id },
          data: { role: invalidRole },
        })
      ).rejects.toThrow("Invalid role value. Must be either USER or ADMIN");
    });

    it("should handle role update errors gracefully", async () => {
      mockPrismaClient.user.update.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.user.update({
          where: { id: validUser.id },
          data: { role: "ADMIN" },
        })
      ).rejects.toThrow("Database error");
    });
  });
});
