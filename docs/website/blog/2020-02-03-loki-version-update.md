---
title: Loki Version Update
author: Thalita Oliveira
authorURL: https://github.com/thalita12
authorImageURL: "http://1.gravatar.com/avatar/c75de29c500eefb0743196d660ded435"
---

## After a long time Loki updated the version of Vuetify!

That's right you read, Loki is updated with version 2.2.x of Vuetify! Therefore, a version 2.0.1 was released yesterday (01/02), with library version updates, features and bug / issue fixes.

<!--truncate-->

### Does this mean that I need to migrate my project version to Vuetify 2.2.x to update Loki?

You don't have to! We still maintained a version of Loki the way it was, in fact, it's enhanced with new features and bug fixes. The stable version is 1.0.0.

### Does this mean that Loki has 2 versions of Vuetify?

Yes that's right. If your project already used the Loki version at 0.4.x, you can upgrade to version 1.0.x which will continue as it was before. New projects that choose to use the latest version of Vuetify, must use version 2.0.x of Loki.

### If I am on the old version can I upgrade to Loki version 2.0.x?

Yes you can. Therefore, it is recommended that this needs to be estimated in good time and be foreseen in a Sprint or MVP version of your project, as some of the components of version 1.5.x of Vuetify in version 2.2.x, ceased to exist or had their CSS classes changed. Therefore, your unit tests will fail and your layout will need corrections, that is a fact.

The "Compra Direta" project started the migration, but abandoned because many components broke and their tests too, so it was postponed to another MVP.

The "Patrimônio Intangíveis" project, on the other hand, uses Loki's version 2.0.x and everything went well. So, it is up to the teams to migrate, but I repeat, this needs to be estimated with time, but it is possible to do so!

### With these updates do I need to add the "pdfjs-dist" dependency to my project?

Yes, you do. No way has yet been found to correct this problem. So just add the dependency that will be all right;)

### Does Loki have a pipeline?

Yes, it has a pipeline on GitHub that performs lint and unit tests. So, no commits with failed tests and no good development practices =)

### Loki has two branches: Stable and Master?

Yes, in these two branches are the versions of Vuetify. The "stable" branch contains version 1.0.x of Loki, and there is version 1.5.x of Vuetify. The "master" branch, on the other hand, contains version 2.0.x of Loki, and there is version 2.2.x of Vuetify.

Please be careful when requesting a pull request and changing branches!

### Care for loki release

Any changes from 0.4.15, should be released exclusively in version 1.0.x and branch "stable".

Changes to the new version of Vuetify, is in the tag from 2.0.x and in the "master" branch.

When there is a pull request, already request the version change in package.json to the developer.

It is no longer necessary to do a local Loki release, just create a new tag, which GitHub will automatically publish to NPM. The settings are in the root folder ".github / workflows".

There are still tests failing that have a skip test. We will correct all the tests, I promise;)

You can commit without unit testing, but as we have great developers in the community, we know it won't happen that often. (It will be?)

We were unable to test that all components on the master are working on version 2.0.x, if there are problems, forgive us.

### Is there documentation now?

It does not have documentation yet, but we are solving this and will inform you soon when we release the documentation for both versions: 1.0.x and 2.0.x!

### What's new?!

- New PDF viewing feature, with the component "az-pdf-document-viewer";
- Correction of the component of "az-money";
- Issue correction: "Potential security vulnerability in webpack-dev-server # 89";
- Updating the organization of unit tests, which are now close to the components to be tested;
- Eslint configuration;
- Update / Correction of unit tests;
- Addition of the "MIT" license 0 //