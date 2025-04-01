import {MatonAgentToolkit} from '@maton/agent-toolkit/openai';
import OpenAI from 'openai';
import type {ChatCompletionMessageParam} from 'openai/resources';

require('dotenv').config();

const openai = new OpenAI();

const matonAgentToolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
});

(async (): Promise<void> => {
  let messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `create contact for a@b.co and list hubspot contacts`,
    },
  ];

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: matonAgentToolkit.getTools(),
    });

    const message = completion.choices[0].message;

    messages.push(message);

    if (message.tool_calls) {
      // eslint-disable-next-line no-await-in-loop
      const toolMessages = await Promise.all(
        message.tool_calls.map((tc) => matonAgentToolkit.handleToolCall(tc))
      );
      messages = [...messages, ...toolMessages];
    } else {
      console.log(completion.choices[0].message);
      break;
    }
  }
})();
