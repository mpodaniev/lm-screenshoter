module.exports = options => {
  return {
    id: `${options.project}_test`,
    viewports: [
      {
        label: "iPhone 5",
        width: 320,
        height: 480
      },
      {
        label: "iPad",
        width: 768,
        height: 1024
      },
      {
        label: "Laptop 1440",
        width: 1440,
        height: 800
      }
    ],
    scenarios: options.scenarios,
    onBeforeScript: "puppet/onBefore.js",
    onReadyScript: "puppet/onReady.js",
    "paths": {
      bitmaps_reference: `backstop_data/${options.project}/bitmaps_reference`,
      bitmaps_test: `backstop_data/${options.project}/bitmaps_test`,
      engine_scripts: `backstop_data/${options.project}/engine_scripts`,
      html_report: `backstop_data/${options.project}/html_report`,
      ci_report: `backstop_data/${options.project}/ci_report`
    },
    report: ["browser"],
    engine: "puppeteer",
    engineOptions: {
      args: ["--no-sandbox"]
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false,
    debugWindow: false
  };
};
