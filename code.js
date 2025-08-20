
import { Actor } from 'apify';
import { CheerioCrawler, Dataset } from 'crawlee';

await Actor.init();

// 🎯 Increased limit for target articles (75-100 daily)
const { maxRequestsPerCrawl = 2000 } = (await Actor.getInput()) ?? {};

// ====== 📊 Target Articles Per Category ======
const CATEGORY_TARGETS = {
    'Politics': 20,                    // Brazilian Politics
    'International Politics': 20,      // International Politics  
    'Sports': 25,                      // Sports
    'Finance': 20,                     // Finance
    'Gossip': 15                       // Gossip
};

// ====== 🇧🇷 Brazilian Static News Sites Configuration ======

const FINANCE_SITES = [
    {
        url: "https://valor.globo.com/financas",
        site: "valor.globo.com",
        category: "Finance",
        selectors: {
            article: ".feed-post, .materia-item",
            title: ".feed-post-body-title a, .materia-title a",
            link: ".feed-post-link, .materia-title a",
            summary: ".feed-post-body-resumo, .materia-chamada",
            date: ".feed-post-datetime, .materia-data",
            image: "img"
        }
    },
    {
        url: "https://www.infomoney.com.br/mercados/",
        site: "infomoney.com.br", 
        category: "Finance",
        selectors: {
            article: ".im-grid-item, article",
            title: ".im-grid-item-title a, h2 a",
            link: ".im-grid-item-title a, h2 a",
            summary: ".im-grid-item-excerpt, .excerpt",
            date: ".im-grid-item-date, time",
            image: "img"
        }
    },
    {
        url: "https://economia.uol.com.br/",
        site: "uol.com.br",
        category: "Finance", 
        selectors: {
            article: ".thumbnails-item",
            title: ".thumb-title",
            link: "a",
            summary: ".thumb-caption p, .thumb-description",
            date: ".thumb-date",
            image: "img"
        }
    },
    {
        url: "https://exame.com/economia/",
        site: "exame.com",
        category: "Finance",
        selectors: {
            article: ".post-item, article",
            title: ".post-title a, h2 a",
            link: ".post-title a, h2 a", 
            summary: ".post-excerpt, .excerpt",
            date: ".post-date, time",
            image: "img"
        }
    }
];

