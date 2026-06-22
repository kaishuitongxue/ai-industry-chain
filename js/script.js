(function() {
'use strict';
let _prefetchedNews = null;
(function prefetchNewsFromCache() {
try {
const cached = loadNewsCache();
if (cached && cached.length > 0) _prefetchedNews = cached;
} catch (e) { /* silent */ }
})();
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
function getLayerClass(layer) {
return layer === 'upstream' ? 'upstream-card' :
layer === 'midstream' ? 'midstream-card' : 'downstream-card';
}
function trendHTML(trend, desc) {
const icons = { up: '📈', flat: '➡️', down: '📉' };
return `<span class="card-trend trend-${trend}">${icons[trend]} ${desc}</span>`;
}
function trendIndicator(trend) {
const icons = { up: '🔥', flat: '➡️', down: '📉' };
return `<span class="trend-indicator ${trend}">${icons[trend]}</span>`;
}
const STOCK_CACHE = {};
const CACHE_TTL = 5 * 60 * 1000;
const CNY_USD_RATE = 7.25;
const INDEX_CONFIG = [
  { id: 'idx-shanghai', ticker: '000001.SS', name: '上证指数' },
  { id: 'idx-shenzhen', ticker: '399001.SZ', name: '深证成指' },
  { id: 'idx-chinext', ticker: '399006.SZ', name: '创业板指' },
  { id: 'idx-hstech', ticker: '%5EHSTECH', name: '恒生科技', isHKD: true, hkdRate: 0.93 },
  { id: 'idx-nasdaq', ticker: '%5EIXIC', name: '纳斯达克', isUSD: true },
];
const INDEX_CACHE_KEY = 'ai_index_cache';
function loadIndexCache() {
try {
const raw = localStorage.getItem(INDEX_CACHE_KEY);
if (!raw) return null;
const cache = JSON.parse(raw);
if (Date.now() - cache.ts < 2000) return cache.data;
} catch(e) {}
return null;
}
function saveIndexCache(data) {
try { localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
}
function renderIndexItem(idxInfo, price, change, changePct) {
  const el = $('#' + idxInfo.id);
  if (!el) return;
  let rate = 1;
  if (idxInfo.isUSD) rate = CNY_USD_RATE;
  if (idxInfo.isHKD) rate = (idxInfo.hkdRate || 0.93);
  const displayPrice = price * rate;
  const displayChange = change * rate;
const direction = change >= 0 ? 'up' : 'down';
const sign = change >= 0 ? '+' : '';
el.className = 'index-item ' + direction;
el.querySelector('.index-value').textContent = displayPrice.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
el.querySelector('.index-change').textContent = `${sign}${displayChange.toFixed(2)} (${sign}${changePct.toFixed(2)}%)`;
}
async function fetchSingleIndex(idxInfo) {
const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${idxInfo.ticker}?range=2d&interval=1d`;
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;
const tryFetch = async (url) => {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 800);
try {
const resp = await fetch(url, { signal: controller.signal });
clearTimeout(timeout);
if (!resp.ok) return null;
const data = await resp.json();
const result = data.chart?.result?.[0];
if (!result) return null;
const meta = result.meta || {};
const price = meta.regularMarketPrice;
if (price == null) return null;
const prevClose = meta.chartPreviousClose || meta.previousClose || price;
const change = price - prevClose;
const changePct = prevClose ? (change / prevClose * 100) : 0;
return { price, change, changePct };
} catch (e) {
clearTimeout(timeout);
return null;
}
};
const result = await Promise.race([tryFetch(yahooUrl), tryFetch(proxyUrl)]);
if (result) {
renderIndexItem(idxInfo, result.price, result.change, result.changePct);
return result;
} else {
const results = await Promise.allSettled([tryFetch(yahooUrl), tryFetch(proxyUrl)]);
for (const r of results) {
if (r.status === 'fulfilled' && r.value) {
renderIndexItem(idxInfo, r.value.price, r.value.change, r.value.changePct);
return r.value;
}
}
}
console.warn(`⚠️ 指数 ${idxInfo.name} 获取失败`);
return null;
}
async function fetchIndexData() {
const results = await Promise.allSettled(INDEX_CONFIG.map(fetchSingleIndex));
const cacheData = {};
INDEX_CONFIG.forEach((cfg, i) => {
const r = results[i];
if (r.status === 'fulfilled' && r.value) cacheData[cfg.id] = r.value;
});
saveIndexCache(cacheData);
}
function startIndexRefresh() {
const cached = loadIndexCache();
if (cached) {
INDEX_CONFIG.forEach(cfg => {
const d = cached[cfg.id];
if (d) renderIndexItem(cfg, d.price, d.change, d.changePct);
});
}
fetchIndexData();
setInterval(fetchIndexData, 3000); // 15秒实时更新
}
function getStockData(ticker) {
const cached = STOCK_CACHE[ticker]?.data;
if (cached) return cached;
const sim = stockSimData[ticker];
if (sim) {
STOCK_CACHE[ticker] = { data: sim, updatedAt: 0 };
return sim;
}
return null;
}
async function fetchStockPriceOnly(ticker) {
try {
const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(
`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=5d&interval=1d`
);
const resp = await fetch(proxyUrl);
if (!resp.ok) return null;
const data = await resp.json();
const result = data.chart?.result?.[0];
if (!result) return null;
const closes = (result.indicators?.quote?.[0]?.close || []).filter(c => c !== null);
if (closes.length < 2) return null;
const usdPrice = closes[closes.length - 1];
const prevPrice = closes[closes.length - 2];
const cnyPrice = usdPrice * CNY_USD_RATE;
return {
currentPrice: +cnyPrice.toFixed(2),
usdPrice: +usdPrice.toFixed(2),
change: +((usdPrice - prevPrice) * CNY_USD_RATE).toFixed(2),
changePercent: +((usdPrice - prevPrice) / prevPrice * 100).toFixed(2),
kline: null,
updatedAt: Date.now(),
priceOnly: true,
};
} catch (e) {
return null;
}
}
async function fetchStockFullKLine(ticker) {
try {
const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(
`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=3mo&interval=1d`
);
const resp = await fetch(proxyUrl);
if (!resp.ok) return null;
const data = await resp.json();
const result = data.chart?.result?.[0];
if (!result) return null;
const quotes = result.indicators?.quote?.[0];
if (!quotes) return null;
const closes = quotes.close?.filter(c => c !== null) || [];
const opens = quotes.open?.filter(o => o !== null) || [];
const highs = quotes.high?.filter(h => h !== null) || [];
const lows = quotes.low?.filter(l => l !== null) || [];
const volumes = quotes.volume?.filter(v => v !== null) || [];
const timestamps = result.timestamp || [];
if (closes.length < 2) return null;
const usdPrice = closes[closes.length - 1];
const prevPrice = closes[closes.length - 2];
const cnyPrice = usdPrice * CNY_USD_RATE;
const kline = [];
const len = Math.min(closes.length, timestamps.length);
const cRate = CNY_USD_RATE;
for (let i = 0; i < len; i++) {
kline.push({
date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
open: +((opens[i] || closes[i]) * cRate).toFixed(2),
high: +((highs[i] || closes[i]) * cRate).toFixed(2),
low: +((lows[i] || closes[i]) * cRate).toFixed(2),
close: +(closes[i] * cRate).toFixed(2),
volume: +(volumes[i] || 0).toFixed(0),
});
}
const fullData = {
currentPrice: +cnyPrice.toFixed(2),
usdPrice: +usdPrice.toFixed(2),
change: +((usdPrice - prevPrice) * CNY_USD_RATE).toFixed(2),
changePercent: +((usdPrice - prevPrice) / prevPrice * 100).toFixed(2),
kline,
updatedAt: Date.now(),
priceOnly: false,
};
STOCK_CACHE[ticker] = { data: fullData, updatedAt: Date.now() };
return fullData;
} catch (e) {
return null;
}
}
async function fetchYahooStock(ticker) {
return fetchStockPriceOnly(ticker);
}
async function refreshStockData(ticker, fullKLine = false) {
const cached = STOCK_CACHE[ticker];
if (cached && !cached.data.priceOnly && (Date.now() - cached.updatedAt < CACHE_TTL)) return cached.data;
if (cached && !fullKLine && (Date.now() - cached.updatedAt < CACHE_TTL)) return cached.data;
const data = fullKLine ? await fetchStockFullKLine(ticker) : await fetchYahooStock(ticker);
if (data) STOCK_CACHE[ticker] = { data, updatedAt: Date.now() };
return data;
}
const researchTickers = new Set();
async function refreshAllStocks() {
const allTickers = new Set();
industryData.forEach(item => {
item.companies.forEach(c => { if (c.ticker) allTickers.add(c.ticker); });
});
researchTickers.forEach(t => allTickers.add(t));
const tickerArr = [...allTickers];
console.log(`📈 快速获取 ${tickerArr.length} 只股票股价...`);
const startTime = Date.now();
await Promise.allSettled(tickerArr.map(t => refreshStockData(t, false)));
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`📈 股价已更新 (${elapsed}s)，K线按需加载`);
renderCards();
refreshResearchStockBadges();
refreshAllExpandedRankings();
setTimeout(async () => {
await Promise.allSettled(tickerArr.map(t => refreshStockData(t, true)));
console.log('📈 后台K线数据就绪');
}, 5000);
}
function renderStockBadge(company) {
if (!company.ticker) return '';
const sd = getStockData(company.ticker);
if (!sd || !sd.currentPrice) {
return `<span class="stock-badge loading" title="正在获取实时股价...">
<span class="ticker-symbol">${company.ticker}</span>
<span class="stock-price">⏳</span>
</span>`;
}
const direction = sd.change >= 0 ? 'up' : 'down';
const sign = sd.change >= 0 ? '+' : '';
return `
<span class="stock-badge ${direction}" onclick="event.stopPropagation();openKLine('${company.ticker}','${escapeHTML(company.name)}')" title="点击查看K线图 (¥人民币)">
<span class="ticker-symbol">${company.ticker}</span>
<span class="stock-price">¥${sd.currentPrice.toFixed(2)}</span>
<span class="stock-change">${sign}${sd.changePercent}%</span>
<span class="chart-icon">📊</span>
</span>
`;
}
function renderCapBadge(company) {
const label = company.capLabel;
if (!label) return '';
let cls = 'public';
if (label.includes('估值')) cls = 'private';
if (label.includes('非营利') || label.includes('未上市')) cls = 'nonprofit';
if (label.startsWith('市值')) cls = 'public';
return `<span class="cap-badge ${cls}">💰 ${label}</span>`;
}

// 生成公司Logo（首字母彩色圆 + favicon尝试）
function renderCompanyLogo(company) {
  var name = company.name || '';
  var initial = name.replace(/[\(（].*[\)）]/g, '').trim().charAt(0).toUpperCase() || '?';
  var ticker = company.ticker || '';
  // 为不同公司生成稳定的颜色
  var colors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#f97316','#6366f1','#14b8a6'];
  var hash = 0;
  for (var i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  var color = colors[Math.abs(hash) % colors.length];
  var domain = '';
  if (ticker) {
    if (ticker.endsWith('.SS') || ticker.endsWith('.SZ') || ticker.endsWith('.BJ')) {
      domain = ''; // A股暂不用favicon
    } else if (ticker === 'NVDA') domain = 'nvidia.com';
    else if (ticker === 'AMD') domain = 'amd.com';
    else if (ticker === 'GOOGL') domain = 'google.com';
    else if (ticker === 'AMZN') domain = 'amazon.com';
    else if (ticker === 'MSFT') domain = 'microsoft.com';
    else if (ticker === 'TSLA') domain = 'tesla.com';
    else if (ticker === 'TSM') domain = 'tsmc.com';
    else if (ticker === 'INTC') domain = 'intel.com';
    else if (ticker === 'ASML') domain = 'asml.com';
    else if (ticker === 'BABA') domain = 'alibaba.com';
    else if (ticker === 'BIDU') domain = 'baidu.com';
    else if (ticker === 'XPEV') domain = 'xiaopeng.com';
    else if (ticker === 'AAPL') domain = 'apple.com';
    else if (ticker === 'META') domain = 'meta.com';
    else if (ticker === 'EQIX') domain = 'equinix.com';
    else if (ticker === 'MBLY') domain = 'mobileye.com';
  }
  if (domain) {
    return '<span class="company-logo" style="background:' + color + '"><img src="https://www.google.com/s2/favicons?domain=' + domain + '&sz=32" onerror="this.style.display=\'none\';this.parentElement.textContent=\'' + initial + '\'" style="width:22px;height:22px;border-radius:4px" alt=""></span>';
  }
  return '<span class="company-logo" style="background:' + color + '">' + initial + '</span>';
}

function escapeHTML(str) {
const div = document.createElement('div');
div.textContent = str;
return div.innerHTML;
}
function getScoreDelta(item) {
if (!item.newsFactors || item.newsFactors.length === 0) return 0;
return +item.newsFactors.reduce((sum, nf) => sum + nf.impact, 0).toFixed(1);
}
function renderScoreDelta(item) {
const delta = getScoreDelta(item);
if (delta === 0) return '';
const dir = delta > 0 ? 'up' : 'down';
const sign = delta > 0 ? '+' : '';
return `<span class="score-delta ${dir}">${sign}${delta.toFixed(1)}</span>`;
}
const BASE_SCORES = {};
(function captureBaseScores() {
industryData.forEach(item => {
BASE_SCORES[item.id] = {
scarcity: item.scarcity,
value: item.value,
barrier: item.barrier,
composite: item.composite,
};
});
})();
function getIndividualDelta(item, field) {
const base = BASE_SCORES[item.id]?.[field];
if (base == null) return 0;
return +(item[field] - base).toFixed(1);
}
function renderIndividualDelta(item, field) {
const delta = getIndividualDelta(item, field);
if (delta === 0) return '';
const dir = delta > 0 ? 'up' : 'down';
const sign = delta > 0 ? '+' : '';
return `<span class="score-delta ${dir}">${sign}${delta.toFixed(1)}</span>`;
}
function renderOverview() {
const layers = { upstream: [], midstream: [], downstream: [] };
industryData.forEach(item => layers[item.layer].push(item));
Object.entries(layers).forEach(([layer, items]) => {
const container = $(`#${layer}Tags`);
if (!container) return;
container.innerHTML = items.map(item => {
const compColor = item.composite >= 8 ? 'var(--stock-up)' : item.composite >= 6 ? 'var(--accent-blue)' : 'var(--accent-orange)';
return `
<div class="track-chip" onclick="switchPage('${layer}');setTimeout(()=>document.getElementById('${item.id}')?.scrollIntoView({behavior:'smooth',block:'center'}),300)"
title="${item.summary.slice(0, 80)}...">
<span class="track-chip-name">${item.name}</span>
<span class="track-chip-score" style="color:${compColor}">${item.composite.toFixed(1)}</span>
<span class="track-chip-trend">${item.trend === 'up' ? '🔥' : item.trend === 'down' ? '📉' : '➡️'}</span>
</div>`;
}).join('');
});
}
function renderDashboard() {
const sorted = [...industryData];
const topValue = sorted.slice().sort((a, b) => b.value - a.value).slice(0, 3);
const topScarcity = sorted.slice().sort((a, b) => b.scarcity - a.scarcity).slice(0, 3);
const topBarrier = sorted.slice().sort((a, b) => b.barrier - a.barrier).slice(0, 3);
const topTrending = sorted.filter(i => i.trend === 'up').slice().sort((a, b) => {
const aI = a.newsFactors.reduce((s, n) => s + Math.abs(n.impact), 0);
const bI = b.newsFactors.reduce((s, n) => s + Math.abs(n.impact), 0);
return bI - aI;
}).slice(0, 3);
function topList(items, attr, showScore) {
return items.map((i, idx) => {
const delta = getIndividualDelta(i, attr);
const deltaHtml = showScore && delta !== 0
? `<span class="score-delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>`
: '';
const scoreHtml = showScore
? `<span class="dash-score ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${i[attr]?.toFixed(1)}${deltaHtml}</span>`
: '';
return `
<div class="dash-item" onclick="openSectorModal('${i.id}')" style="cursor:pointer">
<span class="dash-rank">#${idx + 1}</span>
<span class="dash-name">${i.name}</span>
${scoreHtml}
</div>`;
}).join('');
}
function trendingList(items) {
return items.map((i, idx) => `
<div class="dash-item" onclick="openSectorModal('${i.id}')" style="cursor:pointer">
<span class="dash-rank">#${idx + 1}</span>
<span class="dash-name">${i.name}</span>
<span style="color:var(--stock-up);font-size:12px">${i.trendDesc}</span>
</div>
`).join('');
}
$('#topValue').innerHTML = topList(topValue, 'value', true);
$('#topScarcity').innerHTML = topList(topScarcity, 'scarcity', true);
$('#topBarrier').innerHTML = topList(topBarrier, 'barrier', true);
$('#topTrending').innerHTML = trendingList(topTrending);
}
function renderCards() {
const containers = {
upstream: $('#upstreamCards'),
midstream: $('#midstreamCards'),
downstream: $('#downstreamCards')
};
const layers = { upstream: [], midstream: [], downstream: [] };
industryData.forEach(item => layers[item.layer].push(item));
Object.entries(layers).forEach(([layer, items]) => {
containers[layer].innerHTML = items.map(item => {
const sC = item.scarcity >= 8 ? 'var(--accent-red)' :
item.scarcity >= 6 ? 'var(--accent-orange)' : 'var(--accent-green)';
const vC = item.value >= 8 ? 'var(--accent-purple)' :
item.value >= 6 ? 'var(--accent-blue)' : 'var(--text-muted)';
const bC = item.barrier >= 8 ? 'var(--accent-cyan)' :
item.barrier >= 6 ? 'var(--accent-blue)' : 'var(--text-muted)';
const newsHTML = item.newsFactors.length > 0 ? `
<div class="card-news">
${item.newsFactors.map(nf => {
const cls = nf.impact > 0 ? 'positive' : 'negative';
const sign = nf.impact > 0 ? '+' : '';
return `<span class="news-tag ${cls}">${nf.date} ${nf.event} (${sign}${nf.impact.toFixed(1)})</span>`;
}).join('')}
</div>
` : '';
const compC = item.composite >= 8 ? 'var(--accent-green)' :
item.composite >= 6 ? 'var(--accent-blue)' : 'var(--accent-orange)';
const companyRows = item.companies.map(c => {
const capBadge = renderCapBadge(c);
const stockBadge = renderStockBadge(c);
return `
<div class="company-row">
<input type="checkbox" class="company-compare-check" title="加入对比" onclick="event.stopPropagation();toggleCompare('${c.name.replace(/'/g, "\\'")}','${(c.ticker||'').replace(/'/g, "\\'")}','${item.name.replace(/'/g, "\\'")}','${(c.capLabel||'').replace(/'/g, "\\'")}')">
<span class="company-name-col">
<span class="company-country">${c.country}</span> ${c.name}
${c.exchange ? '<span class="company-exchange-tag">' + c.exchange + '</span>' : ''}
</span>
<span class="company-note-mini">${c.note}</span>
${capBadge}
${stockBadge}
</div>`;
}).join('');
return `
<div class="industry-card ${getLayerClass(item.layer)}" id="${item.id}" oncontextmenu="return false">
<div class="card-header">
<div class="card-title-area">
<div class="card-name">${item.name}</div>
<div class="card-layer">${item.layerName}</div>
</div>
${trendHTML(item.trend, item.trendDesc)}
</div>
<div class="card-scores">
<div class="score-row">
<span class="score-label">🔥 紧缺</span>
<div class="score-bar-wrap">
<div class="score-bar" style="width:${item.scarcity*10}%;background:${sC}"></div>
</div>
<span class="score-value" style="color:${sC}">${(item.scarcity||0).toFixed(1)}${renderIndividualDelta(item, 'scarcity')}</span>
</div>
<div class="score-row">
<span class="score-label">💎 价值</span>
<div class="score-bar-wrap">
<div class="score-bar" style="width:${item.value*10}%;background:${vC}"></div>
</div>
<span class="score-value" style="color:${vC}">${(item.value||0).toFixed(1)}${renderIndividualDelta(item, 'value')}</span>
</div>
<div class="score-row">
<span class="score-label">🏰 壁垒</span>
<div class="score-bar-wrap">
<div class="score-bar" style="width:${item.barrier*10}%;background:${bC}"></div>
</div>
<span class="score-value" style="color:${bC}">${(item.barrier||0).toFixed(1)}${renderIndividualDelta(item, 'barrier')}</span>
</div>
</div>
<div class="card-composite">
<span class="composite-label">📊 综合评分</span>
<span class="composite-score" style="color:${compC}">${(item.composite||0).toFixed(1)}${renderIndividualDelta(item, 'composite')}</span>
</div>
<div class="card-summary">${item.summary}</div>
${newsHTML}
<div class="card-companies">
<div class="companies-title">🏢 代表公司 <span style="font-weight:400;color:var(--text-muted);font-size:11px">| 点击 📊 查看K线</span></div>
<div class="company-list">${companyRows}</div>
</div>
</div>`;
}).join('');
});
}
function renderRanking(sortKey = 'composite', ascending = false) {
const sorted = [...industryData].sort((a, b) => {
return ascending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
});
const tbody = $('#rankingBody');
tbody.innerHTML = sorted.map((item, idx) => {
const rankClass = idx < 3 ? ' top' : '';
const sC = item.scarcity >= 8 ? 'var(--accent-red)' :
item.scarcity >= 6 ? 'var(--accent-orange)' : 'var(--accent-green)';
const sectorId = item.id;
return `
<tr class="ranking-sector-row" data-sector="${sectorId}" onclick="toggleRankingExpand('${sectorId}')" title="点击展开查看头部玩家">
<td><span class="rank-num${rankClass}">${idx + 1}</span></td>
<td class="rank-name">
<span class="rank-expand-icon" id="expand-icon-${sectorId}">▶</span>
${item.name}
</td>
<td class="rank-layer">${item.layerName}</td>
<td style="color:${sC};font-weight:600">${(item.scarcity||0).toFixed(1)}${renderIndividualDelta(item, 'scarcity')}</td>
<td style="color:var(--accent-purple);font-weight:600">${(item.value||0).toFixed(1)}${renderIndividualDelta(item, 'value')}</td>
<td style="color:var(--accent-cyan);font-weight:600">${(item.barrier||0).toFixed(1)}${renderIndividualDelta(item, 'barrier')}</td>
<td style="color:var(--accent-blue);font-weight:700">${(item.composite||0).toFixed(1)}${renderIndividualDelta(item, 'composite')}</td>
<td>${trendIndicator(item.trend)} ${item.trendDesc}</td>
</tr>
<tr class="ranking-expand-row" id="expand-${sectorId}" style="display:none">
<td colspan="8">
<div class="ranking-companies-panel">
<div class="ranking-companies-header">
<span>🏢 ${item.name} · 头部玩家</span>
<span class="ranking-companies-count">${item.companies.length} 家公司 | 点击 📊 查看K线</span>
</div>
<div class="ranking-companies-grid" id="ranking-grid-${sectorId}">
${item.companies.slice(0, 10).map((c, ci) => {
const capBadge = renderCapBadge(c);
const stockBadge = renderStockBadge(c);
const logo = renderCompanyLogo(c);
return `
<div class="ranking-company-card">
<div class="ranking-company-left">
<span class="ranking-company-rank-num">${ci + 1}</span>
${logo}
<span class="ranking-company-name">${escapeHTML(c.name)}</span>
${c.exchange ? '<span class="ranking-company-exchange">' + c.exchange + '</span>' : ''}
<span class="ranking-company-note">${c.note}</span>
</div>
<div class="ranking-company-right">
${capBadge}
${stockBadge}
</div>
</div>`;
}).join('')}
${item.companies.length > 10 ? '<div class="ranking-company-card" style="opacity:0.5;justify-content:center;font-size:12px;color:var(--text-muted)">... 还有 ' + (item.companies.length - 10) + ' 家</div>' : ''}
</div>
</div>
</div>
</td>
</tr>
`;
}).join('');
expandedSectors.forEach(sectorId => {
const row = document.getElementById('expand-' + sectorId);
const icon = document.getElementById('expand-icon-' + sectorId);
if (row) row.style.display = '';
if (icon) icon.textContent = '▼';
setTimeout(() => refreshRankingCompanyBadges(sectorId), 500);
});
$$('.sortable').forEach(th => {
th.classList.remove('sorted');
if (th.dataset.sort === sortKey) {
th.classList.add('sorted');
th.textContent = th.textContent.replace(/ [🔽🔼]/, '') + (ascending ? ' 🔼' : ' 🔽');
}
});
}
const expandedSectors = new Set();
window.toggleRankingExpand = function(sectorId) {
const row = document.getElementById('expand-' + sectorId);
const icon = document.getElementById('expand-icon-' + sectorId);
if (!row) return;
const isVisible = row.style.display !== 'none';
if (isVisible) {
row.style.display = 'none';
if (icon) icon.textContent = '▶';
expandedSectors.delete(sectorId);
} else {
row.style.display = '';
if (icon) icon.textContent = '▼';
expandedSectors.add(sectorId);
const sector = industryData.find(s => s.id === sectorId);
if (sector) {
const tickers = sector.companies.filter(c => c.ticker).map(c => c.ticker);
tickers.forEach(t => refreshStockData(t, false));
setTimeout(() => refreshRankingCompanyBadges(sectorId), 800);
}
}
};
function refreshRankingCompanyBadges(sectorId) {
const grid = document.getElementById('ranking-grid-' + sectorId);
if (!grid) return;
const sector = industryData.find(s => s.id === sectorId);
if (!sector) return;
grid.innerHTML = sector.companies.slice(0, 10).map((c, ci) => {
const capBadge = renderCapBadge(c);
const stockBadge = renderStockBadge(c);
const logo = renderCompanyLogo(c);
return `
<div class="ranking-company-card">
<div class="ranking-company-left">
<span class="ranking-company-rank-num">${ci + 1}</span>
${logo}
<span class="ranking-company-name">${escapeHTML(c.name)}</span>
${c.exchange ? '<span class="ranking-company-exchange">' + c.exchange + '</span>' : ''}
<span class="ranking-company-note">${c.note}</span>
</div>
<div class="ranking-company-right">
${capBadge}
${stockBadge}
</div>
</div>`;
}).join('');
if (sector.companies.length > 10) {
  grid.innerHTML += '<div class="ranking-company-card" style="opacity:0.5;justify-content:center;font-size:12px;color:var(--text-muted)">... 还有 ' + (sector.companies.length - 10) + ' 家</div>';
}
}
function refreshAllExpandedRankings() {
document.querySelectorAll('.ranking-expand-row').forEach(row => {
if (row.style.display === 'none') return;
const sectorId = row.id.replace('expand-', '');
refreshRankingCompanyBadges(sectorId);
});
}
async function openKLine(ticker, companyName) {
let sd = getStockData(ticker);
if (!sd || sd.priceOnly || !sd.kline) {
showToast('📊 正在加载K线数据...');
sd = await refreshStockData(ticker, true);
}
if (!sd || !sd.kline) {
showToast('⚠️ K线数据暂不可用');
return;
}
const existing = $('.kline-overlay');
if (existing) existing.remove();
const kline = sd.kline;
const latest = kline[kline.length - 1];
const direction = sd.change >= 0 ? 'up' : 'down';
const sign = sd.change >= 0 ? '+' : '';
const periodHigh = Math.max(...kline.map(k => k.high)).toFixed(2);
const periodLow = Math.min(...kline.map(k => k.low)).toFixed(2);
const avgVol = Math.floor(kline.reduce((s, k) => s + k.volume, 0) / kline.length);
const overlay = document.createElement('div');
overlay.className = 'kline-overlay';
overlay.innerHTML = `
<div class="kline-modal">
<div class="kline-header">
<div class="kline-title-area">
<span class="kline-company-name">${escapeHTML(companyName)}</span>
<span class="kline-ticker">${ticker}</span>
</div>
<div class="kline-price-area">
<div class="kline-current-price">¥${latest.close.toFixed(2)}</div>
<div class="kline-change-area ${direction}">
${sign}¥${Math.abs(sd.change).toFixed(2)} (${sign}${sd.changePercent.toFixed(2)}%)
</div>
</div>
<button class="kline-close-btn" onclick="this.closest('.kline-overlay').remove()">✕</button>
</div>
<div class="kline-periods">
<button class="kline-period active" data-days="60">60日</button>
<button class="kline-period" data-days="30">30日</button>
<button class="kline-period" data-days="15">15日</button>
</div>
<div class="kline-stats">
<div class="kline-stat">币种 <span>¥ 人民币</span></div>
<div class="kline-stat">最高 <span>¥${periodHigh}</span></div>
<div class="kline-stat">最低 <span>¥${periodLow}</span></div>
<div class="kline-stat">开盘 <span>¥${kline[0].open.toFixed(2)}</span></div>
<div class="kline-stat">日均成交 <span>${(avgVol/1e6).toFixed(1)}M 股</span></div>
</div>
<div class="kline-chart-wrap">
<canvas id="klineCanvas" width="750" height="380"></canvas>
</div>
</div>
`;
document.body.appendChild(overlay);
overlay.addEventListener('click', (e) => {
if (e.target === overlay) overlay.remove();
});
const escHandler = (e) => {
if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); }
};
document.addEventListener('keydown', escHandler);
drawKLineChart(kline, kline.length);
overlay.querySelectorAll('.kline-period').forEach(btn => {
btn.addEventListener('click', () => {
overlay.querySelectorAll('.kline-period').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
const days = parseInt(btn.dataset.days);
const slice = kline.slice(-days);
drawKLineChart(kline, days);
const pH = Math.max(...slice.map(k => k.high)).toFixed(2);
const pL = Math.min(...slice.map(k => k.low)).toFixed(2);
const aV = Math.floor(slice.reduce((s, k) => s + k.volume, 0) / slice.length);
overlay.querySelector('.kline-stats').innerHTML = `
<div class="kline-stat">最高 <span>¥${pH}</span></div>
<div class="kline-stat">最低 <span>¥${pL}</span></div>
<div class="kline-stat">开盘 <span>¥${slice[0].open.toFixed(2)}</span></div>
<div class="kline-stat">日均成交 <span>${(aV/1e6).toFixed(1)}M 股</span></div>
`;
});
});
}
window.openKLine = openKLine;
function drawKLineChart(fullKline, days) {
const canvas = $('#klineCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const data = fullKline.slice(-days);
const padding = { top: 15, right: 40, bottom: 50, left: 60 };
const chartW = W - padding.left - padding.right;
const chartH = H - padding.top - padding.bottom - 70;
const volH = 60;
const volTop = padding.top + chartH + 10;
ctx.clearRect(0, 0, W, H);
const allPrices = data.flatMap(d => [d.high, d.low]);
const priceMin = Math.min(...allPrices);
const priceMax = Math.max(...allPrices);
const priceRange = priceMax - priceMin || 1;
const pricePad = priceRange * 0.08;
const yMin = priceMin - pricePad;
const yMax = priceMax + pricePad;
const maxVol = Math.max(...data.map(d => d.volume));
function priceToY(p) {
return padding.top + chartH - ((p - yMin) / (yMax - yMin)) * chartH;
}
function volToY(v) {
return volTop + volH - (v / maxVol) * volH;
}
ctx.strokeStyle = 'rgba(42,48,64,0.4)';
ctx.lineWidth = 0.5;
const gridLines = 5;
for (let i = 0; i <= gridLines; i++) {
const y = padding.top + (chartH / gridLines) * i;
ctx.beginPath();
ctx.setLineDash([4, 6]);
ctx.moveTo(padding.left, y);
ctx.lineTo(W - padding.right, y);
ctx.stroke();
ctx.setLineDash([]);
const price = yMax - ((yMax - yMin) / gridLines) * i;
ctx.fillStyle = '#6b7280';
ctx.font = '10px -apple-system, sans-serif';
ctx.textAlign = 'right';
ctx.fillText('¥' + price.toFixed(2), padding.left - 6, y + 3);
}
const candleSpacing = chartW / data.length;
const candleWidth = Math.max(2, candleSpacing * 0.65);
const gap = candleSpacing - candleWidth;
data.forEach((d, i) => {
const x = padding.left + i * candleSpacing + gap / 2;
const volTopY = volToY(d.volume);
const color = d.close >= d.open ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.35)';  /* 红涨绿跌 */
ctx.fillStyle = color;
ctx.fillRect(x, volTopY, candleWidth, volTop + volH - volTopY);
});
ctx.strokeStyle = 'rgba(42,48,64,0.6)';
ctx.lineWidth = 0.5;
ctx.beginPath();
ctx.moveTo(padding.left, volTop);
ctx.lineTo(W - padding.right, volTop);
ctx.stroke();
data.forEach((d, i) => {
const x = padding.left + i * candleSpacing + gap / 2;
const isUp = d.close >= d.open;
const color = isUp ? '#ef4444' : '#22c55e';  /* 红涨绿跌 */
ctx.strokeStyle = color;
ctx.lineWidth = 1;
ctx.beginPath();
const highY = priceToY(d.high);
const lowY = priceToY(d.low);
ctx.moveTo(x + candleWidth / 2, highY);
ctx.lineTo(x + candleWidth / 2, lowY);
ctx.stroke();
const openY = priceToY(d.open);
const closeY = priceToY(d.close);
const bodyH = Math.max(1, Math.abs(closeY - openY));
ctx.fillStyle = isUp ? '#ef4444' : '#22c55e';  /* 红涨绿跌 */
ctx.fillRect(x, Math.min(openY, closeY), candleWidth, bodyH);
});
ctx.strokeStyle = '#f59e0b';
ctx.lineWidth = 1.5;
ctx.setLineDash([]);
ctx.beginPath();
let maStarted = false;
for (let i = 4; i < data.length; i++) {
const ma5 = data.slice(i - 4, i + 1).reduce((s, d) => s + d.close, 0) / 5;
const x = padding.left + i * candleSpacing + candleWidth / 2;
const y = priceToY(ma5);
if (!maStarted) { ctx.moveTo(x, y); maStarted = true; }
else { ctx.lineTo(x, y); }
}
ctx.stroke();
ctx.fillStyle = '#f59e0b';
ctx.font = '10px -apple-system, sans-serif';
ctx.textAlign = 'left';
ctx.fillText('── MA5', padding.left + 4, padding.top + 10);
ctx.fillStyle = '#6b7280';
ctx.font = '9px -apple-system, sans-serif';
ctx.textAlign = 'center';
const labelStep = Math.max(1, Math.floor(data.length / 6));
for (let i = 0; i < data.length; i += labelStep) {
const x = padding.left + i * candleSpacing + candleWidth / 2;
const dateStr = data[i].date.slice(5);
ctx.fillText(dateStr, x, volTop + volH + 16);
}
ctx.fillStyle = '#6b7280';
ctx.font = '9px -apple-system, sans-serif';
ctx.textAlign = 'right';
ctx.fillText('Vol', padding.left - 6, volTop + 10);
ctx.fillText((maxVol / 1e6).toFixed(0) + 'M', padding.left - 6, volTop + volH - 2);
}
const RSS_SOURCES = [
  // 国内AI科技媒体（直接RSS）
  { url: 'https://www.qbitai.com/feed', label: '量子位' },
  { url: 'https://36kr.com/feed', label: '36氪' },
  { url: 'https://sspai.com/feed', label: '少数派' },
  { url: 'https://www.ithome.com/rss/', label: 'IT之家' },
  { url: 'https://www.pingwest.com/feed', label: '品玩' },
  { url: 'https://www.geekpark.net/feed', label: '极客公园' },
  { url: 'https://www.jiqizhixin.com/rss', label: '机器之心' },
  // Google News 中文（去掉24h限制，扩大时间范围）
  { url: 'https://news.google.com/rss/search?q=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD+AI+%E5%A4%A7%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google 综合AI' },
  { url: 'https://news.google.com/rss/search?q=AI+%E8%8A%AF%E7%89%87+%E6%99%BA%E8%83%BD%E9%A9%BE%E9%A9%B6+%E6%9C%BA%E5%99%A8%E4%BA%BA&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google AI硬件' },
  { url: 'https://news.google.com/rss/search?q=OpenAI+ChatGPT+Claude+Gemini+AI%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google 大模型' },
  { url: 'https://news.google.com/rss/search?q=AI%E5%8C%BB%E7%96%97+AI%E9%87%91%E8%9E%8D+AI%E6%95%99%E8%82%B2+AIGC&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google AI应用' },
  { url: 'https://news.google.com/rss/search?q=NVIDIA+%E8%8B%B1%E4%BC%9F%E8%BE%BE+TSMC+%E5%8F%B0%E7%A7%AF%E7%94%B5+AI&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google AI芯片' },
  { url: 'https://news.google.com/rss/search?q=%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA+%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD+Figure+Optimus&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google 机器人' },
  { url: 'https://news.google.com/rss/search?q=AI+agent+%E6%99%BA%E8%83%BD%E4%BD%93+Copilot+AI%E5%BA%94%E7%94%A8&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google AI Agent' },
  { url: 'https://news.google.com/rss/search?q=%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6+Waymo+%E8%90%9D%E5%8D%9C%E5%BF%AB%E8%B7%91+%E6%99%BA%E9%A9%BE&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', label: 'Google 自动驾驶' },
];

