# Developer Portfolio

# Developer Portfolio

## Run locally
1. Open the site directly in a browser, or serve it locally to avoid asset-loading issues:
   ```bash
   npx serve .
   ```
2. Or run a simple local server:
   ```bash
   python -m http.server 8000
   ```

## Deploy to GitHub Pages
1. Push the project to a GitHub repository.
2. In the repository, open Settings > Pages.
3. Set the source to GitHub Actions, or deploy the root folder as the Pages publish directory if you use a static host.
4. If publishing from the repo root, keep the site as a static site with no build step.

## Deploy to Netlify
1. Import the repository into Netlify.
2. Set the publish directory to the project root.
3. Leave the build command blank because this project is plain HTML/CSS/JS.
4. Deploy the site and confirm the root URL resolves without an extra app folder.

## Accent colour
Change the accent colour in one place inside [css/tokens.css](css/tokens.css):

```css
:root {
  --accent: #B6F23C;
  --on-accent: #0B0D10;
}
```

The light theme override is also kept in the same file, so the site remains theme-aware without editing individual pages.

## Finished placeholder list
- `assets/img/harish.jpg`
- `assets/Harish_B_Resume.pdf`
- `assets/img/certs/internship.jpeg`
- `assets/img/projects/plagiarism-engine.png`
- `assets/img/projects/ridego.png`
- `assets/img/projects/travel-app.png`
- `YOUR_LINKEDIN_HANDLE`
- `YOUR_LEETCODE_USERNAME`
- `FORM_ENDPOINT`
- `YOUR_TRAVEL_APP_DESCRIPTION_HERE`
- `YOUR_TRAVEL_HIGHLIGHT_1_HERE`
- `YOUR_TRAVEL_HIGHLIGHT_2_HERE`
- `YOUR_TRAVEL_HIGHLIGHT_3_HERE`
- `YOUR_DESIGN_TOOLS_HERE`
- All certificate files listed below if the actual PDFs/JPGs are not yet renamed to the expected names.

## LinkedIn and contact form setup
- Replace the placeholder URL in the source with your real profile, e.g. `https://www.linkedin.com/in/YOUR_LINKEDIN_HANDLE/`.
- Set the contact form endpoint in `js/main.js` by replacing the empty `FORM_ENDPOINT` value with your Formspree or Web3Forms URL.

## Certificates to rename
Verify the file names against the actual certificate files and rename them to match the expected paths below:

| Original File | New File |
|---|---|
| (Your NPTEL file) | `assets/img/certs/nptel.pdf` |
| (Your Deloitte Data file) | `assets/img/certs/deloitte-data-analytics.pdf` |
| (Your Deloitte cert file) | `assets/img/certs/deloitte.pdf` |
| (Your Tata Forage file) | `assets/img/certs/tata-forage.pdf` |
| (Your HCL GUVI file) | `assets/img/certs/hcl-guvi.pdf` |
| (Your Infosys file) | `assets/img/certs/infosys-springboard.pdf` |
| (Your Naan Mudhalvan EBPL file) | `assets/img/certs/naan-mudhalvan-ebpl.pdf` |
| (Your Naan Mudhalvan UI/UX file) | `assets/img/certs/naan-mudhalvan-ui-ux.pdf` |
| (Your Microsoft 1 file) | `assets/img/certs/microsoft-1.jpeg` |
| (Your Microsoft 2 file) | `assets/img/certs/microsoft-2.jpeg` |
| (Your Symposium file) | `assets/img/certs/symposium.pdf` |
| (Your Project cert file) | `assets/img/certs/project.pdf` |

## LeetCode configuration
Search the project for `https://leetcode.com/u/Q5L8akYLU5/` and `YOUR_LEETCODE_USERNAME` and replace them with the real profile data.

To populate the stat tiles on the home page LeetCode card, update the `.lc-card` element in [index.html](index.html) with values such as:

```html
<div class="lc-card" data-solved="150" data-rating="1700" data-streak="20">
```

The cards will render automatically when the attributes are present.

## 404 page
A branded 404 page is included at [404.html](404.html). It reuses the same shared navigation and footer patterns so the site keeps a consistent look and feel.
