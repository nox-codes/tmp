const fs = require('fs');
const map = JSON.parse(fs.readFileSync('Desktop_unilock-frontend_app_cbt_page_tsx_10xq7ma._.js.map', 'utf8'));
console.log('sources:', map.sources);
console.log('has sourcesContent:', !!map.sourcesContent);
console.log('sourcesContent count:', map.sourcesContent ? map.sourcesContent.length : 0);
