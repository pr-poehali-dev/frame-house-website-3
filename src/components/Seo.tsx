import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const SITE_URL = "https://dacha365.site";
const DEFAULT_OG_IMAGE = "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/83ca5248-731c-43de-b72f-983173822a82.jpg";

export default function Seo({ title, description, path = "/", image = DEFAULT_OG_IMAGE }: SeoProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}