// ============================================
// 新闻抓取基础设施
// ============================================
const FETCHED_NEWS_SET = new Set();
const RENDERED_NEWS_TITLES = new Set();
const NEWS_CACHE_KEY = 'ai_news_cache_v3';

function loadNewsCache() {
  try {
    const raw = sessionStorage.getItem(NEWS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveNewsCache(news) {
  try {
    sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(news));
  } catch (e) { /* quota exceeded */ }
}

// RSS抓取（通过rss2json API）
async function fetchRSSFeed(source) {
  try {
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(source.url);
    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      if (resp.status === 429) { await new Promise(r => setTimeout(r, 2000)); }
      throw new Error('HTTP ' + resp.status);
    }
    const data = await resp.json();
    if (data.status !== 'ok') throw new Error(data.message || 'API error');
    return (data.items || []).map(function(item) {
      return {
        title: (item.title || '').replace(/<[^>]*>/g, '').trim(),
        date: item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        source: source.label,
        link: item.link || '',
      };
    });
  } catch (e) {
    console.warn('⚠️ 新闻源获取失败 [' + source.label + ']:', e.message);
    return [];
  }
}

// 汇总所有RSS源
async function fetchAllRealNews() {
  console.log('📡 正在从 ' + RSS_SOURCES.length + ' 个信息源抓取AI新闻...');
  const results = await Promise.allSettled(RSS_SOURCES.map(fetchRSSFeed));
  const allNews = results.filter(function(r) { return r.status === 'fulfilled'; }).flatMap(function(r) { return r.value; });

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const processed = [];

  for (var i = 0; i < allNews.length; i++) {
    var news = allNews[i];
    if (!news.title || FETCHED_NEWS_SET.has(news.title)) continue;
    var newsDate = news.date;
    if (newsDate < sevenDaysAgo) continue;
    FETCHED_NEWS_SET.add(news.title);
    var sectorIds = mapNewsToSectors(news.title);
    if (!sectorIds) continue;
    var sentiment = analyzeSentiment(news.title);
    var companies = matchCompaniesInTitle(news.title, sectorIds);
    processed.push({ title: news.title, source: news.source, date: news.date, link: news.link, sectorIds: sectorIds, sentiment: sentiment, companies: companies });
  }

  processed.sort(function(a, b) { return b.date.localeCompare(a.date); });
  var top = processed.slice(0, 100);
  console.log('✅ 近7天AI新闻: ' + top.length + ' 条');
  return top;
}

// SECTOR_LAYER_MAP（层级映射）

const SECTOR_KEYWORDS = {
  'ai-chip-design': ['芯片', 'GPU', 'NVIDIA', '英伟达', 'AMD', 'NPU', 'ASIC', 'TPU', 'HBM', 'Blackwell', 'B300', 'B200', 'H200', 'H100', '昇腾', '寒武纪', '海光', '训练芯片', '推理芯片', 'AI处理器'],
  'chip-manufacturing': ['台积电', 'TSMC', '三星', '代工', '制程', '光刻', 'foundry', '3nm', '2nm', 'EUV', '先进封装', '英特尔', 'Intel', '晶圆', '中芯', 'SMIC', '光刻机', 'CoWoS'],
  'computing-infra': ['数据中心', '服务器', '云计算', '算力', 'data center', '液冷', '光模块', 'cloud', '基础设施', 'HPC', '智算', '超算', '算力中心', '云服务', '存储'],
  'llm': ['大模型', 'GPT', 'Claude', 'Gemini', 'LLaMA', 'Qwen', 'DeepSeek', 'ChatGPT', 'OpenAI', '大语言模型', '通义', '文心', '豆包', '混元', '星火', '百川', 'LLM', '基座模型'],
  'multimodal': ['多模态', '视觉', '文生图', '文生视频', 'Sora', 'Stable Diffusion', 'Midjourney', '视频生成', '语音合成', 'Runway', 'Pika', '可灵', 'DALL-E'],
  'ai-framework': ['PyTorch', 'TensorFlow', 'JAX', 'Hugging Face', 'LangChain', '开发框架', 'LlamaIndex', 'vLLM', 'Ollama', '模型训练', 'DeepSpeed'],
  'ai-agent': ['Agent', '智能体', 'Copilot', 'function calling', '工具调用', '自主', '多智能体', '协作', '编排', 'Bot', '自动化'],
  'autonomous-driving': ['自动驾驶', '智能驾驶', 'Waymo', 'Robotaxi', '无人', '智驾', 'FSD', '萝卜快跑', '激光雷达', '感知'],
  'embodied-robot': ['机器人', '人形', '具身智能', 'Optimus', 'Figure', '宇树', '傅利叶', '达闼', '机械臂', '灵巧手'],
  'ai-medical': ['AI医疗', 'AI制药', '影像', '诊断', '药物', '医疗AI', '蛋白质', 'AlphaFold', '病理', '临床'],
  'ai-finance': ['AI金融', '量化', '风控', '智能投顾', '反欺诈', 'fintech', '金融AI', '信贷'],
  'ai-security': ['AI安全', '安全', '对齐', '对齐税', '红队', '幻觉', '越狱', '隐私', '监管', '合规'],
};

function mapNewsToSectors(title) {
  const matched = [];
  const titleLower = title.toLowerCase();
  for (const [sectorId, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some(kw => titleLower.includes(kw.toLowerCase()))) {
      matched.push(sectorId);
    }
  }
  return matched.length > 0 ? matched : null;
}

const SECTOR_LAYER_MAP = {};
industryData.forEach(function(item) { SECTOR_LAYER_MAP[item.id] = item.layer; });

function getSectorLayer(sectorId) {
  return SECTOR_LAYER_MAP[sectorId] || null;
}

// 公司关键词索引
const COMPANY_INDEX = [];
let _companyIndexBuilt = false;

function ensureCompanyIndex() {
  if (_companyIndexBuilt) return;
  _companyIndexBuilt = true;
  const seen = new Set();
  industryData.forEach(function(item) {
    item.companies.forEach(function(c) {
      var key = c.name + (c.ticker || '');
      if (seen.has(key)) return;
      seen.add(key);
      COMPANY_INDEX.push({
        keywords: extractCompanyKeywords(c.name),
        name: c.name,
        ticker: c.ticker || '',
        country: c.country || '',
        sectorId: item.id,
      });
    });
  });
  COMPANY_INDEX.sort(function(a, b) { return b.keywords[0].length - a.keywords[0].length; });
}

// 情感分析
const SENTIMENT_KW = [
  { words: ['突破', '发布', '超越', '领先', '新高', '上市', '获投', '融资', '利好', '增长', '合作', '落地', '开源', '免费', '升级', '获奖', '通过', '获批', '中标'], impact: 0.3 },
  { words: ['暴跌', '裁员', '亏损', '罚款', '调查', '诉讼', '违规', '暂停', '下架', '召回', '暴雷', '造假', '危机', '延迟', '取消', '失败', '风险'], impact: -0.2 },
  { words: ['收购', '合并', '投资', '布局', '进入', '推出', '计划', '扩张', 'IPO', '融资', '获投', '战略合作', '联手', '携手', '宣布', '进军', '拓展', '达成', '签约'], impact: 0.2 },
];

function analyzeSentiment(title) {
  var score = 0;
  for (var i = 0; i < SENTIMENT_KW.length; i++) {
    var group = SENTIMENT_KW[i];
    if (group.words.some(function(w) { return title.indexOf(w) >= 0; })) score += group.impact;
  }
  return +score.toFixed(2);
}

function matchCompaniesInTitle(title, sectorIds) {
  ensureCompanyIndex();
  if (!title) return [];
  var matched = [];
  var titleLower = title.toLowerCase();
  var sectorSet = new Set(sectorIds || []);
  for (var i = 0; i < COMPANY_INDEX.length; i++) {
    var entry = COMPANY_INDEX[i];
    if (!sectorSet.has(entry.sectorId)) continue;
    for (var j = 0; j < entry.keywords.length; j++) {
      var kw = entry.keywords[j];
      if (kw.length < 2) continue;
      if (titleLower.indexOf(kw.toLowerCase()) >= 0) {
        if (!matched.find(function(m) { return m.name === entry.name; })) {
          matched.push({ name: entry.name, ticker: entry.ticker, country: entry.country });
        }
        break;
      }
    }
  }
  return matched.slice(0, 4);
}

const COMPANY_ALIASES = {
  'Tesla FSD': ['特斯拉'],
  'Waymo (Alphabet)': ['Waymo', '谷歌'],
  '华为海思': ['华为昇腾', '华为', '昇腾'],
  'Google': ['谷歌'],
  'Amazon': ['亚马逊', 'AWS'],
  'Microsoft': ['微软'],
  'Apple': ['苹果'],
  'Meta': ['Facebook', '脸书'],
  '台积电 TSMC': ['台积电'],
  '中芯国际 SMIC': ['中芯国际', '中芯'],
  '百度 Apollo': ['百度', '萝卜快跑'],
  'Figure AI': ['Figure'],
};

function extractCompanyKeywords(companyName) {
  var keywords = [companyName];
  var clean = companyName.replace(/\(.*?\)/g, '').trim();
  if (clean !== companyName && clean.length >= 2) keywords.push(clean);
  var parts = clean.split(/\s+/);
  parts.forEach(function(p) {
    if (p.length >= 3 && keywords.indexOf(p) < 0) keywords.push(p);
  });
  var aliases = COMPANY_ALIASES[companyName] || [];
  aliases.forEach(function(a) { if (keywords.indexOf(a) < 0) keywords.push(a); });
  return keywords;
}



// ============================================
// 多源投研报告抓取系统
// ============================================
const RESEARCH_CACHE_KEY = 'ai_research_cache_v3';

// --- 源1：东方财富（已有，保留） ---
const EM_BASE = 'https://reportapi.eastmoney.com/report/list';


const AI_RESEARCH_KEYWORDS = [
  'AI', '人工智能', '大模型', 'GPT', 'ChatGPT', 'OpenAI', 'Claude', 'Gemini',
  '智能', '机器学习', '深度学习', '神经网络', '算力', 'GPU', '芯片',
  '自动驾驶', '智能驾驶', '机器人', '人形', '具身智能', 'NLP',
  'AIGC', '生成式', '多模态', 'LLM', 'RAG', '大语言', 'Agent',
  '半导体', '光刻', '制程', 'HBM', '英伟达', 'NVIDIA', '台积电',
  '数据标注', '向量', 'embedding', '模型训练', '推理', '微调',
  '视觉', '语音', '计算机视觉', '量化', '智能制造', '数字化'
];

function isAIResearch(title, summary) {
  const text = ((title || '') + ' ' + (summary || '')).toLowerCase();
  return AI_RESEARCH_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
}


function stripHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function emCodeToTicker(stockCode) {
  if (!stockCode || stockCode.length !== 6) return null;
  const code = stockCode.toString().trim();
  if (code.startsWith('6')) return code + '.SS';
  if (code.startsWith('0') || code.startsWith('3')) return code + '.SZ';
  if (code.startsWith('4') || code.startsWith('8')) return code + '.BJ';
  return code + '.SS';
}

async function openSectorModal(sectorId) {
  const item = industryData.find(i => i.id === sectorId);
  if (!item) return;
  const existing = document.querySelector('.sector-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'sector-modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const companyRows = item.companies.map(c => {
    const sd = c.ticker ? getStockData(c.ticker) : null;
    const price = sd && sd.currentPrice ? '¥' + sd.currentPrice.toFixed(2) : '';
    const change = sd ? (sd.change >= 0 ? '+' : '') + sd.changePercent.toFixed(2) + '%' : '';
    const changeCls = sd && sd.change >= 0 ? 'stock-up' : 'stock-down';
    return '<div class="modal-company-row"><span>' + (c.country || '') + ' ' + escapeHTML(c.name) + '</span>' + (c.ticker ? '<span style="color:var(--text-muted);font-size:11px">' + escapeHTML(c.ticker) + '</span>' : '') + (price ? '<span class="' + changeCls + '" style="font-weight:600;margin-left:auto">' + price + ' ' + change + '</span>' : '<span style="color:var(--text-muted);margin-left:auto">' + (c.capLabel || '') + '</span>') + '</div>';
  }).join('');

  overlay.innerHTML = '<div class="sector-modal" style="position:relative"><button class="modal-close" onclick="this.closest(\'.sector-modal-overlay\').remove()">✕</button><h3>' + escapeHTML(item.name) + '</h3><div class="modal-layer">' + item.layerName + '</div><div class="modal-scores"><div class="modal-score"><div class="modal-score-val" style="color:var(--accent-red)">' + item.scarcity.toFixed(1) + '</div><div class="modal-score-label">🔥 紧缺度</div></div><div class="modal-score"><div class="modal-score-val" style="color:var(--accent-purple)">' + item.value.toFixed(1) + '</div><div class="modal-score-label">💎 价值</div></div><div class="modal-score"><div class="modal-score-val" style="color:var(--accent-cyan)">' + item.barrier.toFixed(1) + '</div><div class="modal-score-label">🏰 壁垒</div></div><div class="modal-score"><div class="modal-score-val" style="color:var(--accent-blue)">' + item.composite.toFixed(1) + '</div><div class="modal-score-label">📊 综合</div></div></div><div class="modal-companies">' + companyRows + '</div></div>';

  document.body.appendChild(overlay);
}

window.openSectorModal = openSectorModal;

async function fetchEastmoneyReports(pageNo = 1) {
  try {
    const url = `${EM_BASE}?cb=&industryCode=*&pageSize=50&pageNo=${pageNo}&fields=title,orgName,orgSName,publishDate,stockName,stockCode,summary,infoCode&qType=0&beginTime=2026-01-01&endTime=`;
    const resp = await fetch(url, { headers: { 'Referer': 'https://data.eastmoney.com/' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return (data.data || []).map(r => ({
      title: (r.title || '').trim(),
      orgName: r.orgName || '',
      orgSName: r.orgSName || '',
      date: (r.publishDate || '').slice(0, 10),
      stockName: r.stockName || '',
      stockCode: r.stockCode || '',
      ticker: emCodeToTicker(r.stockCode || ''),
      summary: stripHTML(r.summary || '').slice(0, 300),
      link: r.infoCode ? `https://pdf.dfcfw.com/pdf/H2_${r.infoCode}_1.pdf` : '',
      infoCode: r.infoCode || '',
      source: r.orgSName || r.orgName || '东方财富',
      apiSource: '东方财富',
    }));
  } catch (e) {
    console.warn('⚠️ 东方财富研报API失败:', e.message);
    return [];
  }
}

// --- 源2：同花顺研报 ---
async function fetch10jqkaReports(pageNo = 1) {
  try {
    const url = `https://yuanbao.10jqka.com.cn/open_api/research/reportList?page=${pageNo}&size=30&type=1`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return (data.data?.list || data.data || []).map(r => ({
      title: (r.title || r.report_title || '').trim(),
      orgName: r.org_name || r.orgName || '',
      orgSName: r.org_short || r.orgSName || '',
      date: (r.date || r.publish_date || r.publishDate || '').slice(0, 10),
      stockName: r.stock_name || r.stockName || '',
      stockCode: (r.stock_code || r.stockCode || '').toString(),
      ticker: emCodeToTicker((r.stock_code || r.stockCode || '').toString()),
      summary: stripHTML(r.summary || r.abstract || '').slice(0, 300),
      link: r.url || r.link || '',
      infoCode: r.id || r.report_id || '',
      source: r.org_short || r.orgSName || r.orgName || '同花顺',
      apiSource: '同花顺',
    }));
  } catch (e) {
    console.warn('⚠️ 同花顺研报API失败:', e.message);
    return [];
  }
}

// --- 源3：东方财富-行业研报（不同查询维度） ---
async function fetchEMIndustryReports() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `${EM_BASE}?cb=&industryCode=*&pageSize=30&pageNo=1&fields=title,orgName,orgSName,publishDate,stockName,stockCode,summary,infoCode&qType=1&beginTime=2026-01-01&endTime=`;
    const resp = await fetch(url, { headers: { 'Referer': 'https://data.eastmoney.com/' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return (data.data || []).map(r => ({
      title: (r.title || '').trim(),
      orgName: r.orgName || '',
      orgSName: r.orgSName || '',
      date: (r.publishDate || '').slice(0, 10),
      stockName: r.stockName || '',
      stockCode: r.stockCode || '',
      ticker: emCodeToTicker(r.stockCode || ''),
      summary: stripHTML(r.summary || '').slice(0, 300),
      link: r.infoCode ? `https://pdf.dfcfw.com/pdf/H2_${r.infoCode}_1.pdf` : '',
      infoCode: r.infoCode || '',
      source: r.orgSName || r.orgName || '东方财富-行业',
      apiSource: '东方财富-行业',
    }));
  } catch (e) {
    console.warn('⚠️ 东方财富行业研报失败:', e.message);
    return [];
  }
}

// --- 汇总多源研报 ---
const RESEARCH_SOURCES = [
  { name: '东方财富', fetch: fetchEastmoneyReports, pages: 3 },
  { name: '东方财富-行业', fetch: fetchEMIndustryReports, pages: 1 },
  { name: '同花顺', fetch: fetch10jqkaReports, pages: 2 },
];

async function fetchAllResearch() {
  console.log('📋 正在从多个数据源抓取券商研报...');
  const allResults = [];

  for (const src of RESEARCH_SOURCES) {
    try {
      const pageResults = await Promise.all(
        Array.from({ length: src.pages }, (_, i) => src.fetch(i + 1))
      );
      const flat = pageResults.flat();
      console.log(`  ${src.name}: ${flat.length} 篇`);
      allResults.push(...flat);
    } catch (e) {
      console.warn(`  ${src.name}: 失败`);
    }
  }

  // 去重+AI筛选
  const seen = new Set();
  const filtered = [];
  for (const r of allResults) {
    if (!r.title || seen.has(r.title)) continue;
    if (!isAIResearch(r.title, r.summary)) continue;
    seen.add(r.title);
    const sectorIds = mapNewsToSectors(r.title + ' ' + r.summary);
    const companies = matchCompaniesInTitle(r.title + ' ' + r.summary, sectorIds || []);
    const sentiment = analyzeSentiment(r.title);
    filtered.push({ ...r, sectorIds, companies, sentiment });
  }
  filtered.sort((a, b) => b.date.localeCompare(a.date));
  console.log(`✅ AI相关券商研报: ${filtered.length} 篇（来自 ${allResults.length} 篇总研报，${RESEARCH_SOURCES.length}个数据源）`);
  filtered.forEach(r => { if (r.ticker) researchTickers.add(r.ticker); });
  return filtered.slice(0, 60);
}
async function fetchReportDigest(infoCode) {
if (!infoCode) return '';
try {
const proxies = [
'https://api.allorigins.win/raw?url=',
'https://api.codetabs.com/v1/proxy?quest=',
];
const proxy = proxies[Math.floor(Math.random() * proxies.length)];
const url = proxy + encodeURIComponent(`https://data.eastmoney.com/report/zw_industry.jshtml?infocode=${infoCode}`);
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);
const resp = await fetch(url, { signal: controller.signal });
clearTimeout(timeout);
if (!resp.ok) return '';
const html = await resp.text();
let text = html.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
const patterns = [
/投资要点[：:\s]+(.+?)(?=风险提示|盈利预测|投资建议|评级[：:]|【|$)/,
/核心观点[：:\s]+(.+?)(?=风险提示|盈利预测|投资建议|评级[：:]|【|$)/,
/事件[：:\s]+(.+?)(?=风险提示|盈利预测|投资建议|评级[：:]|【|$)/,
/摘要[：:\s]+(.+?)(?=风险提示|盈利预测|投资建议|评级[：:]|【|$)/,
];
for (const pat of patterns) {
const m = text.match(pat);
if (m && m[1].trim().length > 10) {
return m[1].trim().slice(0, 250);
}
}
const sentences = text.split(/[。；]/);
const meaningful = sentences.filter(s => s.trim().length > 15);
if (meaningful.length > 0) {
return meaningful.slice(0, 3).join('。') + '。';
}
return '';
} catch (e) {
return '';
}
}
async function enrichResearchDigests(reports, concurrency = 10) {
const toFetch = reports.filter(r => r.infoCode && (!r.summary || r.summary.length < 20));
if (toFetch.length === 0) return;
console.log(`📋 正在获取 ${toFetch.length} 篇研报摘要（${concurrency}路并发）...`);
const startTime = Date.now();
let idx = 0;
let completed = 0;
async function worker() {
while (idx < toFetch.length) {
const i = idx++;
const r = toFetch[i];
if (!r) break;
const digest = await fetchReportDigest(r.infoCode);
completed++;
if (digest) {
r.summary = digest;
updateResearchCardSummary(r.infoCode, digest);
}
}
}
const workers = Array(Math.min(concurrency, toFetch.length)).fill(0).map(() => worker());
await Promise.allSettled(workers);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`📋 研报摘要获取完成 (${completed}/${toFetch.length}，耗时${elapsed}s)`);
try {
const allReports = JSON.parse(sessionStorage.getItem(RESEARCH_CACHE_KEY) || '[]');
allReports.forEach(cached => {
const updated = reports.find(r => r.infoCode === cached.infoCode);
if (updated) cached.summary = updated.summary;
});
sessionStorage.setItem(RESEARCH_CACHE_KEY, JSON.stringify(reports));
} catch(e) {}
}
function updateResearchCardSummary(infoCode, digest) {
const cards = $$('.research-card');
for (const card of cards) {
if (card.getAttribute('data-infocode') === infoCode) {
const summaryEl = card.querySelector('.research-card-summary');
if (summaryEl) {
summaryEl.textContent = digest;
summaryEl.style.opacity = '1';
}
break;
}
}
}
let compareList = [];
function toggleCompare(companyName, ticker, sectorName, marketCap) {
const idx = compareList.findIndex(c => c.name === companyName);
if (idx >= 0) {
compareList.splice(idx, 1);
} else if (compareList.length < 4) {
compareList.push({ name: companyName, ticker, sectorName, marketCap });
}
updateCompareBar();
}
function updateCompareBar() {
let bar = document.querySelector('.compare-bar');
if (!bar) {
bar = document.createElement('div');
bar.className = 'compare-bar';
bar.innerHTML = `
<span style="font-size:13px;font-weight:600;white-space:nowrap">📊 对比</span>
<div class="compare-tags"></div>
<button class="compare-btn" onclick="openCompareModal()" disabled>开始对比</button>
`;
document.body.appendChild(bar);
}
const tagsEl = bar.querySelector('.compare-tags');
tagsEl.innerHTML = compareList.map(c => `
<span class="compare-tag">
${c.name}${c.ticker ? ' · ' + c.ticker : ''}
<span class="remove-compare" onclick="event.stopPropagation();toggleCompare('${c.name.replace(/'/g, "\'")}','${c.ticker}')">✕</span>
</span>
`).join('');
bar.classList.toggle('active', compareList.length > 0);
bar.querySelector('.compare-btn').disabled = compareList.length < 2;
}
function openCompareModal() {
if (compareList.length < 2) return;
const existing = document.querySelector('.sector-modal-overlay');
if (existing) existing.remove();
const overlay = document.createElement('div');
overlay.className = 'sector-modal-overlay';
overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
const stocksHTML = compareList.map(c => {
const sd = c.ticker ? getStockData(c.ticker) : null;
const price = sd ? `¥${sd.currentPrice.toFixed(2)}` : '--';
const change = sd ? `${sd.change >= 0 ? '+' : ''}${sd.changePercent.toFixed(2)}%` : '--';
const changeCls = sd && sd.change >= 0 ? 'stock-up' : 'stock-down';
return `
<th>
<div style="font-weight:700">${c.name}</div>
<div style="font-size:11px;color:var(--text-muted)">${c.ticker || '未上市'}</div>
</th>`;
}).join('');
const priceHTML = compareList.map(c => {
const sd = c.ticker ? getStockData(c.ticker) : null;
const price = sd ? `¥${sd.currentPrice.toFixed(2)}` : '--';
const change = sd ? `${sd.change >= 0 ? '+' : ''}${sd.changePercent.toFixed(2)}%` : '--';
const changeCls = sd && sd.change >= 0 ? 'stock-up' : 'stock-down';
return `<td class="${changeCls}">${price}<br><span style="font-size:11px">${change}</span></td>`;
}).join('');
const sectorHTML = compareList.map(c => `<td>${c.sectorName}</td>`).join('');
const capHTML = compareList.map(c => `<td>${c.marketCap || '--'}</td>`).join('');
overlay.innerHTML = `
<div class="sector-modal compare-modal" style="position:relative">
<button class="modal-close" onclick="this.closest('.sector-modal-overlay').remove()">✕</button>
<h3>📊 公司对比</h3>
<table class="compare-table" style="margin-top:16px">
<thead><tr><th></th>${stocksHTML}</tr></thead>
<tbody>
<tr><td style="font-weight:600">实时股价</td>${priceHTML}</tr>
<tr><td style="font-weight:600">所属赛道</td>${sectorHTML}</tr>
<tr><td style="font-weight:600">市值/估值</td>${capHTML}</tr>
</tbody>
</table>
</div>
`;
document.body.appendChild(overlay);
}
window.toggleCompare = toggleCompare;
window.openCompareModal = openCompareModal;
window.updateCompareBar = updateCompareBar;
function renderResearchCards(reports) {
const container = $('#researchCards');
if (!container) return;
const empty = container.querySelector('.news-empty');
if (empty) empty.remove();
reports.forEach(r => {
const card = document.createElement('div');
card.className = 'research-card';
if (r.infoCode) card.setAttribute('data-infocode', r.infoCode);
const sectorTags = (r.sectorIds || []).slice(0, 2).map(id =>
`<span class="news-sector-tag">${getSectorName(id)}</span>`
).join('');
let primaryStockHTML = '';
if (r.stockName && r.stockCode) {
const ticker = r.ticker || '';
const tickerDisplay = ticker ? `<span class="research-stock-code">${escapeHTML(ticker)}</span>` : `<span class="research-stock-code">${escapeHTML(r.stockCode)}</span>`;
const pseudoCompany = { name: r.stockName, ticker: ticker };
const stockBadgeHTML = ticker ? renderStockBadge(pseudoCompany) : '';
primaryStockHTML = `
<div class="research-primary-stock">
<span class="research-stock-icon">📈</span>
<span class="research-stock-label">覆盖标的：</span>
<span class="research-stock-name">${escapeHTML(r.stockName)}</span>
${tickerDisplay}
${stockBadgeHTML}
</div>`;
}
const extraCompanies = (r.companies || []).filter(c => {
if (r.stockName && c.name.includes(r.stockName)) return false;
return true;
});
const extraCompanyTags = extraCompanies.slice(0, 4).map(c => {
const tickerSpan = c.ticker ? `<span class="news-company-ticker">${escapeHTML(c.ticker)}</span>` : '';
return `<span class="news-company-tag">${c.country} ${escapeHTML(c.name)}${tickerSpan}</span>`;
}).join('');
const sentimentLabel = r.sentiment > 0 ? '看多' : r.sentiment < 0 ? '看空' : '中性';
const sentimentCls = r.sentiment > 0 ? 'positive' : r.sentiment < 0 ? 'negative' : 'neutral';
const sign = r.sentiment > 0 ? '+' : '';
const smartSummary = buildResearchSummary(r);
card.innerHTML = `
<div class="research-card-header">
<span class="research-org-badge">${escapeHTML(r.source)}</span>
<span class="news-date">${r.date}</span>
<span class="news-sentiment ${sentimentCls}">${sign}${r.sentiment.toFixed(1)} ${sentimentLabel}</span>
</div>
${primaryStockHTML}
<div class="research-card-title">
<a href="${escapeHTML(r.link)}" target="_blank" rel="noopener">${escapeHTML(r.title)}</a>
</div>
<div class="research-card-summary">${escapeHTML(smartSummary)}</div>
<div class="news-card-footer">
${sectorTags}
${extraCompanyTags}
</div>
`;
container.appendChild(card);
});
}
function refreshResearchStockBadges() {
const stockAreas = $$('.research-primary-stock');
stockAreas.forEach(area => {
const badge = area.querySelector('.stock-badge');
if (!badge) return;
const ticker = badge.querySelector('.ticker-symbol')?.textContent?.trim();
if (!ticker) return;
const sd = getStockData(ticker);
if (!sd || !sd.currentPrice) return;
const direction = sd.change >= 0 ? 'up' : 'down';
const sign = sd.change >= 0 ? '+' : '';
badge.className = `stock-badge ${direction}`;
badge.title = '点击查看K线图 (¥人民币)';
const priceEl = badge.querySelector('.stock-price');
const changeEl = badge.querySelector('.stock-change');
if (priceEl) priceEl.textContent = `¥${sd.currentPrice.toFixed(2)}`;
if (changeEl) changeEl.textContent = `${sign}${sd.changePercent}%`;
badge.onclick = (e) => {
e.stopPropagation();
openKLine(ticker, area.querySelector('.research-stock-name')?.textContent?.trim() || ticker);
};
});
}
function buildResearchSummary(r) {
const parts = [];
if (r.stockName && r.stockCode) {
parts.push(`覆盖${r.stockName}(${r.stockCode})`);
}
if (r.sectorIds && r.sectorIds.length > 0) {
const sectorNames = r.sectorIds.slice(0, 3).map(id => getSectorName(id));
parts.push(`聚焦${sectorNames.join('、')}赛道`);
}
const cleanTitle = r.title.replace(/^公司动态研究报告[：:]\s*/, '').replace(/^行业深度[：:]\s*/, '').replace(/^深度研究[：:]\s*/, '');
parts.push(cleanTitle);
return parts.join('。');
}
async function runResearchCycle(forceRefresh) {
  if (!forceRefresh) {
    try {
      var cached = sessionStorage.getItem(RESEARCH_CACHE_KEY);
      if (cached) {
        var reports = JSON.parse(cached);
        console.log('📋 从缓存加载 ' + reports.length + ' 篇研报');
        renderResearchCards(reports);
        return;
      }
    } catch(e) {}
  }

  var reports = [];
  try {
    reports = await fetchAllResearch();
  } catch(e) { console.warn('研报抓取异常:', e.message); }

  if (reports.length > 0) {
    try { sessionStorage.setItem(RESEARCH_CACHE_KEY, JSON.stringify(reports)); } catch(e) {}
    renderResearchCards(reports);
    enrichResearchDigests(reports, 10);
  } else {
    var container = $('#researchCards');
    if (container) {
      var empty = container.querySelector('.news-empty');
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'news-empty';
        container.appendChild(empty);
      }
      empty.textContent = '📋 研报接口暂时无数据，请稍后刷新（数据源：东方财富+同花顺）';
    }
  }
}
function showToast(message) {
let toast = $('#liveToast');
if (!toast) {
toast = document.createElement('div');
toast.id = 'liveToast';
toast.style.cssText = `
position: fixed; bottom: 24px; right: 24px; z-index: 9999;
background: var(--bg-card); border: 1px solid var(--accent-blue);
color: var(--text-primary); padding: 14px 20px;
border-radius: 12px; font-size: 14px; font-weight: 500;
box-shadow: 0 8px 32px rgba(0,0,0,0.4);
max-width: 400px; transition: all 0.3s ease;
opacity: 0; transform: translateY(10px);
pointer-events: none;
`;
document.body.appendChild(toast);
}
toast.textContent = message;
toast.style.opacity = '1';
toast.style.transform = 'translateY(0)';
setTimeout(() => {
toast.style.opacity = '0';
toast.style.transform = 'translateY(10px)';
}, 4000);
}

// ============================================
// 新闻实时情报系统 — 时间线模式 + 7天过滤
// ============================================
let currentPage = 'overview';

function getSectorName(sectorId) {
  const item = industryData.find(i => i.id === sectorId);
  return item ? item.name : sectorId;
}

function addNewsCard(title, source, date, sectorIds, sentiment, link, companies) {
  const container = $('#newsCards');
  if (!container) return;
  const empty = container.querySelector('.news-empty');
  if (empty) empty.remove();

  const card = document.createElement('div');
  card.className = 'news-card';
  card.setAttribute('data-sector-ids', JSON.stringify(sectorIds || []));
  card.setAttribute('data-link', link || '');
  card.setAttribute('data-date', date);

  if (link) {
    card.style.cursor = 'pointer';
    card.title = '点击查看原文';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.news-sector-tag') || e.target.closest('.news-sentiment') || e.target.closest('.news-company-tag')) return;
      window.open(link, '_blank', 'noopener');
    });
  }

  const layers = new Set();
  (sectorIds || []).forEach(id => {
    const l = getSectorLayer(id);
    if (l) layers.add(l);
  });
  card.setAttribute('data-layers', JSON.stringify([...layers]));

  const sentimentLabel = sentiment > 0 ? '利好' : sentiment < 0 ? '利空' : '中性';
  const sentimentCls = sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral';
  const sign = sentiment > 0 ? '+' : '';

  const sectorTags = (sectorIds || []).slice(0, 3).map(id =>
    '<span class="news-sector-tag">' + getSectorName(id) + '</span>'
  ).join('');

  const companyTags = (companies || []).map(c => {
    const tickerSpan = c.ticker ? '<span class="news-company-ticker">' + escapeHTML(c.ticker) + '</span>' : '';
    return '<span class="news-company-tag" title="' + escapeHTML(c.name) + (c.ticker ? ' · ' + c.ticker : '') + '">' + (c.country || '') + ' ' + escapeHTML(c.name) + tickerSpan + '</span>';
  }).join('');

  const linkIcon = link ? ' <span style="font-size:10px;opacity:0.5">🔗</span>' : '';

  card.innerHTML = '<div class="news-card-header"><span class="news-source-badge">' + escapeHTML(source) + '</span><span class="news-date">' + date + '</span></div><div class="news-card-title">' + escapeHTML(title) + linkIcon + '</div><div class="news-card-footer">' + sectorTags + companyTags + '<span class="news-sentiment ' + sentimentCls + '">' + sign + sentiment.toFixed(1) + ' ' + sentimentLabel + '</span></div>';

  if (currentPage !== 'overview' && currentPage !== 'ranking') {
    if (!layers.has(currentPage)) card.style.display = 'none';
  }

  RENDERED_NEWS_TITLES.add(title);
  container.appendChild(card);
}

// 按时间线重新组织新闻：每天一个分组，7天过滤
function renderNewsTimeline() {
  const container = $('#newsCards');
  if (!container) return;

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const cards = [...container.querySelectorAll('.news-card')];

  // 移除超过7天的卡片
  cards.forEach(card => {
    const d = card.getAttribute('data-date') || '';
    if (d < sevenDaysAgo) card.remove();
  });

  // 按日期分组
  const groups = {};
  const remaining = [...container.querySelectorAll('.news-card')];
  remaining.forEach(card => {
    const d = card.getAttribute('data-date') || '';
    if (!groups[d]) groups[d] = [];
    groups[d].push(card);
  });

  // 清空容器
  container.innerHTML = '';

  // 日期降序排列，每天内按原始顺序
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  sortedDates.forEach(date => {
    // 日期标签
    let dateLabel = date;
    if (date === today) dateLabel = '📅 今天 · ' + date;
    else if (date === yesterday) dateLabel = '📅 昨天 · ' + date;
    else {
      const d = new Date(date);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      dateLabel = '📅 ' + weekdays[d.getDay()] + ' · ' + date;
    }

    const header = document.createElement('div');
    header.className = 'news-timeline-header';
    header.innerHTML = '<span>' + dateLabel + '</span><span style="color:var(--text-muted);font-size:11px">' + groups[date].length + ' 条</span>';
    container.appendChild(header);

    // 该日期的卡片
    groups[date].forEach(card => container.appendChild(card));
  });

  // 更新统计
  const totalCards = Object.values(groups).reduce((s, g) => s + g.length, 0);
  const statsEl = $('#newsStatsCount');
  if (statsEl) statsEl.textContent = totalCards;
  const daysEl = $('#newsStatsDays');
  if (daysEl) daysEl.textContent = sortedDates.length;
}

// 新闻层级过滤（适配时间线）
function filterNewsByLayer(layer) {
  currentPage = layer;
  const container = $('#newsCards');
  if (!container) return;

  const allCards = [...container.querySelectorAll('.news-card')];
  const allHeaders = [...container.querySelectorAll('.news-timeline-header')];

  if (layer === 'all' || layer === 'news' || layer === 'overview' || layer === 'ranking') {
    allCards.forEach(c => c.style.display = '');
    allHeaders.forEach(h => h.style.display = '');
  } else {
    allCards.forEach(card => {
      try {
        const layers = JSON.parse(card.getAttribute('data-layers') || '[]');
        card.style.display = layers.includes(layer) ? '' : 'none';
      } catch (e) { card.style.display = ''; }
    });
    // 隐藏空的日期分组标题
    allHeaders.forEach(header => {
      let next = header.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('news-timeline-header')) {
        if (next.style.display !== 'none') { hasVisible = true; break; }
        next = next.nextElementSibling;
      }
      header.style.display = hasVisible ? '' : 'none';
    });
  }
}

