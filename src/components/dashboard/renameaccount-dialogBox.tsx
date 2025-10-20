import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RenameAccountDialogProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
};

export const RenameAccountDialog = ({
  open,
  onOpen,
}: RenameAccountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-8">
        <DialogHeader>
          <DialogTitle>Rename Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="dark:text-white/75 text-lg">Coming soon!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
