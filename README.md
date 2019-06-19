# Bitbucket mass branch delete

When you have many projects and many tickets, you probably also create a lot of branches. If you forget to delete these branches when merging them, you will end up with a lot of stale merged branches.

This add-on adds a mass delete option to the branch page. You can now select as many branches as you want and delete them all with one click.

# Installation

Get it from the Atlassian Marketplace: https://marketplace.atlassian.com/manage/apps/1216388/versions

# Development

Install the Atlassian SDK: https://developer.atlassian.com/server/framework/atlassian-sdk/

Here are the SDK commands you'll use immediately:

* atlas-run   -- installs this plugin into the product and starts it on localhost
* atlas-debug -- same as atlas-run, but allows a debugger to attach at port 5005
* atlas-cli   -- after atlas-run or atlas-debug, opens a Maven command line window:
                 - 'pi' reinstalls the plugin into the running product instance
* atlas-help  -- prints description for all commands in the SDK

Full documentation is always available at:

https://developer.atlassian.com/display/DOCS/Introduction+to+the+Atlassian+Plugin+SDK
