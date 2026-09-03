import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- Checking Favicon files in dist/ ---');
assert(fs.existsSync(path.join(distDir, 'favicon.ico')), 'dist/favicon.ico exists');
assert(fs.existsSync(path.join(distDir, 'favicon.svg')), 'dist/favicon.svg exists');
assert(fs.statSync(path.join(distDir, 'favicon.ico')).size > 0, 'dist/favicon.ico is non-empty');
assert(fs.statSync(path.join(distDir, 'favicon.svg')).size > 0, 'dist/favicon.svg is non-empty');

console.log('\n--- Checking dist/index.html (Homepage) ---');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// 1. Check h1 tag
const h1Matches = indexHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
assert(h1Matches && h1Matches.length === 1, `Homepage has exactly 1 <h1> tag (found: ${h1Matches ? h1Matches.length : 0})`);
console.log(`   Found H1: ${h1Matches[0]}`);

// 2. Check canonical URL
assert(indexHtml.includes('<link rel="canonical" href="https://onscicalc.com">'), 'Homepage canonical is https://onscicalc.com (no trailing slash)');
assert(!indexHtml.includes('<link rel="canonical" href="https://onscicalc.com/">'), 'Homepage canonical does NOT have trailing slash');

// 3. Check hreflang alternates
assert(indexHtml.includes('hreflang="en" href="https://onscicalc.com"'), 'hreflang="en" is https://onscicalc.com (no trailing slash)');
assert(indexHtml.includes('hreflang="x-default" href="https://onscicalc.com"'), 'hreflang="x-default" is https://onscicalc.com (no trailing slash)');
assert(!indexHtml.includes('hreflang="en" href="https://onscicalc.com/"'), 'hreflang="en" does NOT have trailing slash');

// 4. Check obsolete meta tags are gone
assert(!indexHtml.includes('<meta name="keywords"'), 'Obsolete meta name="keywords" is removed');
assert(!indexHtml.includes('<meta name="title"'), 'Redundant meta name="title" is removed');
assert(!indexHtml.includes('<meta name="rating"'), 'Obsolete meta name="rating" is removed');
assert(!indexHtml.includes('<meta name="revisit-after"'), 'Obsolete meta name="revisit-after" is removed');

// 5. Check Mobile SEO visibility
assert(!indexHtml.includes('<summary class="hidden md:block'), 'Summary is NOT hidden on mobile');
assert(!indexHtml.includes('class="hidden md:block group-open:block'), 'SEO content div is NOT hidden on mobile');

// 6. Check JSON-LD structured data
const jsonLdMatches = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
assert(jsonLdMatches.length > 0, `Found ${jsonLdMatches.length} JSON-LD scripts on homepage`);

let parsedSchemas = [];
for (const match of jsonLdMatches) {
  try {
    const parsed = JSON.parse(match[1]);
    parsedSchemas.push(parsed);
  } catch (err) {
    assert(false, `Invalid JSON-LD syntax: ${err.message}`);
  }
}
console.log(`✅ PASSED: All ${parsedSchemas.length} JSON-LD scripts are valid JSON`);

// Check WebSite schema: no potentialAction SearchAction
const webSiteSchema = parsedSchemas.find(s => s['@graph'] && s['@graph'].some(g => g['@type'] === 'WebSite'));
assert(webSiteSchema, 'WebSite schema found in @graph');
const webSiteNode = webSiteSchema['@graph'].find(g => g['@type'] === 'WebSite');
assert(!webSiteNode.potentialAction, 'Deprecated Sitelinks SearchAction is removed from WebSite schema');
assert(webSiteNode.url === 'https://onscicalc.com', 'WebSite url is https://onscicalc.com without trailing slash');

// Check MathSolver schema
const mathSolverSchema = parsedSchemas.find(s => Array.isArray(s['@type']) && s['@type'].includes('MathSolver'));
assert(mathSolverSchema, 'MathSolver schema found');
const questionTypes = mathSolverSchema.potentialAction[0].eduQuestionType;
const invalidTypes = questionTypes.filter(t => ['Arithmetic', 'Algebra', 'Trigonometry', 'Function'].includes(t));
assert(invalidTypes.length === 0, `MathSolver has no non-standard types (invalid found: ${invalidTypes.join(', ')})`);

console.log('\n--- Checking dist/404.html & dist/500.html ---');
const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf-8');
assert(!notFoundHtml.includes('rel="canonical" href="https://onscicalc.com/"'), '404.html does NOT canonicalize to homepage');
assert(!notFoundHtml.includes('rel="canonical"'), '404.html does not render any canonical tag');
assert(notFoundHtml.includes('name="robots" content="noindex'), '404.html has noindex');

const error500Html = fs.readFileSync(path.join(distDir, '500.html'), 'utf-8');
assert(!error500Html.includes('rel="canonical"'), '500.html does not render any canonical tag');
assert(error500Html.includes('name="robots" content="noindex'), '500.html has noindex');

console.log('\n--- Checking dist/es/index.html (Spanish Homepage) ---');
const esHtml = fs.readFileSync(path.join(distDir, 'es', 'index.html'), 'utf-8');
const esH1 = esHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
assert(esH1 && esH1.length === 1, `Spanish homepage has 1 <h1> tag (${esH1 ? esH1[0].trim() : ''})`);
assert(esHtml.includes('hreflang="es" href="https://onscicalc.com/es"'), 'Spanish hreflang is correct');
assert(esHtml.includes('rel="canonical" href="https://onscicalc.com/es"'), 'Spanish canonical is correct');

console.log('\n--- Checking dist/tools/fraction-calculator/index.html ---');
const fractionHtml = fs.readFileSync(path.join(distDir, 'tools', 'fraction-calculator', 'index.html'), 'utf-8');
const fractionJsonLds = [...fractionHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
const fractionParsed = fractionJsonLds.map(m => JSON.parse(m[1]));
const fractionSolver = fractionParsed.find(s => Array.isArray(s['@type']) && s['@type'].includes('MathSolver'));
assert(fractionSolver, 'Fraction tool has MathSolver schema');
const fractionTypes = fractionSolver.potentialAction[0].eduQuestionType;
assert(!fractionTypes.includes('Arithmetic'), 'Fraction tool does not contain "Arithmetic" question type');

console.log('\n🌟 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
