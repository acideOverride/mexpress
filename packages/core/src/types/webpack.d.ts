declare global {
  var __webpack_init_sharing__: (scope: string) => Promise<void>;
  var __webpack_share_scopes__: {
    default: Record<string, unknown>;
  };
  
  interface Window {
    __webpack_init_sharing__: typeof __webpack_init_sharing__;
    __webpack_share_scopes__: typeof __webpack_share_scopes__;
  }
}

export {};