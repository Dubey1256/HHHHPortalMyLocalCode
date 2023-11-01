// import React from "react";

// // from this line below is from lodash.escapeRegExp
// const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
// const reHasRegExpChar = RegExp(reRegExpChar.source);

// function escapeRegExp(string: string): string {
//   return string && reHasRegExpChar.test(string)
//     ? string.replace(reRegExpChar, "\\$&")
//     : string || "";
// }

// export default function HighlightableCell({ value, searchTerm }:any) {
//   if (!searchTerm) {
//     return <span>{value}</span>;
//   }

//   const searchRegex = new RegExp(`(${escapeRegExp(searchTerm)})`, "ig");
//   const highlightedText = value?.replace(
//     searchRegex,
//     '<span class="cell-search-highlight" style="background:yellow;">$1</span>'
//   );

//   return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
// }






import React from "react";
// from this line below is from lodash.escapeRegExp
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

function escapeRegExp(string: string): string {
  return string && reHasRegExpChar.test(string)
    ? string.replace(reRegExpChar, "\\$&")
    : string || "";
}

function replaceMatched(value: any, searchTerm: any) {
  const searchRegex = new RegExp(`(${escapeRegExp(searchTerm)})`, "ig");
  return value?.replace(
    searchRegex,
    // '<span class="cell-search-highlight" style="background:yellow;">$1</span>'
    '{{$1}}'
  );
}

export default function HighlightableCell({ value, searchTerm }: any) {
  searchTerm = (searchTerm || '').trim();
  if (!searchTerm || !value) {
    return <span>{value}</span>;
  }

  let highlightedText = replaceMatched(value, searchTerm);

  if (!highlightedText.includes('{{')) {
    searchTerm.split(" ").forEach((element: any) => {
      highlightedText = replaceMatched(highlightedText, element);
    });
  }
  highlightedText = highlightedText.replaceAll('{{', '<span class="cell-search-highlight" style="background:yellow;">')
  highlightedText = highlightedText.replaceAll('}}', '</span>')

  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
}
