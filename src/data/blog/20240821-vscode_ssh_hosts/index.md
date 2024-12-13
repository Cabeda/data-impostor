---
title: "TIL: VS Code multiple hosts"
pubDate: 2024-08-21
tags:
  - vscode
  - git
  - ssh
---

So, a challenge I was having for a while and finally found a solution. Currently I'm having to work on both Github and Gitlab. As I use SSH to authenticate, it means I have a different key for each service. This works great except that VS code, when trying to use its git features, would fail. After using copilot I got the following response:

```plaintext

Ensure your ~/.ssh/config file is correctly configured. Here is an example configuration:

Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github

Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_rsa_gitlab

```

I pointed to the correct hosts and Identity files in my `~/.ssh/config` file and I was able to use VS code's git features without any issues!
