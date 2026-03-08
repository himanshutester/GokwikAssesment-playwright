/**
 * Page Object: Login flow (email, password, OTP).
 * Locators from Codegen. Credentials from env (not hardcoded).
 */

class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: 'example@email.com' });
    this.passwordInput = page.locator('input[type="password"]');
    this.otpInput = page.getByRole('textbox', { name: '******' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async navigate(baseURL) {
    await this.page.goto(baseURL);
  }

  /**
   * Single reusable login (email → Next, password → Next, OTP → Enter).
   */
  async login(email, password, otp) {
    await this.emailInput.fill(email);
    await this.nextButton.click();

    await this.passwordInput.fill(password);
    await this.nextButton.click();

    await this.otpInput.fill(otp);
    await this.otpInput.press('Enter');
  }
}

module.exports = LoginPage;
