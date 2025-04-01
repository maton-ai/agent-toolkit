import {MatonAgentToolkit} from '@maton/agent-toolkit/ai-sdk';
import {openai} from '@ai-sdk/openai';
import {generateText} from 'ai';

require('dotenv').config();

const matonAgentToolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
});

(async () => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    tools: {
      ...matonAgentToolkit.getTools(),
    },
    maxSteps: 10,
    prompt: 'create contact for a@b.co and list contacts',
  });

  console.log(result.text);
})();
