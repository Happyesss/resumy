import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://resumy.live'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/analyze-resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'monthly', 
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly', 
      priority: 0.3,
    },
    // Add SEO-friendly blog/guide URLs if you create them in the future
    // {
    //   url: `${baseUrl}/guides/how-to-build-ats-resume`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/guides/resume-keywords-optimization`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // }
  ]
}
