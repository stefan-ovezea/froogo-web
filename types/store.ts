import { Product } from './product';
import { Section } from './section';

export interface Store {
  name: string;
  sections: Section[];
  previewProducts?: Product[];
}