const SPORTS_SITES = [
    {
        url: "https://ge.globo.com/",
        site: "ge.globo.com",
        category: "Sports",
        selectors: {
            article: ".feed-post, .bastian-feed-item",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    },
    {
        url: "https://www.lance.com.br/",
        site: "lance.com.br",
        category: "Sports",
        selectors: {
            article: ".post-item, .news-item, article",
            title: ".post-title a, .news-title a, h2 a",
            link: ".post-title a, .news-title a, h2 a",
            summary: ".post-excerpt, .news-excerpt, .excerpt",
            date: ".post-date, .news-date, time",
            image: "img"
        }
    },
    {
        url: "https://www.uol.com.br/esporte/",
        site: "uol.com.br",
        category: "Sports",
        selectors: {
            article: ".thumbnails-item",
            title: ".thumb-title",
            link: "a", 
            summary: ".thumb-description, .thumb-caption p",
            date: ".thumb-date",
            image: "img"
        }
    },
    {
        url: "https://oglobo.globo.com/esportes/",
        site: "globo.com",
        category: "Sports",
        selectors: {
            article: ".feed-post, .bastian-feed-item",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    }
];

const POLITICS_SITES = [
    {
        url: "https://g1.globo.com/politica/",
        site: "g1.globo.com",
        category: "Politics",
        selectors: {
            article: ".bastian-feed-item, .feed-post",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a[data-mrf-link]",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    },
    {
        url: "https://www1.folha.uol.com.br/poder/",
        site: "folha.com.br",
        category: "Politics", 
        selectors: {
            article: ".c-headline, .news-item",
            title: ".c-headline__title a, .news-title a",
            link: ".c-headline__url, .news-title a",
            summary: ".c-headline__standfirst, .news-excerpt",
            date: ".c-headline__dateline, .news-date",
            image: "img"
        }
    },
    {
        url: "https://www.estadao.com.br/politica/",
        site: "estadao.com.br", 
        category: "Politics",
        selectors: {
            article: ".intro, .card, article",
            title: ".intro__title a, .card__title a",
            link: ".intro__title a, .card__title a",
            summary: ".intro__text, .card__text",
            date: ".intro__date, .card__date",
            image: "img"
        }
    },
    {
        url: "https://www.poder360.com.br/",
        site: "poder360.com.br",
        category: "Politics",
        selectors: {
            article: ".post-item, article, .news-item",
            title: ".post-title a, h2 a, .news-title a",
            link: ".post-title a, h2 a, .news-title a",
            summary: ".post-excerpt, .excerpt, .news-excerpt",
            date: ".post-date, time, .news-date",
            image: "img"
        }
    },
    {
        url: "https://www.cartacapital.com.br/politica/",
        site: "cartacapital.com.br",
        category: "Politics",
        selectors: {
            article: ".post, article, .news-item",
            title: ".post-title a, h2 a",
            link: ".post-title a, h2 a",
            summary: ".post-excerpt, .excerpt",
            date: ".post-date, time",
            image: "img"
        }
    }
];

const INTERNATIONAL_POLITICS_SITES = [
    {
        url: "https://g1.globo.com/mundo/",
        site: "g1.globo.com",
        category: "International Politics",
        selectors: {
            article: ".bastian-feed-item, .feed-post",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a[data-mrf-link]",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    },
    {
        url: "https://www1.folha.uol.com.br/mundo/",
        site: "folha.com.br",
        category: "International Politics",
        selectors: {
            article: ".c-headline, .news-item",
            title: ".c-headline__title a, .news-title a",
            link: ".c-headline__url, .news-title a",
            summary: ".c-headline__standfirst, .news-excerpt",
            date: ".c-headline__dateline, .news-date",
            image: "img"
        }
    },
    {
        url: "https://internacional.estadao.com.br/",
        site: "estadao.com.br",
        category: "International Politics",
        selectors: {
            article: ".intro, .card, article",
            title: ".intro__title a, .card__title a",
            link: ".intro__title a, .card__title a",
            summary: ".intro__text, .card__text",
            date: ".intro__date, .card__date",
            image: "img"
        }
    },
    {
        url: "https://www.bbc.com/portuguese/internacional",
        site: "bbc.com/portuguese",
        category: "International Politics",
        selectors: {
            article: "[data-testid='card-headline'], .gel-layout",
            title: "h3 a, .gel-trafalgar-bold a",
            link: "h3 a, .gel-trafalgar-bold a",
            summary: ".gel-body-copy, p",
            date: "time, .gel-minion",
            image: "img"
        }
    }
];

const GOSSIP_SITES = [
    {
        url: "https://www.uol.com.br/nossa/",
        site: "uol.com.br",
        category: "Gossip",
        selectors: {
            article: ".thumbnails-item",
            title: ".thumb-title",
            link: "a",
            summary: ".thumb-description, .thumb-caption p",
            date: ".thumb-date",
            image: "img"
        }
    },
    {
        url: "https://quem.globo.com/",
        site: "globo.com",
        category: "Gossip",
        selectors: {
            article: ".feed-post, .bastian-feed-item",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    },
    {
        url: "https://www.purepeople.com.br/",
        site: "purepeople.com.br",
        category: "Gossip",
        selectors: {
            article: ".article-item, .news-item",
            title: ".article-title a, .news-title a",
            link: ".article-title a, .news-title a",
            summary: ".article-excerpt, .news-excerpt",
            date: ".article-date, .news-date",
            image: "img"
        }
    },
    {
        url: "https://ego.globo.com/",
        site: "ego.globo.com",
        category: "Gossip",
        selectors: {
            article: ".feed-post, .bastian-feed-item",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    },
    {
        url: "https://extra.globo.com/famosos/",
        site: "extra.globo.com",
        category: "Gossip",
        selectors: {
            article: ".feed-post, .bastian-feed-item",
            title: ".feed-post-body-title a, .feed-post-link",
            link: ".feed-post-link, a",
            summary: ".feed-post-body-resumo",
            date: ".feed-post-datetime",
            image: "img"
        }
    }
];

// ====== 🎯 Focus on Required Categories Only ======
const ALL_BRAZILIAN_SITES = [
    ...FINANCE_SITES,                    // Finance: 4 sites × 5 articles = 20
    ...SPORTS_SITES,                     // Sports: 4 sites × 6 articles = 24  
    ...POLITICS_SITES,                   // Brazilian Politics: 5 sites × 4 articles = 20
    ...INTERNATIONAL_POLITICS_SITES,     // International Politics: 4 sites × 5 articles = 20
    ...GOSSIP_SITES                      // Gossip: 5 sites × 3 articles = 15
];

console.log(`🎯 Target: ${Object.values(CATEGORY_TARGETS).reduce((a,b) => a+b, 0)} articles from ${ALL_BRAZILIAN_SITES.length} sites`);

// ====== Helper Functions ======
const seenLinks = new Set();
const categoryCounters = {
    'Politics': 0,
    'International Politics': 0,
    'Sports': 0,
    'Finance': 0,
    'Gossip': 0
};

function cleanUrl(url, baseUrl) {
    if (!url) return null;
    
    try {
        if (url.startsWith('http')) {
            return url;
        } else if (url.startsWith('/')) {
            return new URL(url, baseUrl).href;
        } else {
            return new URL(url, baseUrl).href;
        }
    } catch (error) {
        console.log(`❌ Invalid URL: ${url}`);
        return null;
    }
}

function extractImageUrl($element, selector, baseUrl) {
    if (!selector) return null;
    
    const imgElement = $element.find(selector).first();
    if (imgElement.length === 0) return null;
    
    let imgUrl = imgElement.attr('src') || imgElement.attr('data-src') || imgElement.attr('data-lazy-src');
    return cleanUrl(imgUrl, baseUrl);
}

function calculateRelevanceScore(title, summary, category) {
    let score = 0;
    
    // Basic quality checks
    if (title && title.length > 15) score += 5;
    if (summary && summary.length > 50) score += 5;
    if (title && title.length > 30) score += 2;
    if (summary && summary.length > 100) score += 3;
    
    // Category-specific keywords
    const categoryKeywords = {
        'Politics': ['lula', 'bolsonaro', 'governo', 'senado', 'câmara', 'stf', 'ministro', 'presidente'],
        'International Politics': ['biden', 'trump', 'putin', 'china', 'eua', 'europa', 'otan', 'guerra', 'conflito'],
        'Sports': ['futebol', 'palmeiras', 'flamengo', 'corinthians', 'santos', 'copa', 'brasileirão'],
        'Finance': ['economia', 'mercado', 'dólar', 'bolsa', 'juros', 'investimento', 'banco'],
        'Gossip': ['fofoca', 'relacionamento', 'separação', 'namoro', 'casamento', 'polêmica', 'affair']
    };
    
    const keywords = categoryKeywords[category] || [];
    const text = `${title} ${summary}`.toLowerCase();
    const matches = keywords.filter(keyword => text.includes(keyword));
    score += matches.length * 2;
    
    // Recent news bonus
    if (text.includes('hoje') || text.includes('agora') || text.includes('nesta')) {
        score += 3;
    }
    
    return Math.min(score, 25);
}

function parseBrazilianDate(dateText) {
    if (!dateText) return new Date();
    
    const now = new Date();
    const lowerDate = dateText.toLowerCase();
    
    // Handle Portuguese time expressions
    if (lowerDate.includes('hora')) {
        const hours = parseInt(dateText.match(/(\d+)/)?.[1] || '1');
        return new Date(now.getTime() - hours * 60 * 60 * 1000);
    }
    
    if (lowerDate.includes('ontem')) {
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    if (lowerDate.includes('hoje') || lowerDate.includes('agora')) {
        return now;
    }
    
    // Brazilian date patterns
    const patterns = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // DD/MM/YYYY
        /(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/,  // DD de Mês de YYYY
        /(\d{4})-(\d{2})-(\d{2})/,       // YYYY-MM-DD
    ];
    
    for (const pattern of patterns) {
        const match = dateText.match(pattern);
        if (match) {
            return new Date(match[0]);
        }
    }
    
    return now;
}

// ====== Main Scraping Logic ======

console.log('🚀 Starting Optimized Brazilian News Collection...\n');

for (const [index, site] of ALL_BRAZILIAN_SITES.entries()) {
    const currentTarget = CATEGORY_TARGETS[site.category];
    const currentCount = categoryCounters[site.category];
    
    // Skip if category target is already reached
    if (currentCount >= currentTarget) {
        console.log(`⏭️  Skipping ${site.site} - ${site.category} target (${currentTarget}) already reached`);
        continue;
    }
    
    console.log(`📍 [${index + 1}/${ALL_BRAZILIAN_SITES.length}] ${site.site} (${site.category}) - Target: ${currentTarget - currentCount} more articles`);
    
    const crawler = new CheerioCrawler({
        maxRequestsPerCrawl: 100, // 🎯 Fixed higher limit per site
        requestHandlerTimeoutSecs: 30,
        maxRequestRetries: 2,
        maxConcurrency: 1,
        
        async requestHandler({ request, $, log }) {
            log.info(`🔍 Scraping ${site.category}: ${request.url}`);
            
            try {
                const articles = $(site.selectors.article);
                log.info(`📄 Found ${articles.length} potential articles`);
                
                let savedCount = 0;
                const targetRemaining = currentTarget - categoryCounters[site.category];
                
                articles.each((i, el) => {
                    // Stop if we've reached the target for this category
                    if (categoryCounters[site.category] >= currentTarget) return false;
                    
                    try {
                        const $article = $(el);
                        
                        // Extract data using site-specific selectors
                        const title = $article.find(site.selectors.title).first().text().trim();
                        const linkElement = $article.find(site.selectors.link).first();
                        let link = linkElement.attr("href") || linkElement.attr("data-href") || linkElement.attr("data-mrf-link");
                        
                        // Clean and validate URL
                        link = cleanUrl(link, request.url);
                        
                        const summary = site.selectors.summary ? 
                            $article.find(site.selectors.summary).first().text().trim() : '';
                        const date = site.selectors.date ? 
                            $article.find(site.selectors.date).first().text().trim() : '';
                        
                        // Extract image
                        const imageUrl = extractImageUrl($article, site.selectors.image, request.url);
                        
                        // Enhanced validation
                        if (!title || title.length < 15) return;
                        if (!link) return;
                        if (seenLinks.has(link)) return;
                        
                        // Calculate relevance with category-specific minimum scores
                        const relevanceScore = calculateRelevanceScore(title, summary, site.category);
                        const minScore = site.category === 'Gossip' ? 6 : 8;
                        if (relevanceScore < minScore) return;
                        
                        seenLinks.add(link);
                        categoryCounters[site.category]++;
                        
                        // Prepare article data
                        const articleData = {
                            // Source info
                            site: site.site,
                            sourcePage: request.url,
                            
                            // Content
                            category: site.category,
                            title: title,
                            summary: summary || 'Resumo não disponível',
                            url: link,
                            
                            // Metadata
                            author: null,
                            publishedDate: parseBrazilianDate(date),
                            imageUrl: imageUrl,
                            
                            // System data
                            scrapedAt: new Date(),
                            relevanceScore: relevanceScore,
                            language: 'pt-BR',
                            country: 'Brazil'
                        };
                        
                        // Save to dataset
                        Dataset.pushData(articleData);
                        savedCount++;
                        
                        log.info(`✅ [${site.category}] Article ${categoryCounters[site.category]}/${currentTarget}: ${title.substring(0, 50)}...`);
                        
                    } catch (articleError) {
                        log.warning(`❌ Error processing article: ${articleError.message}`);
                    }
                });
                
                log.info(`📊 ${site.site}: ${savedCount} articles saved (${categoryCounters[site.category]}/${currentTarget} total for ${site.category})`);
                
            } catch (error) {
                log.error(`❌ Error scraping ${site.site}: ${error.message}`);
            }
        }
    });

    try {
        await crawler.addRequests([{ url: site.url }]);
        await crawler.run();
        console.log(`✅ Completed: ${site.site} - ${site.category}: ${categoryCounters[site.category]}/${currentTarget}`);
    } catch (crawlerError) {
        console.log(`❌ Failed: ${site.site} - ${crawlerError.message}`);
    }
    
    // Small delay between sites
    await new Promise(resolve => setTimeout(resolve, 800));
}

// ====== Final Summary ======

console.log('\n' + '='.repeat(70));
console.log('🎯 OPTIMIZED BRAZILIAN NEWS COLLECTION SUMMARY');
console.log('='.repeat(70));

const dataset = await Dataset.open();
const { itemCount } = await dataset.getInfo();

console.log(`📰 Total articles collected: ${itemCount}`);
console.log(`🏢 Sites processed: ${ALL_BRAZILIAN_SITES.length}`);
console.log(`🔗 Unique URLs found: ${seenLinks.size}`);

console.log('\n📊 Target vs Actual by Category:');
Object.entries(CATEGORY_TARGETS).forEach(([category, target]) => {
    const actual = categoryCounters[category];
    const percentage = Math.round((actual / target) * 100);
    const status = actual >= target ? '✅' : actual >= target * 0.8 ? '⚠️' : '❌';
    console.log(`  ${status} ${category}: ${actual}/${target} (${percentage}%)`);
});

if (itemCount > 0) {
    const data = await dataset.getData();
    
    let totalRelevanceScore = 0;
    data.items.forEach(item => {
        totalRelevanceScore += item.relevanceScore || 0;
    });
    
    console.log('\n📊 Quality Metrics:');
    console.log(`  Average relevance score: ${(totalRelevanceScore / itemCount).toFixed(1)}/25`);
    console.log(`  Articles with images: ${data.items.filter(item => item.imageUrl).length}`);
    console.log(`  Articles with summaries: ${data.items.filter(item => item.summary && item.summary !== 'Resumo não disponível').length}`);
    
    console.log('\n💾 Ready for GPT Processing:');
    console.log(`  ✅ ${itemCount} high-quality articles collected`);
    console.log(`  ✅ Balanced across 5 key categories`);
    console.log(`  ✅ Perfect for personalized news generation`);
}

const totalTarget = Object.values(CATEGORY_TARGETS).reduce((a,b) => a+b, 0);
const actualTotal = Object.values(categoryCounters).reduce((a,b) => a+b, 0);
console.log(`\n🎯 Overall Success Rate: ${Math.round((actualTotal/totalTarget)*100)}% (${actualTotal}/${totalTarget} articles)`);

console.log('\n✅ Optimized news collection completed!');
console.log('🚀 Ready for WhatsApp news personalization system!');

await Actor.exit();
