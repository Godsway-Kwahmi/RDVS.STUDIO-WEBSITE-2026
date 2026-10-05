import {defineCliConfig} from 'sanity/cli'

// The project id and dataset are public information (js/sanity-client.js queries the same CDN
// endpoint from the browser), so they live here rather than in an env file.
export default defineCliConfig({
  api: {
    projectId: 'lqnpv8ns',
    dataset: 'production'
  },
  // Decides the deployed URL: `sanity deploy` publishes to https://rdvs.sanity.studio.
  studioHost: 'rdvs',
  // `autoUpdates` used to sit at the top level. The v6 CLI moved it under `deployment` and warns on
  // the old shape -- and it still auto-updates to the latest channel, which is what the missing
  // `appId` below would otherwise pin.
  deployment: {
    autoUpdates: true,
    // Add the studio's appId from sanity.io/manage -> project -> Studios to get fine-grained version
    // selection instead of tracking the latest channel. It cannot be guessed from the repo.
    // appId: 'lqnpv8ns.rdvss',
  },
})
