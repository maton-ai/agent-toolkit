# Maton Agent Toolkit - TypeScript

The Maton Agent Toolkit enables popular agent frameworks including LangChain and Vercel's AI SDK to integrate with Maton APIs through function calling. It also provides tooling to quickly integrate metered billing for prompt and completion token usage.

To get started, get your API key in your [Maton Dashboard][api-keys] and check out [documentation][docs].

## Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```
npm install @maton/agent-toolkit
```

### Requirements

- Node 18+

### Usage

## Model Context Protocol

The Maton Agent Toolkit also supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/).

To run the Maton MCP server using npx, use the following command:

### API Agent (Beta)

```bash
# To use API agent
npx -y @maton/mcp hubspot --agent --api-key=YOUR_MATON_API_KEY
```

### API Action

```bash
# To set up all available API actions
npx -y @maton/mcp hubspot --actions=all --api-key=YOUR_MATON_API_KEY

# To set up all available API actions
npx -y @maton/mcp hubspot --actions=create-contact,list-contacts --api-key=YOUR_MATON_API_KEY
```

Replace `YOUR_MATON_API_KEY` with your actual Maton API key. Or, you could set the MATON_API_KEY in your environment variables. You can get your API key in your [Maton Dashboard][api-keys].

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```
{
  "mcpServers": {
    "maton": {
      "command": "npx",
      "args": [
        "-y",
        "@maton/mcp@latest",
        "hubspot",
        "--actions=all",
        "--api-key=YOUR_MATON_API_KEY"
      ]
    }
  }
}
```

Make sure to replace `YOUR_MATON_API_KEY` with your actual Maton API key. Alternatively, you could set the MATON_API_KEY in `env` variables. You can get your API key in your [Maton Dashboard][api-keys].

## Available API actions

| App               | Action                                |
| ----------------- | ------------------------------------- |
| `airtable`        | `list-bases`                          |
| `airtable`        | `list-records`                        |
| `airtable`        | `list-tables`                         |
| `asana`           | `create-task`                         |
| `asana`           | `get-task`                            |
| `asana`           | `list-projects`                       |
| `asana`           | `list-tasks`                          |
| `asana`           | `list-workspaces`                     |
| `aws`             | `get-s3-object`                       |
| `aws`             | `list-s3-buckets`                     |
| `aws`             | `list-s3-objects`                     |
| `calendly`        | `get-event`                           |
| `calendly`        | `list-event-invitees`                 |
| `calendly`        | `list-event-types`                    |
| `calendly`        | `list-events`                         |
| `clickup`         | `create-task`                         |
| `clickup`         | `delete-task`                         |
| `clickup`         | `get-task`                            |
| `clickup`         | `list-folders`                        |
| `clickup`         | `list-lists`                          |
| `clickup`         | `list-spaces`                         |
| `clickup`         | `list-tasks`                          |
| `clickup`         | `list-workspaces`                     |
| `google-calendar` | `create-event`                        |
| `google-calendar` | `delete-event`                        |
| `google-calendar` | `get-calendar`                        |
| `google-calendar` | `get-event`                           |
| `google-calendar` | `list-calendars`                      |
| `google-calendar` | `list-events`                         |
| `google-calendar` | `update-event`                        |
| `google-docs`     | `append-text`                         |
| `google-docs`     | `create-document`                     |
| `google-docs`     | `find-document`                       |
| `google-docs`     | `get-document`                        |
| `google-drive`    | `create-file`                         |
| `google-drive`    | `create-folder`                       |
| `google-drive`    | `delete-file`                         |
| `google-drive`    | `find-file`                           |
| `google-drive`    | `find-folder`                         |
| `google-drive`    | `get-file`                            |
| `google-drive`    | `list-files`                          |
| `google-mail`     | `add-label-to-email`                  |
| `google-mail`     | `create-draft`                        |
| `google-mail`     | `find-email`                          |
| `google-mail`     | `list-labels`                         |
| `google-mail`     | `send-email`                          |
| `google-mail`     | `remove-label-from-email`             |
| `google-sheet`    | `add-column`                          |
| `google-sheet`    | `add-multiple-rows`                   |
| `google-sheet`    | `clear-cell`                          |
| `google-sheet`    | `clear-rows`                          |
| `google-sheet`    | `create-spreadsheet`                  |
| `google-sheet`    | `create-worksheet`                    |
| `google-sheet`    | `delete-rows`                         |
| `google-sheet`    | `delete-worksheet`                    |
| `google-sheet`    | `find-row`                            |
| `google-sheet`    | `get-cell`                            |
| `google-sheet`    | `get-spreadsheet`                     |
| `google-sheet`    | `get-values-in-range`                 |
| `google-sheet`    | `list-worksheets`                     |
| `google-sheet`    | `update-cell`                         |
| `google-sheet`    | `update-multiple-rows`                |
| `google-sheet`    | `update-row`                          |
| `hubspot`         | `create-contact`                      |
| `hubspot`         | `get-contact`                         |
| `hubspot`         | `list-contacts`                       |
| `hubspot`         | `search-contacts`                     |
| `hubspot`         | `merge-contacts`                      |
| `hubspot`         | `update-contact`                      |
| `hubspot`         | `delete-contact`                      |
| `hubspot`         | `create-deal`                         |
| `hubspot`         | `get-deal`                            |
| `hubspot`         | `list-deals`                          |
| `hubspot`         | `search-deals`                        |
| `hubspot`         | `merge-deals`                         |
| `hubspot`         | `update-deal`                         |
| `hubspot`         | `delete-deal`                         |
| `jira`            | `list-clouds`                         |
| `jira`            | `get-issue`                           |
| `jira`            | `list-issues`                         |
| `jira`            | `add-comment-to-issue`                |
| `jira`            | `list-comments`                       |
| `jira`            | `update-comment`                      |
| `jira`            | `list-projects`                       |
| `jira`            | `get-user`                            |
| `jira`            | `list-users`                          |
| `jotform`         | `list-forms`                          |
| `jotform`         | `list-submissions`                    |
| `klaviyo`         | `add-profiles-to-list`                |
| `klaviyo`         | `assign-template-to-campaign-message` |
| `klaviyo`         | `create-campaign`                     |
| `klaviyo`         | `create-list`                         |
| `klaviyo`         | `create-profile`                      |
| `klaviyo`         | `create-template`                     |
| `klaviyo`         | `get-campaign-messages`               |
| `klaviyo`         | `get-campaign-send-job`               |
| `klaviyo`         | `get-campaigns`                       |
| `klaviyo`         | `get-lists`                           |
| `klaviyo`         | `get-profiles-for-list`               |
| `klaviyo`         | `get-profiles`                        |
| `klaviyo`         | `get-templates`                       |
| `klaviyo`         | `send-campaign`                       |
| `mailchimp`       | `get-campaign`                        |
| `mailchimp`       | `search-campaign`                     |
| `notion`          | `create-page`                         |
| `notion`          | `find-page`                           |
| `notion`          | `get-page`                            |
| `outlook`         | `create-draft`                        |
| `outlook`         | `find-email`                          |
| `outlook`         | `send-email`                          |
| `pipedrive`       | `search-people`                       |
| `salesforce`      | `create-contact`                      |
| `salesforce`      | `get-contact`                         |
| `salesforce`      | `list-contacts`                       |
| `shopify`         | `create-order`                        |
| `shopify`         | `get-order`                           |
| `shopify`         | `list-orders`                         |
| `slack`           | `list-channels`                       |
| `slack`           | `list-messages`                       |
| `slack`           | `list-replies`                        |
| `slack`           | `send-message`                        |
| `stripe`          | `create-customer`                     |
| `stripe`          | `create-invoice-item`                 |
| `stripe`          | `create-invoice`                      |
| `stripe`          | `delete-customer`                     |
| `stripe`          | `get-customer`                        |
| `stripe`          | `get-invoice`                         |
| `stripe`          | `list-customers`                      |
| `stripe`          | `list-invoices`                       |
| `typeform`        | `get-form`                            |
| `typeform`        | `list-forms`                          |
| `typeform`        | `list-responses`                      |
| `youtube`         | `list-videos`                         |
| `youtube`         | `search-videos`                       |

[api-keys]: https://maton.ai/api-keys
[docs]: https://maton.ai/docs/api-reference
