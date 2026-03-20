import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const posts = [
  {
    title: "Budget 2025: The Rise of Rs 12 Lakh Tax-Free Income",
    slug: "budget-2025-tax-free-income-guide",
    excerpt: "Explore the new tax-free limits up to ₹12 Lakh under the 2025 Budget and how it impacts salaried professionals.",
    authorId: "admin_mock_1",
    categoryId: 1,
    status: "published",
    tags: JSON.stringify(["Budget 2025", "Income Tax", "Tax Planning"]),
    content: "# Budget 2025: The Rise of Rs 12 Lakh Tax-Free Income\n\nThe Union Budget 2025 has introduced transformative changes to the Indian personal income tax landscape. For the first time, resident individuals can effectively earn up to **₹12 Lakh** without paying a single rupee in income tax under the New Tax Regime.\n\n## The Core Framework\n\nThe expansion of the tax-free threshold is driven by two primary mechanisms: the upward revision of tax slabs and the enhanced rebate under **Section 87A**.\n\n| Income Bracket | New Tax Rate (FY 2025-26) |\n| :--- | :--- |\n| Up to ₹4 Lakh | Nil |\n| ₹4 Lakh - ₹8 Lakh | 5% |\n| ₹8 Lakh - ₹12 Lakh | 10% |\n| ₹12 Lakh - ₹16 Lakh | 15% |\n| Above ₹24 Lakh | 30% |\n\n## How the ₹12 Lakh Zero-Tax Math Works\n\nMany taxpayers are confused about how ₹12 Lakh becomes tax-free. Here is the breakdown:\n\n1.  **Standard Deduction**: Salaried individuals continue to get a flat deduction (now enhanced in some scenarios).\n2.  **Section 87A Rebate**: The rebate has been significantly increased to **₹60,000**. If your total taxable income is below ₹12 Lakh, this rebate wipes out your entire tax liability.\n\n### Key Benefits\n*   **More Disposable Income**: Middle-class families gain significant liquidity.\n*   **Simplified Compliance**: No need to track complicated 80C or 80D investments to save tax.\n*   **Default Shift**: The New Tax Regime is now the most attractive option for the vast majority of Indians.\n\n## Expert Verdict\n\nWhile the **Old Regime** still allows for specific deductions like HRA and Home Loan interest, the absolute zero-tax window up to ₹12 Lakh makes the New Regime a \"High-Signal\" choice for simplified wealth creation."
  },
  {
    title: "Capital Gains Tax Overhaul 2026: What Every Investor Needs to Know",
    slug: "capital-gains-tax-overhaul-2026",
    excerpt: "A deep dive into the upcoming STT hikes and buyback taxation changes starting April 2026.",
    authorId: "admin_mock_1",
    categoryId: 1,
    status: "published",
    tags: JSON.stringify(["Capital Gains", "Investing", "Regulation"]),
    content: "# Capital Gains Tax Overhaul 2026\n\nThe Indian financial markets are bracing for a major structural shift in taxation starting **April 1, 2026**. This overhaul targets derivative trading and corporate buybacks, with significant implications for retail and institutional investors.\n\n## STT Hikes on F&O\n\nThe Securities Transaction Tax (STT) for the equity derivatives segment is set to increase. This move is designed to curb excessive speculation in the options market.\n\n*   **Futures**: Increasing to **0.05%** from 0.02%.\n*   **Options**: Increasing to **0.15%** from 0.1%.\n\n## The Buyback Taxation Shift\n\nCurrently, companies pay a buyback tax, making it a tax-efficient way for shareholders to receive cash. From April 2026, this changes entirely:\n\n1.  **Direct Taxation**: Any amount received from share buybacks will be taxed as **Capital Gains** in the hands of the investor.\n2.  **Promoter Impact**: Promoters will face an additional \"differential buyback tax,\" potentially reducing the frequency of large-scale buybacks.\n\n## Comparison Table\n\n| Asset Type | Current Tax (2025) | New Tax (April 2026) |\n| :--- | :--- | :--- |\n| Options Premium | 0.1% STT | 0.15% STT |\n| Futures Turnover | 0.02% STT | 0.05% STT |\n| Share Buybacks | Corporate Tax Paid | Taxable for Investor |\n\n## Strategic Planning\n\nInvestors should consider rebalancing their portfolios before these changes take effect. For long-term holders, the shift in buyback taxation might make dividends more comparable to buybacks in terms of tax efficiency."
  },
  {
    title: "Decoding Section 80C vs the New Tax Regime in 2025",
    slug: "section-80c-vs-new-regime-2025",
    excerpt: "Should you still invest in PPF and ELSS? We compare the tax savings of 80C against the lower slabs of the New Regime.",
    authorId: "admin_mock_1",
    categoryId: 1,
    status: "published",
    tags: JSON.stringify(["80C", "Tax Savings", "Investment"]),
    content: "# Section 80C vs the New Tax Regime in 2025\n\nFor decades, **Section 80C** has been the cornerstone of Indian tax planning. However, with the Budget 2025 refinements, the choice between traditional tax-saving investments and the simplified New Regime has never been more critical.\n\n## The 80C Dilemma\n\nUnder the **Old Tax Regime**, you can deduct up to ₹1.5 Lakh for investments in:\n*   Public Provident Fund (PPF)\n*   Equity Linked Savings Schemes (ELSS)\n*   Life Insurance Premiums\n*   NPF and Home Loan Principal\n\n## The New Regime Advantage\n\nThe New Tax Regime offers lower rates but **disallows almost all 80C deductions**.\n\n### Which One Should You Choose?\n\nThe decision \"Breakeven Point\" depends on your total income and the amount of deductions you can claim.\n\n| Income Level | Choose Old Regime If... | Choose New Regime If... |\n| :--- | :--- | :--- |\n| ₹10 - ₹15 Lakh | Deductions > ₹3.75 Lakh | Deductions < ₹3.75 Lakh |\n| ₹15 - ₹20 Lakh | Deductions > ₹4.25 Lakh | Deductions < ₹4.25 Lakh |\n| Above ₹25 Lakh | Deductions > ₹4.50 Lakh | Always New Regime |\n\n## The \"Modern Investor\" Strategy\n\nMany modern investors are moving away from 80C-locked products (like LIC or 5-year FDs) in favor of the **New Regime**. This allows them to invest in high-yield assets without being forced into low-return tax-saving instruments just for the sake of a deduction."
  },
  {
    title: "Crypto-Asset Disclosure: New Compliance Rules Starting 2026",
    slug: "crypto-compliance-rules-2026",
    excerpt: "The Income-tax Rules 2026 bring crypto-assets under the global reporting scanner. Here is what you need to disclose.",
    authorId: "admin_mock_1",
    categoryId: 1,
    status: "published",
    tags: JSON.stringify(["Crypto", "Web3", "Compliance"]),
    content: "# Crypto-Asset Disclosure: New Rules for 2026\n\nThe Indian Income Tax Department is tightening the noose on digital assets. Starting **January 1, 2026**, new amendments to the Income-tax Rules will require significantly higher levels of disclosure for crypto-assets.\n\n## Expanded Reporting Scope\n\nThe new rules expand the definition of \"Reportable Financial Accounts.\" This means:\n*   **Exchange Data**: Indian exchanges will be required to share transaction details directly with the ITD.\n*   **Offshore Holdings**: If you hold crypto on international exchanges like Binance or Kraken, you must disclose these as foreign assets.\n\n## The 30% Tax and Beyond\n\nWhile the 30% flat tax on VDA (Virtual Digital Assets) income remains, the focus is now shifting to **Compliance and Transparency**.\n\n### Key Reporting Requirements\n1.  **Wallet Addresses**: In certain high-value cases, disclosure of specific wallet addresses may be requested.\n2.  **Cost Basis**: Rigorous proof of acquisition cost for every trade.\n3.  **TDS Reconcilliation**: Matching 1% TDS entries with reported income.\n\n## Global Context\n\nThese rules align India with the **G20's Crypto-Asset Reporting Framework (CARF)**. The goal is a global data-sharing network where tax authorities can track crypto-wealth across borders.\n\n## Future-Proofing Your Portfolio\n\nIf you are a crypto investor, ensure you are using automated tax-calculation tools. Relying on manual spreadsheets will no longer be sufficient to meet the granular reporting demands of the 2026 tax year."
  }
];

const insert = db.prepare(`
  INSERT INTO blog_posts (title, slug, content, excerpt, author_id, category_id, status, tags, published_at)
  VALUES (@title, @slug, @content, @excerpt, @authorId, @categoryId, @status, @tags, @publishedAt)
`);

db.transaction(() => {
  for (const post of posts) {
    try {
      insert.run({
        ...post,
        publishedAt: Date.now()
      });
      console.log('Inserted: ' + post.title);
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        console.log('Skipped (Already Exists): ' + post.title);
      } else {
        throw e;
      }
    }
  }
})();

console.log('Seeding completed.');
