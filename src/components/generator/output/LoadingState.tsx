
export function LoadingState() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
      <p className="text-sm text-muted-foreground">
        Generating your prompt...
      </p>
    </div>
  );
}
