import { mockPrismaClient } from "../../test-utils/test-utils";

describe("Testimonials API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validTestimonial = {
    content: "Great service!",
    userId: "user123",
  };

  describe("Create Testimonial", () => {
    it("should create testimonial successfully", async () => {
      mockPrismaClient.testimonial.create.mockResolvedValue({
        id: "testimonial123",
        ...validTestimonial,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrismaClient.testimonial.create({
        data: validTestimonial,
      });

      expect(result).toMatchObject(validTestimonial);
      expect(mockPrismaClient.testimonial.create).toHaveBeenCalledWith({
        data: validTestimonial,
      });
    });

    it("should validate required fields", async () => {
      const invalidTestimonial = {
        content: "",
        userId: "",
      };

      mockPrismaClient.testimonial.create.mockRejectedValue(
        new Error("Content and userId are required")
      );

      await expect(
        mockPrismaClient.testimonial.create({
          data: invalidTestimonial,
        })
      ).rejects.toThrow("Content and userId are required");
    });

    it("should validate content length", async () => {
      const invalidTestimonial = {
        content: "a".repeat(1001), // More than 1000 characters
        userId: "user123",
      };

      mockPrismaClient.testimonial.create.mockRejectedValue(
        new Error("Content must be between 1 and 1000 characters")
      );

      await expect(
        mockPrismaClient.testimonial.create({
          data: invalidTestimonial,
        })
      ).rejects.toThrow("Content must be between 1 and 1000 characters");
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.testimonial.create.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.testimonial.create({
          data: validTestimonial,
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("Get Testimonials", () => {
    it("should get all testimonials", async () => {
      const testimonials = [
        {
          id: "testimonial123",
          ...validTestimonial,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.testimonial.findMany.mockResolvedValue(testimonials);

      const result = await mockPrismaClient.testimonial.findMany();

      expect(result).toEqual(testimonials);
      expect(mockPrismaClient.testimonial.findMany).toHaveBeenCalled();
    });

    it("should get testimonials by user id", async () => {
      const testimonials = [
        {
          id: "testimonial123",
          ...validTestimonial,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.testimonial.findMany.mockResolvedValue(testimonials);

      const result = await mockPrismaClient.testimonial.findMany({
        where: { userId: validTestimonial.userId },
      });

      expect(result).toEqual(testimonials);
      expect(mockPrismaClient.testimonial.findMany).toHaveBeenCalledWith({
        where: { userId: validTestimonial.userId },
      });
    });

    it("should handle empty testimonials list", async () => {
      mockPrismaClient.testimonial.findMany.mockResolvedValue([]);

      const result = await mockPrismaClient.testimonial.findMany();

      expect(result).toEqual([]);
      expect(mockPrismaClient.testimonial.findMany).toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.testimonial.findMany.mockRejectedValue(
        new Error("Database error")
      );

      await expect(mockPrismaClient.testimonial.findMany()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("Update Testimonial", () => {
    it("should update testimonial successfully", async () => {
      const updatedContent = "Updated testimonial";
      const updatedTestimonial = {
        id: "testimonial123",
        content: updatedContent,
        userId: validTestimonial.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.testimonial.update.mockResolvedValue(updatedTestimonial);

      const result = await mockPrismaClient.testimonial.update({
        where: { id: "testimonial123" },
        data: { content: updatedContent },
      });

      expect(result).toEqual(updatedTestimonial);
      expect(mockPrismaClient.testimonial.update).toHaveBeenCalledWith({
        where: { id: "testimonial123" },
        data: { content: updatedContent },
      });
    });

    it("should validate content length on update", async () => {
      const invalidContent = "a".repeat(1001);

      mockPrismaClient.testimonial.update.mockRejectedValue(
        new Error("Content must be between 1 and 1000 characters")
      );

      await expect(
        mockPrismaClient.testimonial.update({
          where: { id: "testimonial123" },
          data: { content: invalidContent },
        })
      ).rejects.toThrow("Content must be between 1 and 1000 characters");
    });

    it("should handle non-existent testimonial", async () => {
      mockPrismaClient.testimonial.update.mockRejectedValue(
        new Error("Testimonial not found")
      );

      await expect(
        mockPrismaClient.testimonial.update({
          where: { id: "non-existent" },
          data: { content: "Updated content" },
        })
      ).rejects.toThrow("Testimonial not found");
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.testimonial.update.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.testimonial.update({
          where: { id: "testimonial123" },
          data: { content: "Updated content" },
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("Delete Testimonial", () => {
    it("should delete testimonial successfully", async () => {
      const deletedTestimonial = {
        id: "testimonial123",
        ...validTestimonial,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.testimonial.delete.mockResolvedValue(deletedTestimonial);

      const result = await mockPrismaClient.testimonial.delete({
        where: { id: "testimonial123" },
      });

      expect(result).toEqual(deletedTestimonial);
      expect(mockPrismaClient.testimonial.delete).toHaveBeenCalledWith({
        where: { id: "testimonial123" },
      });
    });

    it("should handle non-existent testimonial", async () => {
      mockPrismaClient.testimonial.delete.mockRejectedValue(
        new Error("Testimonial not found")
      );

      await expect(
        mockPrismaClient.testimonial.delete({
          where: { id: "non-existent" },
        })
      ).rejects.toThrow("Testimonial not found");
    });

    it("should handle database errors gracefully", async () => {
      mockPrismaClient.testimonial.delete.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        mockPrismaClient.testimonial.delete({
          where: { id: "testimonial123" },
        })
      ).rejects.toThrow("Database error");
    });
  });
});
