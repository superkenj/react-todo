module.exports = {
    globDirectory: "public",
    globPatterns: ["**/*.{png,svg,jpg,jpeg,ico,html,js,json,css,webmanifest}"],
    swDest: "public/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 * 60 * 24 * 365, // one year
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 60 * 60 * 24 * 365, // one year
          },
        },
      },
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  }
  