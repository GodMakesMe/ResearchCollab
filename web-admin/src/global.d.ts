// src/global.d.ts
export {};

declare global {
  interface Window {
    google: typeof google;
  }

  const google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: any) => void;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            theme: string;
            size: string;
          }
        ) => void;
        prompt: () => void;
      };
    };
  };
}
