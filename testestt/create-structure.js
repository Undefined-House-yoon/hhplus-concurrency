// create-structure.js
const fs = require('fs');
const path = require('path');

const directories = [
  'controller',
  'domain/dto',
  'domain/entities',
  'domain/repositories',
  'domain/services',
  'infrastructure/services',
  'test',
];

directories.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// const files = [
//   'src/application/controller/application.controller.spec.ts',
//   'src/application/controller/application.controller.ts',
//   'src/application/domain/dto/create-application.dto.ts',
//   'src/application/domain/dto/update-application.dto.ts',
//   'src/application/domain/entities/application.entity.ts',
//   'src/application/domain/repositories/application.repository.ts',
//   'src/application/infrastructure/repositories/application.repository.impl.ts',
//   'src/application/domain/services/application.service.ts',
//   'src/application/infrastructure/services/application.service.impl.ts',
//   'src/application/application.module.ts',
//   'src/application/test/application.service.spec.ts',
//   'src/app.module.ts',
//   'src/main.ts',
// ];
//
// files.forEach((file) => {
//   fs.writeFileSync(path.join(__dirname, file), '');
// });

console.log('Project structure created successfully.');
