const fs = require('fs');

const schemaPath = 'studio/schemas/project.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes("'competitions'")) {
  schema = schema.replace(
    "{title: 'Design + Build', value: 'turnkey-build'},",
    "{title: 'Design + Build', value: 'turnkey-build'},\n  {title: 'Competitions', value: 'competitions'},"
  );
  
  fs.writeFileSync(schemaPath, schema);
  console.log('✓ schema updated successfully');
} else {
  console.log('schema already has competitions');
}