function sortNewsByDate() {
  renderNewsTimeline();
}

// 清理过期缓存
function cleanOldNewsCache() {
  const cached = loadNewsCache();
  if (!cached) return;
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const fresh = cached.filter(n => n.date >= sevenDaysAgo);
  if (fresh.length < cached.length) saveNewsCache(fresh);
}

// 应用一条真实新闻
function applyRealNews(newsItem) {
  newsItem.sectorIds.forEach(sectorId => {
    const item = industryData.find(i => i.id === sectorId);
    if (!item) return;
    item.newsFactors.push({
      date: newsItem.date,
      event: '[' + newsItem.source + '] ' + newsItem.title,
      impact: newsItem.sentiment,
    });
    if (item.newsFactors.length > 10) item.newsFactors = item.newsFactors.slice(-10);
    const newsImpact = item.newsFactors.reduce((s, nf) => s + nf.impact, 0);
    item.scarcity = Math.min(10, Math.max(1, +(9.0 + newsImpact * 0.5).toFixed(1)));
    item.value = Math.min(10, Math.max(1, +(9.0 + newsImpact * 0.3).toFixed(1)));
    item.composite = +(item.scarcity * 0.4 + item.value * 0.35 + item.barrier * 0.25).toFixed(1);
  });
  addNewsCard(newsItem.title, newsItem.source, newsItem.date, newsItem.sectorIds, newsItem.sentiment, newsItem.link || '', newsItem.companies || []);
  if (newsItem.sentiment !== 0) {
    showToast('📡 ' + (newsItem.sentiment > 0 ? '利好' : '利空') + '：' + newsItem.title.slice(0, 30) + '... (' + (newsItem.sentiment > 0 ? '+' : '') + newsItem.sentiment.toFixed(1) + ')');
  }
}

