const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed.ts');
const content = fs.readFileSync(seedPath, 'utf-8');
let newContent = content;

// Step 1: Add new imports if not present
if (!newContent.includes("import { TASKS_PART_3 }")) {
  newContent = newContent.replace(
    "import { TASKS_PART_2 } from './tasks-part2';",
    "import { TASKS_PART_2 } from './tasks-part2';\nimport { TASKS_PART_3 } from './tasks-part3';\nimport { TASKS_PART_4 } from './tasks-part4';"
  );
}

// Step 2: Update the TASKS array merge
newContent = newContent.replace(
  "const TASKS = [...TASKS_PART_1, ...TASKS_PART_2];",
  "const TASKS = [...TASKS_PART_1, ...TASKS_PART_2, ...TASKS_PART_3, ...TASKS_PART_4];"
);

fs.writeFileSync(seedPath, newContent);
console.log('Successfully updated seed.ts to include parts 3 and 4.');
