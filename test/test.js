const path = require("path");
const test = require("ava");
const eleventyImage = require("../");

test("getFormats", t => {
  let formats = eleventyImage.getFormats("webp,png");
  t.is(formats.length, 2);
  t.is(formats[0], "webp");
  t.is(formats[1], "png");
});

test("getFormats (three) with svg reorder", t => {
  let formats = eleventyImage.getFormats("webp,png,svg");
  t.is(formats.length, 3);
  // svg should be first
  t.is(formats[0], "svg");
  t.is(formats[1], "webp");
  t.is(formats[2], "png");
});

test("getFormats (three) with svg reorder 2", t => {
  let formats = eleventyImage.getFormats("webp,svg,png");
  t.is(formats.length, 3);
  // svg should be first
  t.is(formats[0], "svg");
  t.is(formats[1], "webp");
  t.is(formats[2], "png");
});

test("getFormats (three) with svg no reorder", t => {
  let formats = eleventyImage.getFormats("svg,webp,png");
  t.is(formats.length, 3);
  // svg should be first
  t.is(formats[0], "svg");
  t.is(formats[1], "webp");
  t.is(formats[2], "png");
});

test("Sync with jpeg input", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg");
  t.is(stats.webp.length, 1);
  t.is(stats.jpeg.length, 1);
});

test("Sync by dimension with jpeg input", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 1280, 853);
  t.is(stats.webp.length, 1);
  t.is(stats.jpeg.length, 1);
});

test("Sync with widths", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg", {
    widths: [300]
  });
  t.is(stats.webp.length, 1);
  t.is(stats.webp[0].width, 300);
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].width, 300);
});

test("Sync by dimension with widths", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 1280, 853, {
    widths: [300]
  });
  t.is(stats.webp.length, 1);
  t.is(stats.webp[0].width, 300);
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].width, 300);
});


test("Sync with two widths", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg", {
    widths: [300, 500]
  });
  t.is(stats.webp.length, 2);
  t.is(stats.webp[0].width, 300);
  t.is(stats.webp[1].width, 500);
  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].width, 300);
  t.is(stats.jpeg[1].width, 500);
});

test("Sync by dimension with two widths", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 1280, 853, {
    widths: [300, 500]
  });
  t.is(stats.webp.length, 2);
  t.is(stats.webp[0].width, 300);
  t.is(stats.webp[1].width, 500);
  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].width, 300);
  t.is(stats.jpeg[1].width, 500);
});


test("Sync with null width", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg", {
    widths: [300, null]
  });
  t.is(stats.webp.length, 2);
  t.is(stats.webp[0].width, 300);
  t.is(stats.webp[0].height, 199);
  t.is(stats.webp[1].width, 1280);
  t.is(stats.webp[1].height, 853);
  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].width, 300);
  t.is(stats.jpeg[0].height, 199);
  t.is(stats.jpeg[1].width, 1280);
  t.is(stats.jpeg[1].height, 853);
});

test("Sync by dimension with null width", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 1280, 853, {
    widths: [300, null]
  });
  t.is(stats.webp.length, 2);
  t.is(stats.webp[0].width, 300);
  t.is(stats.webp[0].height, 199);
  t.is(stats.webp[1].width, 1280);
  t.is(stats.webp[1].height, 853);
  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].width, 300);
  t.is(stats.jpeg[0].height, 199);
  t.is(stats.jpeg[1].width, 1280);
  t.is(stats.jpeg[1].height, 853);
});

test("Try to use a width larger than original", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [1500],
    formats: ["jpeg"],
    outputDir: "./test/img/"
  });
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].outputPath, "test/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Try to use a width larger than original (two sizes)", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [1500, 2000],
    formats: ["jpeg"],
    outputDir: "./test/img/"
  });
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].outputPath, "test/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Try to use a width larger than original (with a null in there)", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [1500, null],
    formats: ["jpeg"],
    outputDir: "./test/img/"
  });
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].outputPath, "test/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Just falsy width", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [null],
    formats: ["jpeg"],
    outputDir: "./test/img/"
  });
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].outputPath, "test/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Use exact same width as original", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [1280],
    formats: ["jpeg"],
    outputDir: "./test/img/"
  });
  t.is(stats.jpeg.length, 1);
  // breaking change in 0.5: always use width in filename
  t.is(stats.jpeg[0].outputPath, "test/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Try to use a width larger than original (statsSync)", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg", {
    widths: [1500],
    formats: ["jpeg"]
  });

  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].url, "/img/97854483-1280.jpeg");
  t.is(stats.jpeg[0].width, 1280);
});

