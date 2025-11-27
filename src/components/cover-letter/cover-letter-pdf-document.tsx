'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, StyleSheet, Text, View } from '@react-pdf/renderer';
import { memo, useMemo } from 'react';

const styles = StyleSheet.create({
    page: {
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: 48,
        paddingRight: 48,
        fontFamily: 'Helvetica',
        color: '#111827',
        fontSize: 10.5,
        lineHeight: 1.3,
    },
    content: {
        fontSize: 10.5,
        lineHeight: 1.3,
        color: '#111827',
    },
    paragraph: {
        marginBottom: 6,
        textAlign: 'left',
    },
});

interface CoverLetterPDFDocumentProps {
  resume: Resume;
}

function stripHtml(html: string): string {
  // Remove HTML tags and convert basic formatting
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

export const CoverLetterPDFDocument = memo(function CoverLetterPDFDocument({ resume }: CoverLetterPDFDocumentProps) {
  const coverLetterContent = useMemo(() => {
    if (!resume.cover_letter?.content || typeof resume.cover_letter.content !== 'string') return '';
    return stripHtml(resume.cover_letter.content);
  }, [resume.cover_letter?.content]);

  const paragraphs = useMemo(() => {
    return coverLetterContent.split('\n\n').filter(p => p.trim().length > 0);
  }, [coverLetterContent]);

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={styles.page}>
        {/* Cover letter content */}
        <View style={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph.trim()}
            </Text>
          ))}
        </View>
      </PDFPage>
    </PDFDocument>
  );
});
