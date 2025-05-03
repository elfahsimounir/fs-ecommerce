export const formatSlug = (slug: string): string => {
    return encodeURIComponent(slug.toLowerCase()); // Convert to lowercase and encode
  };

  export function sliceString(input: string, maxChar: number): string {
    if (!input || maxChar <= 0) {
      return "";
    }
  
    return input.length > maxChar ? input.slice(0, maxChar) + "..." : input;
  }