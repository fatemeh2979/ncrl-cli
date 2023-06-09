declare module 'metro-source-map' {
  //#region metro-source-map/src/source-map.js.flow

  type GeneratedCodeMapping = [number, number];
  type SourceMapping = [number, number, number, number];
  type SourceMappingWithName = [number, number, number, number, string];

  type HermesFunctionOffsets = { [key: number]: Readonly<number[]> };

  type FBSourcesArray = Readonly<(FBSourceMetadata | null)[]>;
  type FBSourceMetadata = [FBSourceFunctionMap | null];
  type FBSourceFunctionMap = {
    names: Readonly<string[]>;
    mappings: string;
  };

  type FBSegmentMap = { [id: string]: MixedSourceMap };

  interface BasicSourceMap {
    file?: string;
    mappings: string;
    names: string[];
    sourceRoot?: string;
    sources: string[];
    sourcesContent?: (string | null)[];
    version: number;
    x_facebook_offsets?: number[];
    x_metro_module_paths?: string[];
    x_facebook_sources?: FBSourcesArray;
    x_facebook_segments?: FBSegmentMap;
    x_hermes_function_offsets?: HermesFunctionOffsets;
  }

  interface IndexMapSection {
    map: IndexMap | BasicSourceMap;
    offset: {
      line: number;
      column: number;
    };
  }

  interface IndexMap {
    file?: string;
    mappings?: void; // avoids SourceMap being a disjoint union
    sections: IndexMapSection[];
    version: number;
    x_facebook_offsets?: number[];
    x_metro_module_paths?: string[];
    x_facebook_sources?: FBSourcesArray;
    x_facebook_segments?: FBSegmentMap;
    x_hermes_function_offsets?: HermesFunctionOffsets;
  }

  type MixedSourceMap = IndexMap | BasicSourceMap;

  //#endregion

  //#region metro-source-map/src/composeSourceMaps.js.flow

  export function composeSourceMaps(maps: Readonly<MixedSourceMap[]>): MixedSourceMap;

  //#endregion
}
