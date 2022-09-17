export const resolveBase64ImageUrl = (base64Str: string | undefined | null): string | undefined => {
  if (base64Str) {
    return `data:image/${base64Str.slice(10, base64Str.indexOf('base64'))};base64,/${base64Str.substr(
      base64Str.indexOf('base64') + 7
    )}`;
  }
};