async function runRealNewsCycle(forceRefresh) {
  if (!_prefetchedNews && !forceRefresh) {
    try {
      _prefetchedNews = await fetchAllRealNews();
      if (_prefetchedNews && _prefetchedNews.length > 0) saveNewsCache(_prefetchedNews);
    } catch(e) {}
  }
  if (!forceRefresh && _prefetchedNews && _prefetchedNews.length > 0) {
    console.log('📡 预抓取就绪，' + _prefetchedNews.length + ' 条新闻即时加载');
    _prefetchedNews.forEach(function(news) { RENDERED_NEWS_TITLES.add(news.title); applyRealNews(news); });
    _prefetchedNews = null;
    renderNewsTimeline();
    refreshAll();
    refreshNewsInBackground();
    return;
  }
  if (!forceRefresh) {
    const cached = loadNewsCache();
    if (cached && cached.length > 0) {
      cleanOldNewsCache();
      console.log('📡 从缓存加载 ' + cached.length + ' 条新闻');
      cached.forEach(function(news) { RENDERED_NEWS_TITLES.add(news.title); applyRealNews(news); });
      renderNewsTimeline();
      refreshAll();
      refreshNewsInBackground();
      return;
    }
  }
  var allNews = [];
  try { allNews = await fetchAllRealNews(); } catch(e) { console.warn('新闻抓取异常:', e.message); }

  if (allNews.length === 0) {
    updateNewsStatus('📡 未获取到实时新闻，显示行业动态');
    runFallbackSim(15);
    refreshAll();
    return;
  }

  saveNewsCache(allNews);
  try {
    allNews.forEach(function(news) { RENDERED_NEWS_TITLES.add(news.title); applyRealNews(news); });
  } catch(e) { console.warn('新闻渲染异常:', e.message); }

  renderNewsTimeline();

  var cards = $('#newsCards').querySelectorAll('.news-card');
  if (cards.length < 15) runFallbackSim(15 - cards.length);

  updateNewsStatus('📡 已加载 ' + allNews.length + ' 条AI新闻');
  refreshAll();
}