test("Use exact same width as original (statsSync)", t => {
  let stats = eleventyImage.statsSync("./test/bio-2017.jpg", {
    widths: [1280],
    formats: ["jpeg"]
  });

  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].url, "/img/97854483-1280.jpeg"); // no width in filename
  t.is(stats.jpeg[0].width, 1280);
});

test("Use custom function to define file names", async (t) => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [600, 1280],
    formats: ["jpeg"],
    outputDir: "./test/img/",
    filenameFormat: function (id, src, width, format) { // and options
      const ext = path.extname(src);
      const name = path.basename(src, ext);

      if (width) {
        return `${name}-${id}-${width}.${format}`;
      }

      return `${name}-${id}.${format}`;
    }
  });

  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].outputPath, "test/img/bio-2017-97854483-600.jpeg");
  t.is(stats.jpeg[0].url, "/img/bio-2017-97854483-600.jpeg");
  t.is(stats.jpeg[0].srcset, "/img/bio-2017-97854483-600.jpeg 600w");
  t.is(stats.jpeg[0].width, 600);
  t.is(stats.jpeg[1].outputPath, "test/img/bio-2017-97854483-1280.jpeg");
  t.is(stats.jpeg[1].url, "/img/bio-2017-97854483-1280.jpeg");
  t.is(stats.jpeg[1].srcset, "/img/bio-2017-97854483-1280.jpeg 1280w");
  t.is(stats.jpeg[1].width, 1280);
});

test("Unavatar test", t => {
  let stats = eleventyImage.statsByDimensionsSync("https://unavatar.now.sh/twitter/zachleat?fallback=false", 400, 400, {
    widths: [75]
  });

  t.is(stats.webp.length, 1);
  t.is(stats.webp[0].width, 75);
  t.is(stats.webp[0].height, 75);
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].width, 75);
  t.is(stats.jpeg[0].height, 75);
});

test("Ask for svg output from a raster image (skipped)", async t => {
  let stats = await eleventyImage("./test/bio-2017.jpg", {
    widths: [null],
    formats: ["svg"],
    outputDir: "./test/img/"
  });

  t.notDeepEqual(stats, {});
  t.deepEqual(stats.svg, []);
});

test("Upscale an SVG, Issue #32", async t => {
  let stats = await eleventyImage("./test/logo.svg", {
    widths: [3000],
    formats: ["png"],
    outputDir: "./test/img/"
  });

  t.is(stats.png.length, 1);
  t.is(stats.png[0].filename.substr(-9), "-3000.png"); // should include width in filename
  t.is(stats.png[0].width, 3000);
  t.is(stats.png[0].height, 4179);
});

test("Upscale an SVG (disallowed in option), Issue #32", async t => {
  let stats = await eleventyImage("./test/logo.svg", {
    widths: [3000],
    formats: ["png"],
    outputDir: "./test/img/",
    svgAllowUpscale: false
  });

  t.is(stats.png.length, 1);
  t.not(stats.png[0].filename.substr(-9), "-3000.png"); // should not include width in filename
  t.is(stats.png[0].width, 1569);
  t.is(stats.png[0].height, 2186);
});

test("svgShortCircuit", async t => {
  let stats = await eleventyImage("./test/logo.svg", {
    widths: [null],
    formats: ["svg", "png", "webp"],
    outputDir: "./test/img/",
    svgShortCircuit: true,
  });

  t.is(stats.svg.length, 1);
  t.truthy(stats.svg[0].size);
  t.is(stats.png.length, 0);
  t.is(stats.webp.length, 0);
});


