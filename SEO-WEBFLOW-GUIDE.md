# Webflow SEO implementation

The standalone HTML and generated Code Embed packages already contain the page-specific structured data. Complete these Webflow settings when the embeds are installed:

1. Set the Webflow global canonical URL to `https://www.aus.swiss` (no trailing slash). Do not add another canonical tag through custom code.
2. Use [webflow/seo-settings-latest.csv](webflow/seo-settings-latest.csv) to populate each page's SEO title, meta description, Open Graph title, Open Graph description and Open Graph image in Page settings.
3. Enable Webflow's auto-generated sitemap and keep the 404 utility page excluded from indexing.
4. In Site settings, use the contents of [robots.txt](robots.txt) as the custom robots policy if Webflow is not already serving an equivalent policy.
5. Publish [llms.txt](llms.txt) at the production root if the hosting layer supports static root files or rewrites.
6. After publishing, submit `https://www.aus.swiss/sitemap.xml` in Google Search Console and Bing Webmaster Tools, then test representative program, FAQ and breadcrumb pages in Google's Rich Results Test.

Do not add meta-keywords tags. Google does not use them for ranking.
