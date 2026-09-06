import { Helmet } from "react-helmet-async";

interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  readTime?: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface HowToMeta {
  steps: HowToStep[];
  totalTime?: string;
}

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  article?: ArticleMeta;
  howTo?: HowToMeta;
}

const SITE_URL = "https://dacha365.site";
const DEFAULT_OG_IMAGE = "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/83ca5248-731c-43de-b72f-983173822a82.jpg";
const SITE_NAME = "КаркасДом";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/articles?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Seo({ title, description, path = "/", image = DEFAULT_OG_IMAGE, noindex = false, article, howTo }: SeoProps) {
  const url = `${SITE_URL}${path}`;

  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image,
        url,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE } },
        ...(article.publishedTime ? { datePublished: article.publishedTime } : {}),
        ...(article.modifiedTime ? { dateModified: article.modifiedTime } : {}),
      }
    : null;

  const howToJsonLd = howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: title,
        description,
        image,
        ...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
        step: howTo.steps.map((s) => ({
          "@type": "HowToStep",
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {path === "/" && (
        <>
          <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
          <script type="application/ld+json">{JSON.stringify(WEBSITE_JSON_LD)}</script>
        </>
      )}
      {articleJsonLd && (
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      )}
      {howToJsonLd && (
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
      )}
    </Helmet>
  );
}