import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type QueryErrorStateProps = {
    error: Error;
    refetch: () => void;
}

export function QueryErrorState({error, refetch}: QueryErrorStateProps) {
  return (
    <>
      <Alert
        variant="destructive"
        className="w-full text-center h-full flex flex-col items-center justify-center"
      >
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <Button
          onClick={() => refetch()}
          variant="secondary"
          size="sm"
          className="mt-3 mx-auto min-w-96"
        >
          Retry
        </Button>
      </Alert>
    </>
  );
}
