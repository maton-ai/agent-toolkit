export type Options = {
  apiKey: string;
  connection?: string;
};

export const ACCEPTED_ARGS = ['api-key', 'connection'];

export function parseArgs(args: string[]): Options {
  const options: Partial<Options> = {};

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key === 'api-key') {
        options.apiKey = value;
      } else if (key === 'connection') {
        options.connection = value;
      } else {
        throw new Error(
          `Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(', ')}`
        );
      }
    }
  });

  // Check if API key is either provided in args or set in environment variables
  const apiKey = options.apiKey || process.env.MATON_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Maton API key not provided. Please either pass it as an argument --api-key=$KEY or set the MATON_API_KEY environment variable. Create one at https://maton.ai.'
    );
  }
  options.apiKey = apiKey;

  return options as Options;
}

export function validateApiKey(apiKey: string): void {
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      'Invalid API key: the Maton API key must be a non-empty string.'
    );
  }
}

export function buildHeaders(
  options: Options,
  userAgent: string
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${options.apiKey}`,
    'User-Agent': userAgent,
  };

  if (options.connection) {
    headers['Maton-Connection'] = options.connection;
  }

  return headers;
}
