const key =
  process.env.INDEXNOW_KEY ??
  "a7982a1642fc4dbe8f592ed4319e5578";

const siteUrl =
  "https://www.portpetals.com";

const host =
  "www.portpetals.com";

const sitemapUrl =
  `${siteUrl}/sitemap.xml`;

console.log(
  `Fetching sitemap: ${sitemapUrl}`
);

const sitemapResponse =
  await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  console.error(
    `Failed to fetch sitemap: ${sitemapResponse.status}`
  );

  process.exit(1);
}

const sitemap =
  await sitemapResponse.text();

const urls = [
  ...sitemap.matchAll(
    /<loc>(.*?)<\/loc>/g
  ),
].map(
  (match) => match[1]
);

if (urls.length === 0) {
  console.error(
    "No URLs found in sitemap."
  );

  process.exit(1);
}

console.log(
  `Found ${urls.length} URLs.`
);

const payload = {
  host,
  key,
  keyLocation:
    `${siteUrl}/${key}.txt`,
  urlList: urls,
};

const response =
  await fetch(
    "https://api.indexnow.org/IndexNow",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
      },

      body:
        JSON.stringify(payload),
    }
  );

console.log(
  `IndexNow response: ${response.status} ${response.statusText}`
);

if (!response.ok) {
  const body =
    await response.text();

  if (body) {
    console.error(body);
  }

  process.exit(1);
}

console.log(
  `Successfully submitted ${urls.length} URLs to IndexNow.`
);
