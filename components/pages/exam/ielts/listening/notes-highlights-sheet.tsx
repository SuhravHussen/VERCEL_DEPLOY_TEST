import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Highlighter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HighlightData } from "@/types/listening-test";

interface NotesHighlightsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  highlights: HighlightData[];
  notes: Record<string, string>;
  onRemoveAllHighlights: () => Promise<void>;
  onDeleteNote: (selectedText: string) => void;
}

export default function NotesHighlightsSheet({
  isOpen,
  onOpenChange,
  highlights,
  notes,
  onRemoveAllHighlights,
  onDeleteNote,
}: NotesHighlightsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes & Highlights
          </SheetTitle>
          <SheetDescription>
            Manage your notes and highlights for this test.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Highlights Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                Highlights ({highlights.length})
              </h3>
              {highlights.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onRemoveAllHighlights}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove All
                </Button>
              )}
            </div>

            {highlights.length === 0 ? (
              <div className="p-4 border-2 border-dashed  rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No highlights yet. Select text and right-click to highlight.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    >
                      <p className="text-sm text-foreground leading-relaxed">
                        &quot;{highlight.text}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes ({Object.keys(notes).length})
            </h3>

            {Object.keys(notes).length === 0 ? (
              <div className="p-4 border-2 border-dashed rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No notes yet. Select text and right-click to add notes.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {Object.entries(notes).map(([selectedText, note]) => (
                    <div
                      key={selectedText}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">
                            &quot;{selectedText}&quot;
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {note}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteNote(selectedText)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-auto shrink-0"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
