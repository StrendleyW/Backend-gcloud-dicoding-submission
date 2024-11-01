const routes = [
  {
    path: `/`,
    method: `GET`,
    handler: (request, h) => {
      return `Homepage`;
    },
  },
  {
    path: `/`,
    method: `*`,
    handler: (request, h) => {
      return `Halaman tidak dapat diakses dengan method tersebut`;
    },
  },
  {
    path: `/about`,
    method: `GET`,
    handler: (request, h) => {
      return `About page`;
    },
  },
  {
    path: `/about`,
    method: `*`,
    handler: (request, h) => {
      return `Halaman tidak dapat diakses dengan method tersebut`;
    },
  },
  {
    path: `/hello/{name?}`,
    method: `GET`,
    handler: (request, h) => {
      const { name = "stranger" } = request.params;
      const { lang } = request.query;

      if (lang === `id`) {
        return `Hai, ${name}!`;
      }

      return `Hello, ${name}!`;
    },
  },
  {
    path: `/{any*}`,
    method: `*`,
    handler: (request, h) => {
      return `Halaman tidak ditemukan`;
    },
  },
];

module.exports = routes;