test("getWidths", t => {
  t.deepEqual(eleventyImage.getWidths(300, [null]), [300]); // want original
  t.deepEqual(eleventyImage.getWidths(300, [600]), [300]); // want larger
  t.deepEqual(eleventyImage.getWidths(300, [150]), [150]); // want smaller

  t.deepEqual(eleventyImage.getWidths(300, [600, null]), [300]);
  t.deepEqual(eleventyImage.getWidths(300, [null, 600]), [300]);
  t.deepEqual(eleventyImage.getWidths(300, [150, null]), [150,300]);
  t.deepEqual(eleventyImage.getWidths(300, [null, 150]), [150,300]);
});

test("getWidths allow upscaling", t => {
  t.deepEqual(eleventyImage.getWidths(300, [null], true), [300]); // want original
  t.deepEqual(eleventyImage.getWidths(300, [600], true), [600]); // want larger
  t.deepEqual(eleventyImage.getWidths(300, [150], true), [150]); // want smaller

  t.deepEqual(eleventyImage.getWidths(300, [600, null], true), [300, 600]);
  t.deepEqual(eleventyImage.getWidths(300, [null, 600], true), [300, 600]);
  t.deepEqual(eleventyImage.getWidths(300, [150, null], true), [150,300]);
  t.deepEqual(eleventyImage.getWidths(300, [null, 150], true), [150,300]);
});

test("Sync by dimension with jpeg input (wrong dimensions, supplied are smaller than real)", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 164, 164, {
    widths: [164, 328],
    formats: ["jpeg"],
  });

  // this won’t upscale so it will miss out on higher resolution images but there won’t be any broken image URLs in the output
  t.is(stats.jpeg.length, 1);
  t.is(stats.jpeg[0].outputPath, "img/97854483-164.jpeg");
});

test("Sync by dimension with jpeg input (wrong dimensions, supplied are larger than real)", t => {
  let stats = eleventyImage.statsByDimensionsSync("./test/bio-2017.jpg", 1500, 1500, {
    widths: [164, 328],
    formats: ["jpeg"],
  });

  t.is(stats.jpeg.length, 2);
  t.is(stats.jpeg[0].outputPath, "img/97854483-164.jpeg");
  t.is(stats.jpeg[1].outputPath, "img/97854483-328.jpeg");
});

test("Keep a cache, reuse with same file names and options", async t => {
  let promise1 = eleventyImage("./test/bio-2017.jpg", { dryRun: true });
  let promise2 = eleventyImage("./test/bio-2017.jpg", { dryRun: true });
  t.is(promise1, promise2);

  let stats1 = await promise1;
  let stats2 = await promise2;
  t.deepEqual(stats1, stats2);
});

test("Keep a cache, reuse with same remote url and options", async t => {
  let promise1 = eleventyImage("https://www.zachleat.com/img/avatar-2017-big.png", { dryRun: true });
  let promise2 = eleventyImage("https://www.zachleat.com/img/avatar-2017-big.png", { dryRun: true });
  t.is(promise1, promise2);

  let stats1 = await promise1;
  let stats2 = await promise2;
  t.deepEqual(stats1, stats2);
});

test("Keep a cache, don’t reuse with same file names and different options", async t => {
  let promise1 = eleventyImage("./test/bio-2017.jpg", {
    widths: [null],
    dryRun: true,
  });
  let promise2 = eleventyImage("./test/bio-2017.jpg", {
    widths: [300],
    dryRun: true,
  });
  t.not(promise1, promise2);

  let stats1 = await promise1;
  let stats2 = await promise2;
  t.notDeepEqual(stats1, stats2);

  t.is(stats1.jpeg.length, 1);
  t.is(stats2.jpeg.length, 1);
});

test.skip("Keep a cache, don’t reuse with if the image changes", async t => {
  let promise1 = eleventyImage("./test/bio-2017.jpg", {
    dryRun: true,
  });
  // TODO modify image
  let promise2 = eleventyImage("./test/bio-2017.jpg", {
    dryRun: true,
  });
  t.not(promise1, promise2);

  let stats1 = await promise1;
  let stats2 = await promise2;
  t.notDeepEqual(stats1, stats2);

  t.is(stats1.jpeg.length, 1);
  t.is(stats2.jpeg.length, 1);
});
