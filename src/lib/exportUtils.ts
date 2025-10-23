import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: { from: string; to: string };
  categories?: string[];
  includeCharts?: boolean;
  includeStats?: boolean;
  currency?: string;
}

export interface ExportData {
  expenses: Expense[];
  stats: {
    totalAmount: number;
    averageAmount: number;
    transactionCount: number;
    categoryBreakdown: { category: string; amount: number; percentage: number }[];
    monthlyTotals: { month: string; amount: number }[];
  };
}

export class ExportService {
  static prepareData(expenses: Expense[], options: ExportOptions): ExportData {
    // Filter expenses based on date range and categories
    let filteredExpenses = expenses;
    
    if (options.dateRange) {
      const fromDate = new Date(options.dateRange.from);
      const toDate = new Date(options.dateRange.to);
      filteredExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= fromDate && expenseDate <= toDate;
      });
    }
    
    if (options.categories && options.categories.length > 0) {
      filteredExpenses = filteredExpenses.filter(expense => 
        options.categories!.includes(expense.category)
      );
    }

    // Calculate statistics
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
    
    // Category breakdown
    const categoryMap = new Map<string, number>();
    filteredExpenses.forEach(expense => {
      categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly totals
    const monthlyMap = new Map<string, number>();
    filteredExpenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + expense.amount);
    });
    
    const monthlyTotals = Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      expenses: filteredExpenses,
      stats: {
        totalAmount,
        averageAmount,
        transactionCount: filteredExpenses.length,
        categoryBreakdown,
        monthlyTotals,
      }
    };
  }

  static async exportToCSV(data: ExportData, options: ExportOptions): Promise<void> {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = data.expenses.map(expense => [
      expense.date,
      expense.description,
      expense.category,
      expense.amount.toString()
    ]);

    let csvContent = headers.join(',') + '\\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\\n';
    });

    // Add statistics section if requested
    if (options.includeStats) {
      csvContent += '\\n\\n--- STATISTICS ---\\n';
      csvContent += `Total Amount,${data.stats.totalAmount}\\n`;
      csvContent += `Average Amount,${data.stats.averageAmount.toFixed(2)}\\n`;
      csvContent += `Transaction Count,${data.stats.transactionCount}\\n`;
      
      csvContent += '\\n--- CATEGORY BREAKDOWN ---\\n';
      csvContent += 'Category,Amount,Percentage\\n';
      data.stats.categoryBreakdown.forEach(item => {
        csvContent += `${item.category},${item.amount},${item.percentage.toFixed(2)}%\\n`;
      });
    }

    this.downloadFile(csvContent, 'expenses.csv', 'text/csv');
  }

  static async exportToExcel(data: ExportData, options: ExportOptions): Promise<void> {
    // Create a simple Excel-compatible format using HTML table
    let htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .stats-table { margin-top: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          
          <div class="section-title">Transactions (${data.expenses.length})</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.expenses.forEach(expense => {
      htmlContent += `
        <tr>
          <td>${expense.date}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>${formatCurrency(expense.amount)}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
    `;

    if (options.includeStats) {
      htmlContent += `
          <div class="section-title">Summary Statistics</div>
          <table class="stats-table">
            <tr><td><strong>Total Amount</strong></td><td>${formatCurrency(data.stats.totalAmount)}</td></tr>
            <tr><td><strong>Average Amount</strong></td><td>${formatCurrency(data.stats.averageAmount)}</td></tr>
            <tr><td><strong>Transaction Count</strong></td><td>${data.stats.transactionCount}</td></tr>
          </table>
          
          <div class="section-title">Category Breakdown</div>
          <table class="stats-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
      `;

      data.stats.categoryBreakdown.forEach(item => {
        htmlContent += `
          <tr>
            <td>${item.category}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.percentage.toFixed(2)}%</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
          
          <div class="section-title">Monthly Totals</div>
          <table class="stats-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
      `;

      data.stats.monthlyTotals.forEach(item => {
        htmlContent += `
          <tr>
            <td>${item.month}</td>
            <td>${formatCurrency(item.amount)}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
      `;
    }

    htmlContent += `
        </body>
      </html>
    `;

    this.downloadFile(htmlContent, 'expenses.xlsx', 'application/vnd.ms-excel');
  }

  static async exportToPDF(data: ExportData, options: ExportOptions): Promise<void> {
    // Simple PDF export using HTML to PDF conversion
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            @media print {
              body { margin: 0; }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            
            h1 { color: #2d5a3d; margin-bottom: 20px; }
            h2 { color: #4a7c59; margin-top: 30px; margin-bottom: 15px; }
            
            .header-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 30px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #2d5a3d;
              color: white;
              font-weight: bold;
            }
            
            .stats-card {
              display: inline-block;
              background: #e8f5e8;
              padding: 15px;
              margin: 10px;
              border-radius: 5px;
              text-align: center;
              min-width: 150px;
            }
            
            .stats-value {
              font-size: 24px;
              font-weight: bold;
              color: #2d5a3d;
            }
            
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          <h1>💰 Expense Report</h1>
          
          <div class="header-info">
            <strong>Report Generated:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Transactions:</strong> ${data.expenses.length}<br>
            ${options.dateRange ? `<strong>Date Range:</strong> ${options.dateRange.from} to ${options.dateRange.to}<br>` : ''}
            ${options.categories?.length ? `<strong>Categories:</strong> ${options.categories.join(', ')}<br>` : ''}
          </div>
    `;

    if (options.includeStats) {
      htmlContent += `
          <h2>📊 Summary Statistics</h2>
          <div>
            <div class="stats-card">
              <div class="stats-value">${formatCurrency(data.stats.totalAmount)}</div>
              <div>Total Spent</div>
            </div>
            <div class="stats-card">
              <div class="stats-value">${formatCurrency(data.stats.averageAmount)}</div>
              <div>Average per Transaction</div>
            </div>
            <div class="stats-card">
              <div class="stats-value">${data.stats.transactionCount}</div>
              <div>Total Transactions</div>
            </div>
          </div>
          
          <h2>🏷️ Category Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Transactions</th>
              </tr>
            </thead>
            <tbody>
      `;

      data.stats.categoryBreakdown.forEach(item => {
        const transactionCount = data.expenses.filter(e => e.category === item.category).length;
        htmlContent += `
          <tr>
            <td>${item.category}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.percentage.toFixed(1)}%</td>
            <td>${transactionCount}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
      `;
    }

    htmlContent += `
          <div class="page-break"></div>
          <h2>📋 Transaction Details</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.expenses.forEach(expense => {
      htmlContent += `
        <tr>
          <td>${new Date(expense.date).toLocaleDateString()}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>${formatCurrency(expense.amount)}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  }

  private static downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  }

  static async exportWithOptions(expenses: Expense[], options: ExportOptions): Promise<void> {
    const data = this.prepareData(expenses, options);
    
    switch (options.format) {
      case 'csv':
        await this.exportToCSV(data, options);
        break;
      case 'excel':
        await this.exportToExcel(data, options);
        break;
      case 'pdf':
        await this.exportToPDF(data, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }
}