import { jsPDF } from 'jspdf';
import { Article } from '@/components/news-tile';

export const generatePDF = (article: Article) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(article.title, 20, 20);

  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(article.fullPreview, 170);
  doc.text(splitText, 20, 30);

  doc.text(`Source: ${article.url}`, 20, doc.internal.pageSize.height - 20);

  doc.save(`${article.title.slice(0, 20)}.pdf`);
};
