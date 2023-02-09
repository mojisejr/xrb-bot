declare global {
  namespace NodeJS {
    interface ProcessEnv {
      production: boolean;
      discord_token: string;
      discord_guildId: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
