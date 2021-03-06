/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Topic {
  id: string;
  name: string;
  type: 'topic' | 'template';
  template: string | null;
  description: string | null;
  fields: string[];
  units: Unit[];
  data_tools: DataTool[];
  metadata: {
    [k: string]: unknown;
  };
}
export interface Unit {
  field: string;
  unit: string;
}
export interface DataTool {
  field: string;
  method: string;
  metadata?: {
    [k: string]: unknown;
  };
  parameters?: {
    [k: string]: unknown;
  };
}
