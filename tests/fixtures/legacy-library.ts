import {db} from '../../lib/db';
import * as seed from '../../lib/seed';
// Historical imported content for regression checks; never installed by the application.
export async function installLegacyFixture(){await db.subjects.bulkPut(seed.subjects);await db.topics.bulkPut(seed.topics);await db.lessons.bulkPut(seed.lessons);await db.questions.bulkPut(seed.questions);}
