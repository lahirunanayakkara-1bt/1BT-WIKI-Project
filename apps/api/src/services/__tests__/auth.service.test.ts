// apps/api/src/services/__tests__/auth.service.test.ts

// ─────────────────────────────────────────────────────
// PLACEHOLDER — AuthService not yet implemented
// Auth is Lahiru's responsibility (MVP 1, tasks A-01 to A-07)
// These tests define expected behaviour only
// They will be replaced by Lahiru with real AuthService tests
// ─────────────────────────────────────────────────────

describe('AuthService — placeholder', () => {

  // Inline helper — will be replaced by real AuthService method
  const isCompanyEmail = (email: string): boolean =>
    email.endsWith('@1billiontech.com');

  it('should accept valid company email domain', () => {
    // Arrange
    const validEmail = 'malindu@1billiontech.com';

    // Act + Assert
    expect(isCompanyEmail(validEmail)).toBe(true);
  });

  it('should reject non-company email domain', () => {
    // Arrange
    const externalEmail = 'someone@gmail.com';

    // Act + Assert
    expect(isCompanyEmail(externalEmail)).toBe(false);
  });

  it('should reject empty string email', () => {
    // Arrange
    const emptyEmail = '';

    // Act + Assert
    expect(isCompanyEmail(emptyEmail)).toBe(false);
  });

});