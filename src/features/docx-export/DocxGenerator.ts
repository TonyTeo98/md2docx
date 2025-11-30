import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  WidthType,
  convertInchesToTwip,
} from 'docx';
import { marked } from 'marked';

export interface DocxGeneratorOptions {
  title?: string;
  author?: string;
  pageSize?: 'A4' | 'Letter';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  defaultFont?: string;
  defaultFontSize?: number;
}

interface MarkdownToken {
  type: string;
  raw: string;
  text?: string;
  depth?: number;
  tokens?: MarkdownToken[];
  items?: MarkdownToken[];
  header?: MarkdownToken[];
  rows?: MarkdownToken[][];
  lang?: string;
  ordered?: boolean;
}

export class DocxGenerator {
  private options: Required<DocxGeneratorOptions>;

  constructor(options: DocxGeneratorOptions = {}) {
    this.options = {
      title: options.title || 'Untitled Document',
      author: options.author || '',
      pageSize: options.pageSize || 'A4',
      margins: options.margins || {
        top: 72,
        right: 72,
        bottom: 72,
        left: 72,
      },
      defaultFont: options.defaultFont || 'SimSun',
      defaultFontSize: options.defaultFontSize || 24,
    };
  }

  async generate(markdown: string): Promise<Blob> {
    const tokens = marked.lexer(markdown);
    const children = this.convertTokensToDocx(tokens as MarkdownToken[]);

    const doc = new Document({
      creator: this.options.author,
      title: this.options.title,
      sections: [
        {
          properties: {
            page: {
              size: this.getPageSize(),
              margin: {
                top: convertInchesToTwip(this.options.margins.top / 72),
                right: convertInchesToTwip(this.options.margins.right / 72),
                bottom: convertInchesToTwip(this.options.margins.bottom / 72),
                left: convertInchesToTwip(this.options.margins.left / 72),
              },
            },
          },
          children,
        },
      ],
      styles: {
        default: {
          document: {
            run: {
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
            },
          },
        },
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            run: {
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
            },
            paragraph: {
              spacing: { after: 120 },
            },
          },
        ],
      },
    });

    return await Packer.toBlob(doc);
  }

  private getPageSize() {
    if (this.options.pageSize === 'Letter') {
      return {
        width: convertInchesToTwip(8.5),
        height: convertInchesToTwip(11),
      };
    }
    // A4
    return {
      width: convertInchesToTwip(8.27),
      height: convertInchesToTwip(11.69),
    };
  }

  private convertTokensToDocx(tokens: MarkdownToken[]): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case 'heading':
          elements.push(this.createHeading(token));
          break;

        case 'paragraph':
          elements.push(this.createParagraph(token));
          break;

        case 'table':
          elements.push(this.createTable(token));
          break;

        case 'code':
          elements.push(...this.createCodeBlock(token));
          break;

        case 'list':
          elements.push(...this.createList(token));
          break;

        case 'blockquote':
          elements.push(this.createBlockquote(token));
          break;

        case 'hr':
          elements.push(this.createHorizontalRule());
          break;

        case 'space':
          // Skip empty spaces
          break;

        default:
          if (token.text) {
            elements.push(
              new Paragraph({
                children: this.parseInlineTokens(token.tokens || []),
              })
            );
          }
          break;
      }
    }

    return elements;
  }

  private createHeading(token: MarkdownToken): Paragraph {
    const levelMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4,
      5: HeadingLevel.HEADING_5,
      6: HeadingLevel.HEADING_6,
    };

    const sizeMap: Record<number, number> = {
      1: 44,
      2: 36,
      3: 32,
      4: 28,
      5: 24,
      6: 22,
    };

    const depth = token.depth || 1;

    return new Paragraph({
      heading: levelMap[depth] || HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: token.text || '',
          bold: true,
          size: sizeMap[depth] || 24,
          font: this.options.defaultFont,
        }),
      ],
      spacing: { before: 240, after: 120 },
    });
  }

  private createParagraph(token: MarkdownToken): Paragraph {
    return new Paragraph({
      children: this.parseInlineTokens(token.tokens || []),
      spacing: { after: 120 },
    });
  }

  private parseInlineTokens(
    tokens: MarkdownToken[],
    extra: Record<string, unknown> = {}
  ): TextRun[] {
    const runs: TextRun[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case 'text':
          runs.push(
            new TextRun({
              text: token.text || token.raw || '',
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
              ...extra,
            })
          );
          break;

        case 'strong':
          runs.push(
            new TextRun({
              text: token.text || '',
              bold: true,
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
              ...extra,
            })
          );
          break;

        case 'em':
          runs.push(
            new TextRun({
              text: token.text || '',
              italics: true,
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
              ...extra,
            })
          );
          break;

        case 'codespan':
          runs.push(
            new TextRun({
              text: token.text || '',
              font: 'Courier New',
              size: this.options.defaultFontSize - 2,
              shading: { fill: 'f4f4f4' },
              ...extra,
            })
          );
          break;

        case 'link':
          runs.push(
            new TextRun({
              text: token.text || '',
              color: '0066cc',
              underline: {},
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
              ...extra,
            })
          );
          break;

        default:
          if (token.text) {
            runs.push(
              new TextRun({
                text: token.text,
                font: this.options.defaultFont,
                size: this.options.defaultFontSize,
                ...extra,
              })
            );
          }
          break;
      }
    }

    return runs;
  }

  private createTable(token: MarkdownToken): Table {
    const headerCells = (token.header || []).map((cell) =>
      new TableCell({
        children: [
          new Paragraph({
            children:
              this.parseInlineTokens(cell.tokens || [], { bold: true }).length >
              0
                ? this.parseInlineTokens(cell.tokens || [], { bold: true })
                : [
                    new TextRun({
                      text: cell.text || '',
                      bold: true,
                      font: this.options.defaultFont,
                      size: this.options.defaultFontSize,
                    }),
                  ],
          }),
        ],
        shading: { fill: 'f0f0f0' },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      })
    );

    const headerRow = new TableRow({
      children: headerCells,
      tableHeader: true,
    });

    const bodyRows = (token.rows || []).map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children:
                      this.parseInlineTokens(cell.tokens || []).length > 0
                        ? this.parseInlineTokens(cell.tokens || [])
                        : [
                            new TextRun({
                              text: cell.text || '',
                              font: this.options.defaultFont,
                              size: this.options.defaultFontSize,
                            }),
                          ],
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              })
          ),
        })
    );

    return new Table({
      rows: [headerRow, ...bodyRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    });
  }

  private createCodeBlock(token: MarkdownToken): Paragraph[] {
    const lines = (token.text || '').split('\n');
    return lines.map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line || ' ',
              font: 'Courier New',
              size: 20,
            }),
          ],
          shading: { fill: 'f4f4f4' },
          spacing: { after: 0 },
        })
    );
  }

  private createList(token: MarkdownToken): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    const items = token.items || [];
    const ordered = token.ordered || false;

    items.forEach((item, index) => {
      const bullet = ordered ? `${index + 1}. ` : '• ';
      const contentRuns = this.parseInlineTokens(item.tokens || []);
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: bullet,
              font: this.options.defaultFont,
              size: this.options.defaultFontSize,
            }),
            ...(contentRuns.length
              ? contentRuns
              : [
                  new TextRun({
                    text: item.text || '',
                    font: this.options.defaultFont,
                    size: this.options.defaultFontSize,
                  }),
                ]),
          ],
          indent: { left: 720 },
          spacing: { after: 60 },
        })
      );
    });

    return paragraphs;
  }

  private createBlockquote(token: MarkdownToken): Paragraph {
    return new Paragraph({
      children: this.parseInlineTokens(token.tokens || []),
      indent: { left: 720 },
      border: {
        left: { style: BorderStyle.SINGLE, size: 24, color: '667eea' },
      },
      shading: { fill: 'f9f9f9' },
      spacing: { after: 120 },
    });
  }

  private createHorizontalRule(): Paragraph {
    return new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: 'cccccc' },
      },
      spacing: { before: 240, after: 240 },
    });
  }
}

export async function generateDocx(
  markdown: string,
  options?: DocxGeneratorOptions
): Promise<Blob> {
  const generator = new DocxGenerator(options);
  return generator.generate(markdown);
}
