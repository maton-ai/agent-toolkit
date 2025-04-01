import {MatonAgentToolkit} from '@maton/agent-toolkit/langchain';
import {createReactAgent} from '@langchain/langgraph/prebuilt';
import {ChatOpenAI} from '@langchain/openai';

require('dotenv').config();

const llm = new ChatOpenAI({
  temperature: 0,
  model: 'gpt-4o-mini',
});

const matonAgentToolkit = new MatonAgentToolkit({
  app: 'hubspot',
  actions: ['create-contact', 'list-contacts'],
});

(async (): Promise<void> => {
  const tools = matonAgentToolkit.getTools();

  const agent = await createReactAgent({
    llm,
    tools,
  });

  const stream = await agent.stream({
    messages: [
      ['human', 'create contact for a@b.co and list hubspot contacts'],
    ],
  });

  for await (const chunk of stream) {
    if (chunk.agent) {
      console.log(
        `================================= AI Message =================================`
      );
      const message = chunk.agent.messages[0];
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(JSON.stringify(message.tool_calls, undefined, 2));
      } else {
        console.log(message.content);
      }
    } else if (chunk.tools) {
      console.log(
        `================================= Tool Message =================================`
      );
      console.log(chunk.tools.messages[0].content);
    }
  }
})();
