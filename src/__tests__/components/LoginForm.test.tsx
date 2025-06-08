describe("LoginForm", () => {
  it("should render login form", () => {
    // Import and render your LoginForm component here
    // render(<LoginForm />);
    // expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it("should show validation errors for invalid input", async () => {
    // render(<LoginForm />);
    // const emailInput = screen.getByLabelText(/email/i);
    // const passwordInput = screen.getByLabelText(/password/i);
    // const submitButton = screen.getByRole('button', { name: /sign in/i });
    // await userEvent.type(emailInput, 'invalid-email');
    // await userEvent.type(passwordInput, '123');
    // await userEvent.click(submitButton);
    // await waitFor(() => {
    //   expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    //   expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    // });
  });

  it("should handle successful login", async () => {
    // render(<LoginForm />);
    // const emailInput = screen.getByLabelText(/email/i);
    // const passwordInput = screen.getByLabelText(/password/i);
    // const submitButton = screen.getByRole('button', { name: /sign in/i });
    // await userEvent.type(emailInput, 'test@example.com');
    // await userEvent.type(passwordInput, 'password123');
    // await userEvent.click(submitButton);
    // await waitFor(() => {
    //   expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/login', {
    //     email: 'test@example.com',
    //     password: 'password123',
    //   });
    // });
  });
});
