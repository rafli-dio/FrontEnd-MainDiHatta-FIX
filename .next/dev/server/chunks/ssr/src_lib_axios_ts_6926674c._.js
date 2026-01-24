module.exports = [
"[project]/src/lib/axios.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_ccd77795._.js",
  "server/chunks/ssr/[root-of-the-server]__00b2efd2._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/axios.ts [app-ssr] (ecmascript)");
    });
});
}),
];