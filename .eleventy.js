const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const htmlmin = require("html-minifier");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const embedEverything = require("eleventy-plugin-embed-everything");
const pluginPWA = require("eleventy-plugin-pwa");
const excerpt = require('eleventy-plugin-excerpt');

module.exports = function(eleventyConfig) {
    // Podcast collection
    eleventyConfig.addLayoutAlias("episode", "layouts/episode.njk");
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(pluginPWA);

    // Social Embeds
    eleventyConfig.addPlugin(embedEverything, {
        use: ['youtube', 'twitter', 'spotify']
    });

    // Custom excerpts
    eleventyConfig.addPlugin(excerpt, {
        excerptSeparator: '<!--more-->'
    });

    // Date formatting (human readable)
    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("LLL dd, yyyy");
    });

    // Date formatting (machine readable)
    eleventyConfig.addFilter("machineDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
    });

    // Minify CSS
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });


    // Minify JS
    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
        code,
        callback
    ) {
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.error("Terser error: ", err);
            // Fail gracefully.
            callback(null, code);
        }
    });

    // Minify HTML output
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.indexOf(".html") > -1) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }
        return content;
    });

    // only content in the `podcast/` directory
    eleventyConfig.addCollection("episodes", function (collection) {
        return collection.getAllSorted().filter(function (item) {
            return item.inputPath.match(/^\.\/podcast\//) !== null;
        });
    });

    // Sass
    eleventyConfig.addWatchTarget("_includes/assets/scss");

    // Don't process files and folders with static assets e.g. images
    eleventyConfig.addPassthroughCopy({"_includes/assets/icons":"assets/icons"});
    eleventyConfig.addPassthroughCopy({"_includes/assets/img":"assets/img"});
    eleventyConfig.addPassthroughCopy({"_includes/assets/js":"assets/js"});
    eleventyConfig.addPassthroughCopy(".well-known/");
    eleventyConfig.addPassthroughCopy("manifest.json");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("browserconfig.xml");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("sw.js");

    /* Markdown Plugins */
    let markdownIt = require("markdown-it");
    let markdownItContainer = require("markdown-it-container");

    let options = {
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    };

    let markdownLib = markdownIt(options).use(markdownItContainer, 'callout');
    eleventyConfig.setLibrary("md", markdownLib);

    let opts = {
        permalink: true,
        permalinkClass: "direct-link",
        permalinkSymbol: "#"
    };

    return {
        templateFormats: ["md", "njk", "html"],
        pathPrefix: "/",

        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true,
        dir: {
            input: ".",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };

};