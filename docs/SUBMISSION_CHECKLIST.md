# Submission checklist – GoKwik assessment

Use this before sharing the repo with the recruiter.

---

## Done (in this repo)

| Step | Status | Notes |
|------|--------|--------|
| 1. Repo on GitHub | Done | You created `GokwikAssesment-playwright` (or similar) |
| 2. Git initialized | Done | `git init` |
| 3. Remote added | Done | `origin` → your GitHub repo |
| 4. Initial commit | Done | Framework + CI committed |
| 5. Push to main | Done | `main` pushed to `origin` |
| 6. CI workflow | Done | `.github/workflows/playwright-tests.yml` |
| 7. Project structure | Done | tests/, pages/, utils/, config/, docs/ |
| 8. README & docs | Done | README.md, PROJECT_STRUCTURE.md, etc. |

---

## You must do (in GitHub / locally)

| Step | Action |
|------|--------|
| **Add GitHub Secrets** | Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add: `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_OTP`, `MERCHANT_ID`, `BASE_URL` (values from your `.env`). |
| **Verify CI runs** | Repo → **Actions** → open latest “Playwright Tests” run. Confirm it passes (or fix failures). Download **playwright-report** artifact to view HTML report. |
| **Grant recruiter access** | Repo → **Settings** → **Collaborators** → **Add people** → recruiter email/username → **Read** access. |
| **Final test locally** | Run `npx playwright test` then `npx playwright show-report` and ensure all tests pass before sharing. |

---

## Recruiter message template

Copy, replace placeholders, and send with the repo link:

```
Hi <Recruiter Name>,

I’ve completed the Playwright automation assessment.

Repository: https://github.com/himanshutester/GokwikAssesment-playwright

The project includes:
• Playwright JS automation framework
• Product CRUD automation (Create, Read, Update, Delete)
• Pagination and negative validation tests
• Page Object Model architecture
• Session reuse for login (storageState)
• Parallel execution and retries
• CI/CD pipeline via GitHub Actions
• Test tags (@smoke / @regression)

I’ve granted you access to the repository. CI runs on push/PR; add the required secrets (LOGIN_EMAIL, LOGIN_PASSWORD, LOGIN_OTP, MERCHANT_ID, BASE_URL) in Settings → Secrets if you want to run the pipeline.

Please let me know if you need any additional details.

Thanks,
<Your Name>
```

---

## Final status (after you complete the “You must do” items)

- Automation framework  
- CRUD + pagination + negative tests  
- Parallel execution & session reuse  
- GitHub repository  
- CI/CD pipeline  
- Documentation  
- Recruiter access & message sent  
