const path = require('path');

module.exports = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
