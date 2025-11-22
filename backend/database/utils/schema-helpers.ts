import mongoose from "mongoose";

export function deduplicateObjectIds(ids: mongoose.Types.ObjectId[]): mongoose.Types.ObjectId[] {
  const uniqueIds = new Set<string>();
  return ids.filter((id: mongoose.Types.ObjectId) => {
    const idStr = id.toString();
    if (uniqueIds.has(idStr)) return false;
    uniqueIds.add(idStr);
    return true;
  });
}

export function deduplicateStrings(strings: string[]): string[] {
  return Array.from(new Set(strings.filter((str: string) => str.trim().length > 0)));
}

export function updateTimestampPreSave(this: mongoose.Document) {
  this.set("updatedAt", new Date());
}