async function refreshNewsInBackground() {
  try {
    const allNews = await fetchAllRealNews();
    if (allNews.length === 0) return;
    saveNewsCache(allNews);
    let newCount = 0;
    for (var i = 0; i < allNews.length; i++) {
      if (RENDERED_NEWS_TITLES.has(allNews[i].title)) continue;
      RENDERED_NEWS_TITLES.add(allNews[i].title);
      applyRealNews(allNews[i]);
      newCount++;
      if (newCount >= 10) break;
    }
    if (newCount > 0) {
      renderNewsTimeline();
      refreshAll();
      var timeStr = new Date().toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      showToast('📡 ' + timeStr + ' 更新 ' + newCount + ' 条AI情报');
    }
    var updateEl = $('#newsUpdateTime');
    if (updateEl) updateEl.textContent = new Date().toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit'});
  } catch (e) {}
}

function runFallbackSim(count) {
  count = count || 5;
  var used = new Set();
  var cards = $('#newsCards').querySelectorAll('.news-card');
  if (cards.length >= 30) return; // 已有足够新闻，不补充模拟数据

  for (var k = 0; k < count; k++) {
    var item;
    var tries = 0;
    do { item = industryData[Math.floor(Math.random() * industryData.length)]; tries++; }
    while (used.has(item.id) && tries < 20);
    used.add(item.id);

    var pastDays = Math.floor(Math.random() * 7);
    var newsDate = new Date(Date.now() - pastDays * 86400000).toISOString().slice(0, 10);
    var events = [
      item.name + '赛道融资活跃，多家头部机构加码布局',
      item.name + '技术突破引发市场关注，商业化落地加速',
      '行业报告：' + item.name + '市场规模预计年增超40%',
      '多家' + item.name + '企业发布新品，竞争格局持续演变',
      item.name + '赛道政策利好频出，产业链加速完善',
    ];
    var title = events[Math.floor(Math.random() * events.length)];
    var impact = +(0.1 + Math.random() * 0.4).toFixed(1);

    item.newsFactors.push({ date: newsDate, event: '[行业动态] ' + title, impact: impact });
    if (item.newsFactors.length > 10) item.newsFactors = item.newsFactors.slice(-10);
    var ni = item.newsFactors.reduce(function(s, nf) { return s + nf.impact; }, 0);
    item.scarcity = Math.min(10, Math.max(1, +(9.0 + ni * 0.5).toFixed(1)));
    item.value = Math.min(10, Math.max(1, +(9.0 + ni * 0.3).toFixed(1)));
    item.composite = +(item.scarcity * 0.4 + item.value * 0.35 + item.barrier * 0.25).toFixed(1);

    var companies = item.companies.slice(0, 2).map(function(c) {
      return { name: c.name, ticker: c.ticker, country: c.country };
    });
    addNewsCard(title, '行业动态', newsDate, [item.id], impact, '', companies);
  }
  renderNewsTimeline();
  refreshAll();
}

