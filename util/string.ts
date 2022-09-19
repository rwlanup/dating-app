export const decryptBase64URL = (base64URL: string): { mimeType: string; data: string } | undefined => {
  const base64WithMimeRegex = new RegExp(
    '^(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?$',
    'gi'
  );
  const isValid = base64WithMimeRegex.test(base64URL);
  if (isValid) {
    const indexOfEncoding = base64URL.indexOf(';base64,');
    return {
      mimeType: base64URL.substring(5, indexOfEncoding), // Here 5 represents length of "data:"
      data: base64URL.substring(indexOfEncoding + 8), // Here 8 represents length of ";base64,"
    };
  }
};

export const resolveBase64ImageUrl = (mime?: string | null, buffer?: Buffer | null): string | undefined => {
  if (mime && buffer) {
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }
};
