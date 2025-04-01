import {MatonAgentToolkit} from '@maton/agent-toolkit/ai-sdk';
import {openai} from '@ai-sdk/openai';
import {generateText} from 'ai';

require('dotenv').config();

const matonAgentToolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
});
console.log(JSON.stringify(matonAgentToolkit.getTools(), null, 2));

(async () => {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    tools: {
      ...matonAgentToolkit.getTools(),
    },
    maxSteps: 5,
    prompt: 'create contact for a@b.co and list hubspot contacts',
  });

  console.log(result.text);
})();