function updateNewsStatus(msg) {
  var container = $('#newsCards');
  if (!container) return;
  var status = container.querySelector('.news-status-msg');
  if (!status) {
    status = document.createElement('div');
    status.className = 'news-status-msg';
    status.style.cssText = 'grid-column:1/-1;text-align:center;padding:12px;color:var(--text-muted);font-size:13px;';
    container.insertBefore(status, container.firstChild);
  }
  status.textContent = msg;
}

function startRealNewsFeed() {
  updateNewsStatus('📡 正在连接信息源...');
  setTimeout(function() { runRealNewsCycle(); }, 1500);
  setInterval(function() { refreshNewsInBackground(); }, 60 * 1000);
}

window.updateFilterTags = updateFilterTags;
window.filterNewsByLayer = filterNewsByLayer;

function refreshAll() {
renderOverview();
renderDashboard();
renderCards();
const sortKey = $('#rankingTable').dataset.sort || 'composite';
const asc = $('#rankingTable').dataset.asc === 'true';
renderRanking(sortKey, asc);
}
function initSorting() {
$$('.sortable').forEach(th => {
th.addEventListener('click', () => {
const key = th.dataset.sort;
const currentKey = $('#rankingTable').dataset.sort;
const currentAsc = $('#rankingTable').dataset.asc === 'true';
let newAsc = key === currentKey ? !currentAsc : false;
$('#rankingTable').dataset.sort = key;
$('#rankingTable').dataset.asc = newAsc;
renderRanking(key, newAsc);
});
});
}
function switchPage(pageName) {
$$('.page-section').forEach(p => p.classList.remove('active'));
const target = $(`#page-${pageName}`);
if (target) target.classList.add('active');
$$('.nav-link').forEach(link => {
link.classList.toggle('active', link.dataset.page === pageName);
});
const chainPages = ['upstream', 'midstream', 'downstream'];
const chainToggle = $('.nav-dropdown-toggle');
if (chainToggle) {
chainToggle.classList.toggle('active', chainPages.includes(pageName));
}
const filterBtn = $(`.news-layer-tag[data-layer="${pageName}"]`);
const allBtn = $('.news-layer-tag[data-layer="all"]');
if (filterBtn) {
$$('.news-layer-tag').forEach(t => t.classList.remove('active'));
filterBtn.classList.add('active');
} else if (allBtn && (pageName === 'news' || pageName === 'overview' || pageName === 'ranking')) {
$$('.news-layer-tag').forEach(t => t.classList.remove('active'));
allBtn.classList.add('active');
}
if (window.location.hash !== `#${pageName}`) {
history.pushState(null, '', `#${pageName}`);
}
filterNewsByLayer(pageName);
if (pageName === 'research' && researchTickers.size > 0) {
Promise.allSettled([...researchTickers].map(t => refreshStockData(t))).then(() => {
refreshResearchStockBadges();
});
}
window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchPage = switchPage;
function initPageRouting() {
$$('.nav-link').forEach(link => {
link.addEventListener('click', (e) => {
e.preventDefault();
const page = link.dataset.page;
if (page && page !== 'chain') switchPage(page);
});
});
const chainToggle = $('.nav-dropdown-toggle');
if (chainToggle) {
chainToggle.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const dd = $('#navChainDropdown');
if (dd) dd.classList.toggle('open');
});
document.addEventListener('click', (e) => {
const dd = $('#navChainDropdown');
if (dd && !dd.contains(e.target)) dd.classList.remove('open');
});
}
const hash = window.location.hash.replace('#', '');
if (hash && ['overview','research','news','upstream','midstream','downstream','ranking'].includes(hash)) {
switchPage(hash);
}
window.addEventListener('popstate', () => {
const h = window.location.hash.replace('#', '');
if (h && ['overview','research','news','upstream','midstream','downstream','ranking'].includes(h)) {
switchPage(h);
}
});
}
function initUpdateTime() {
$('#updateTime').textContent = `数据更新：${new Date().toLocaleString('zh-CN')}`;
}
let searchIndex = [];
function buildSearchIndex() {
searchIndex = [];
industryData.forEach(item => {
searchIndex.push({
type: 'sector',
name: item.name,
layer: item.layer,
layerName: item.layerName,
sectorId: item.id,
keywords: item.name,
});
item.companies.forEach(c => {
searchIndex.push({
type: 'company',
name: c.name,
country: c.country || '',
ticker: c.ticker || '',
sectorId: item.id,
sectorName: item.name,
layer: item.layer,
keywords: [c.name, c.ticker, c.country].filter(Boolean).join(' '),
});
});
});
}
function handleSearch(query) {
const dropdown = $('#searchDropdown');
if (!dropdown) return;
if (!query || query.trim().length < 1) {
dropdown.classList.remove('active');
return;
}
const q = query.toLowerCase().trim();
const results = searchIndex.filter(entry =>
entry.keywords.toLowerCase().includes(q)
).slice(0, 12);
if (results.length === 0) {
dropdown.innerHTML = '<div class="search-no-results">未找到匹配的公司或赛道</div>';
dropdown.classList.add('active');
return;
}
dropdown.innerHTML = results.map(r => {
if (r.type === 'sector') {
return `
<div class="search-result-item" onclick="switchPage('${r.layer}');closeSearch()">
<span style="font-size:16px">🏷️</span>
<span class="search-result-name">${escapeHTML(r.name)}</span>
<span class="search-result-sector">${r.layerName}</span>
</div>`;
} else {
const tickerSpan = r.ticker ? `<span class="search-result-ticker">${escapeHTML(r.ticker)}</span>` : '';
return `
<div class="search-result-item" onclick="switchPage('${r.layer}');setTimeout(()=>document.getElementById('${r.sectorId}')?.scrollIntoView({behavior:'smooth',block:'center'}),400);closeSearch()">
<span class="search-result-country">${escapeHTML(r.country)}</span>
<span class="search-result-name">${escapeHTML(r.name)}</span>
${tickerSpan}
<span class="search-result-sector">${escapeHTML(r.sectorName)}</span>
</div>`;
}
}).join('');
dropdown.classList.add('active');
}
function closeSearch() {
const dropdown = $('#searchDropdown');
if (dropdown) dropdown.classList.remove('active');
const input = $('#searchInput');
if (input) { input.value = ''; input.blur(); }
}
window.closeSearch = closeSearch;
function initSearch() {
buildSearchIndex();
const input = $('#searchInput');
const dropdown = $('#searchDropdown');
if (!input || !dropdown) return;
input.addEventListener('input', () => handleSearch(input.value));
input.addEventListener('focus', () => { if (input.value) handleSearch(input.value); });
document.addEventListener('click', (e) => {
if (!e.target.closest('.search-box')) closeSearch();
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeSearch();
});
}
function toggleTheme() {
document.body.classList.toggle('light');
const isLight = document.body.classList.contains('light');
localStorage.setItem('theme', isLight ? 'light' : 'dark');
const btn = $('#themeToggle');
if (btn) btn.textContent = isLight ? '☀️' : '🌙';
}
function initTheme() {
const saved = localStorage.getItem('theme');
if (saved === 'light') {
document.body.classList.add('light');
const btn = $('#themeToggle');
if (btn) btn.textContent = '☀️';
}
}
window.toggleTheme = toggleTheme;
function init() {
const perfStart = performance.now();
try { renderOverview(); } catch(e) {}
try { renderDashboard(); } catch(e) {}
try { initTheme(); } catch(e) {}
try { initPageRouting(); } catch(e) {}
try { initSorting(); } catch(e) {}
try {
const hash = window.location.hash.replace('#', '');
const validPages = ['overview', 'news', 'research', 'upstream', 'midstream', 'downstream', 'ranking'];
switchPage(validPages.includes(hash) ? hash : 'overview');
} catch(e) {}
requestAnimationFrame(() => {
try { renderCards(); } catch(e) {}
try { renderRanking(); } catch(e) {}
try { initSearch(); } catch(e) {}
try { startIndexRefresh(); } catch(e) {}
});
setTimeout(() => {
try { startRealNewsFeed(); } catch(e) {}
try { runResearchCycle(); } catch(e) {}
try { refreshAllStocks(); } catch(e) {}
}, 100);
setInterval(() => { try { refreshAllStocks(); } catch(e) {} }, 3 * 60 * 1000);
const elapsed = (performance.now() - perfStart).toFixed(0);
console.log(`🧠 AI全产业链图谱 | 18赛道 · ${industryData.reduce((s,i)=>s+i.companies.length,0)}家公司 | 首屏 ${elapsed}ms`);
}
if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
function updateFilterTags(activeBtn) {
$$('.news-layer-tag').forEach(t => t.classList.remove('active'));
if (activeBtn) activeBtn.classList.add('active');
}
window.updateFilterTags = updateFilterTags;
function sortNewsByDate() {
const container = $('#newsCards');
if (!container) return;
const cards = [...container.querySelectorAll('.news-card')];
cards.sort((a, b) => {
const da = a.getAttribute('data-date') || '';
const db = b.getAttribute('data-date') || '';
return db.localeCompare(da);
});
cards.forEach(card => container.appendChild(card));
}
window.filterNewsByLayer = filterNewsByLayer;
})();