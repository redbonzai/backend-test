import { LocationDocument } from '@locations/models';

export class Task {
  description: string;
  location: LocationDocument;
  completed: boolean;
}
