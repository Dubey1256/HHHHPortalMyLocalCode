import React from "react";

// from this line below is from lodash.escapeRegExp
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

function escapeRegExp(string: string): string {
  return string && reHasRegExpChar.test(string)
    ? string.replace(reRegExpChar, "\\$&")
    : string || "";
}

export default function HighlightableCell({ value, searchTerm }:any) {
  if (!searchTerm) {
    return <div>{value}</div>;
  }

  const searchRegex = new RegExp(`(${escapeRegExp(searchTerm)})`, "ig");
  const highlightedText = value.replace(
    searchRegex,
    '<span class="cell-search-highlight" style="background:yellow;">$1</span>'
  );

  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
}
