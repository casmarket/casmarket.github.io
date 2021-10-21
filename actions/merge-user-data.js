import { fileURLToPath } from 'url';
import path from 'path';
import * as fileSystem from './file-system.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

await fileSystem.mergeDirectory(path.resolve(dirname, '../user-data'), path.resolve(dirname, '../docs'));
